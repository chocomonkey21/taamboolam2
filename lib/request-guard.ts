/**
 * The guard that runs in front of the enquiry endpoint.
 *
 * Everything here is deliberately cheap and ordered cheapest-first, because
 * the point of most of it is to reject an abusive request before the server
 * has done any work worth stealing. The previous ordering parsed the JSON body
 * first and checked the rate limit afterwards, which meant a flood still paid
 * full parse cost per request before being turned away.
 *
 * None of this is a substitute for edge protection. See SECURITY.md.
 */

import { FLOOR_PREFERENCES, VISIT_TYPES } from "./enquiry";

/* ══════════════════════════════════════════════════════════════════════
   Body size
   ══════════════════════════════════════════════════════════════════════ */

/**
 * The largest enquiry we will read.
 *
 * The two free-text fields are capped at 4000 characters each and every other
 * field is far smaller, so a legitimate enquiry is a few kilobytes at the very
 * most. 16KB leaves generous headroom for multi-byte Kannada text — every
 * Kannada character is three UTF-8 bytes — while refusing anything that is
 * obviously not a person filling in a form.
 *
 * Measured before this: a 2MB body was read and parsed in full before the
 * length validator rejected it.
 */
export const MAX_BODY_BYTES = 16 * 1024;

/**
 * Reject on the declared length before reading a byte.
 *
 * Content-Length can be absent (chunked) or lie, so this is the cheap first
 * pass, not the only one — readJsonLimited enforces the real ceiling while
 * streaming.
 */
export function declaredTooLarge(request: Request): boolean {
  const declared = request.headers.get("content-length");
  if (!declared) return false;
  const bytes = Number(declared);
  return Number.isFinite(bytes) && bytes > MAX_BODY_BYTES;
}

/**
 * Read the body, refusing to buffer more than the cap.
 *
 * `request.json()` will happily buffer whatever arrives; this stops at the
 * ceiling and abandons the rest, so a lying Content-Length buys nothing.
 */
export async function readJsonLimited(
  request: Request,
): Promise<{ ok: true; value: unknown } | { ok: false; reason: "too-large" | "malformed" }> {
  const body = request.body;
  if (!body) return { ok: false, reason: "malformed" };

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => {});
        return { ok: false, reason: "too-large" };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false, reason: "malformed" };
  }

  const joined = new Uint8Array(total);
  let at = 0;
  for (const c of chunks) {
    joined.set(c, at);
    at += c.byteLength;
  }

  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(joined)) };
  } catch {
    return { ok: false, reason: "malformed" };
  }
}

/* ══════════════════════════════════════════════════════════════════════
   Payload shape
   ══════════════════════════════════════════════════════════════════════ */

/**
 * Coerce an arbitrary parsed JSON value into the shape the validator expects.
 *
 * This is the fix for a confirmed defect: the route used to spread the parsed
 * body straight over the defaults and trust a TypeScript cast to make it a
 * string. It is not one. `{"website": 12345}`, `{"name": null}` and
 * `{"adults": {}}` each reached `.trim()` on a non-string and threw, and the
 * endpoint answered 500 — three unauthenticated server errors from three
 * trivial bodies. Verified against the running site before and after.
 *
 * Anything that is not a string is dropped rather than stringified. Turning
 * `{}` into "[object Object]" would let malformed input through as data, and
 * the validator would then complain about the wrong thing.
 */
export function asCleanStrings<T extends Record<string, unknown>>(
  defaults: T,
  payload: unknown,
): T {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
    return { ...defaults };
  }

  const source = payload as Record<string, unknown>;
  const out: Record<string, unknown> = { ...defaults };

  for (const key of Object.keys(defaults)) {
    /* Own properties only. A body carrying `__proto__` or `constructor`
       cannot reach the output object, and Object.keys(defaults) already
       bounds this to fields we asked for — an unknown key in the body is
       ignored rather than merged. */
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;

    const incoming = source[key];
    const fallback = defaults[key];

    if (typeof fallback === "boolean") {
      if (typeof incoming === "boolean") out[key] = incoming;
      continue;
    }

    if (typeof incoming === "string") out[key] = incoming;
    // Any other type keeps the default, which is "" for every text field.
  }

  return out as T;
}

/**
 * Are the closed-set fields actually members of their sets?
 *
 * asCleanStrings fixes values of the wrong type. These are the right type —
 * strings — and simply not members, which is a different bug and was still
 * live after that fix. Probed against the running site:
 *
 *   {"visitType":"evil"}          → the label lookup returned undefined,
 *                                   escapeHtml(undefined) threw, 500.
 *   {"floorPreference":"__proto__"} → the floors lookup reached into
 *                                   Object.prototype, .label was undefined, 500.
 *
 * The second is why this checks membership of an explicit list rather than
 * truthiness of a lookup: `floors["__proto__"]` is truthy.
 *
 * A real browser cannot produce either. A request carrying one did not come
 * from our form, so the route answers 400 rather than 422 — there is no
 * field for the sender to correct.
 */
export function enumsValid(values: {
  visitType: string;
  floorPreference: string;
  arrival: string;
  departure: string;
}): boolean {
  /* Imported, not retyped. These two lists used to be a second copy written
     out by hand here, and the copy went stale the moment the floors changed:
     removing "floor4" and adding "terrace" in lib/enquiry.ts left this guard
     still rejecting every terrace enquiry with 400 and still waving through
     a preference for the private fourth floor. Caught by posting both values
     at the running endpoint, not by reading the file.

     There is now one list. A future change to the floors cannot desynchronise
     the form from the guard, because there is nothing left to desynchronise. */
  if (!(VISIT_TYPES as readonly string[]).includes(values.visitType)) {
    return false;
  }
  if (!(FLOOR_PREFERENCES as readonly string[]).includes(values.floorPreference)) {
    return false;
  }

  /* A date input can only ever produce this shape. Anything else reaches
     formatDate, which hands an unparseable string straight back into the
     owner's email. */
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;
  for (const value of [values.arrival, values.departure]) {
    if (value !== "" && !isoDate.test(value)) return false;
  }

  return true;
}

/* ══════════════════════════════════════════════════════════════════════
   Origin
   ══════════════════════════════════════════════════════════════════════ */

/**
 * Is this POST coming from our own pages?
 *
 * A browser sending `application/json` cross-origin has to pass a CORS
 * preflight first, and nothing here answers one, so a browser on another site
 * already cannot reach this endpoint. What this adds is a cheap refusal of the
 * scripted case — a request that carries somebody else's Origin, or a Host
 * that is not ours — before any parsing happens.
 *
 * A request with NO Origin header is allowed through. curl sends none, and so
 * do some privacy tools and same-origin form posts; refusing those would break
 * real people to inconvenience an attacker who can simply omit the header.
 * This raises cost; it does not establish identity.
 */
export function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }

  const self = request.headers.get("host");
  if (self && host === self) return true;

  /* Set to the production domain once it is live. Vercel supplies its own
     deployment host in VERCEL_URL, which covers preview URLs too. */
  const configured = [
    process.env.NEXT_PUBLIC_SITE_HOST,
    process.env.VERCEL_URL,
    process.env.VERCEL_BRANCH_URL,
  ].filter(Boolean) as string[];

  return configured.some((allowed) => host === allowed.replace(/^https?:\/\//, ""));
}

/* ══════════════════════════════════════════════════════════════════════
   Throttling — a boundary, not a product
   ══════════════════════════════════════════════════════════════════════ */

export type ThrottleVerdict = { allowed: true } | { allowed: false; retryAfter: number };

export interface ThrottleStore {
  /** Count one hit against `key`, and say whether it is over `limit`. */
  hit(key: string, limit: number, windowMs: number): Promise<ThrottleVerdict>;
  /** True if this store survives across instances and restarts. */
  readonly durable: boolean;
}

/**
 * The default store: a Map in one process.
 *
 * Honest about what it is. On a platform that runs several instances, or that
 * freezes and thaws them between requests, each instance counts separately and
 * the effective limit is looser than the number asked for — by roughly the
 * instance count. It raises the cost of casual abuse and does nothing against
 * a distributed one.
 *
 * It is the DEFAULT rather than the ANSWER. `durable` is false so the rest of
 * the app can tell the difference, and SECURITY.md documents the swap.
 */
class MemoryThrottleStore implements ThrottleStore {
  readonly durable = false;
  private hits = new Map<string, { count: number; resetAt: number }>();

  async hit(key: string, limit: number, windowMs: number): Promise<ThrottleVerdict> {
    const now = Date.now();
    const entry = this.hits.get(key);

    if (!entry || now > entry.resetAt) {
      this.hits.set(key, { count: 1, resetAt: now + windowMs });
      /* Bounded growth: sweep expired keys when the map gets large. Only runs
         as a new window opens, so it is not on the hot path. */
      if (this.hits.size > 5000) {
        for (const [k, v] of this.hits) if (now > v.resetAt) this.hits.delete(k);
      }
      return { allowed: true };
    }

    if (entry.count >= limit) {
      return {
        allowed: false,
        retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
      };
    }

    entry.count += 1;
    return { allowed: true };
  }
}

/**
 * The store the app uses.
 *
 * Swapping in a durable one — Vercel KV, Upstash, Redis — means implementing
 * ThrottleStore against it and returning it here. Nothing else in the app
 * changes, and no dependency is added until somebody decides which provider.
 */
let store: ThrottleStore = new MemoryThrottleStore();

export function throttleStore(): ThrottleStore {
  return store;
}

/** For tests, and for wiring a durable store at startup. */
export function setThrottleStore(next: ThrottleStore): void {
  store = next;
}

/**
 * The client address, as far as it can be known.
 *
 * The left-most x-forwarded-for entry is the original client; everything after
 * it is a proxy. A caller can forge the whole header, so this is a throttle
 * key and never an identity or an audit record.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * A short, non-reversible fingerprint.
 *
 * Used to throttle by email address and to spot a duplicate submission without
 * keeping the address itself in memory. FNV-1a: not a security hash and not
 * meant to be — it exists so that a process holding throttle state is not also
 * holding a list of everyone who has written in.
 */
export function fingerprint(...parts: string[]): string {
  const input = parts.join("\u0000").toLowerCase();
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

/* ══════════════════════════════════════════════════════════════════════
   Timeouts
   ══════════════════════════════════════════════════════════════════════ */

/**
 * Give a promise a deadline.
 *
 * The mail provider call had none. A provider that accepts a connection and
 * then hangs would hold a serverless invocation open until the platform's own
 * timeout, which is both a bill and a way to exhaust concurrency.
 */
export async function withTimeout<T>(
  work: Promise<T>,
  ms: number,
): Promise<{ timedOut: false; value: T } | { timedOut: true }> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const deadline = new Promise<{ timedOut: true }>((resolve) => {
    timer = setTimeout(() => resolve({ timedOut: true }), ms);
  });

  try {
    return await Promise.race([
      work.then((value) => ({ timedOut: false as const, value })),
      deadline,
    ]);
  } finally {
    /* Always cleared: a pending timer would keep the event loop alive and,
       on a serverless runtime, delay the invocation from freezing. */
    if (timer) clearTimeout(timer);
  }
}
