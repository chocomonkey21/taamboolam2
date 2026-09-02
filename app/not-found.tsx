import { ButtonLink } from "@/components/Button";
import { Datum } from "@/components/Datum";
import { TileGlyph } from "@/components/TileMotif";
import { activeCopy } from "@/lib/server-locale";

/**
 * The one page a reader reaches by mistake.
 *
 * Same ground, same type, same tile mark as everywhere else — a stock
 * unbranded 404 is the only screen on the site that would look like it
 * belonged to a different house. It offers the two things that are actually
 * useful from here and nothing else.
 */
export default async function NotFound() {
  const t = await activeCopy();

  return (
    <section
      className="texture-limewash relative bg-atmos"
      data-atmosphere="house"
    >
      <div className="container-content flex min-h-[70svh] flex-col justify-center pt-32 pb-20 sm:pt-40">
        <Datum note={t.notFound.eyebrow} className="max-w-[46rem]">
          <TileGlyph className="w-9 text-clay opacity-40" />
          <h1 className="type-h1 mt-7">{t.notFound.heading}</h1>
          <p className="type-lead measure mt-5 text-ink-soft">
            {t.notFound.body}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink href="/">{t.cta.backHome}</ButtonLink>
            <ButtonLink href="/experience" variant="outline">
              {t.cta.explore}
            </ButtonLink>
          </div>
        </Datum>
      </div>
    </section>
  );
}
