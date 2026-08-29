import type { Metadata } from "next";
import { ButtonLink, TextLink } from "@/components/Button";
import { FeatureStrip } from "@/components/FeatureStrip";
import { Photo } from "@/components/Photo";
import { TileGlyph } from "@/components/TileMotif";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Taamboolam — A homestay in Jayanagar, Bengaluru",
  description: site.description,
  alternates: { canonical: "/" },
};

const glimpse = [
  {
    src: "/images/living-room.jpg",
    alt: "The shared living room at Taamboolam, with plants by the window and low seating.",
    brief: "The shared living room. Wide, taken in daylight.",
    aspect: "3 / 2",
    span: "md:col-span-8",
    sizes: "(min-width: 768px) 62vw, 100vw",
  },
  {
    src: "/images/room.jpg",
    alt: "A guest room with a made bed, a bedside lamp and a window onto the street.",
    brief: "One guest room. Made bed, window in frame.",
    aspect: "3 / 4",
    span: "md:col-span-4",
    sizes: "(min-width: 768px) 30vw, 100vw",
  },
  {
    src: "/images/balcony.jpg",
    alt: "The balcony, with plants along the railing and a chair in the corner.",
    brief: "The balcony or terrace, with the plants in frame.",
    aspect: "3 / 4",
    span: "md:col-span-4",
    sizes: "(min-width: 768px) 30vw, 100vw",
  },
  {
    src: "/images/corner.jpg",
    alt: "A quiet corner of the house with a chair, a lamp and a stack of books.",
    brief: "A quiet corner. A chair, a lamp, one strong shadow.",
    aspect: "3 / 2",
    span: "md:col-span-8",
    sizes: "(min-width: 768px) 62vw, 100vw",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero — the photo leads. One sentence, no more. ------------------ */}
      <section className="relative isolate min-h-[78svh] w-full md:min-h-[86svh]">
        <div className="absolute inset-0 -z-10">
          <Photo
            src="/images/hero.jpg"
            alt="The front of the Taamboolam house in Jayanagar, seen in the evening."
            brief="Hero photo — the house from the street, or the room that best shows what staying here feels like. Wide, natural light."
            aspect="auto"
            priority
            rounded={false}
            placeholderTone="dark"
            sizes="100vw"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/30 to-foreground/10"
          />
        </div>

        <div className="container-content flex min-h-[78svh] flex-col justify-end pb-14 md:min-h-[86svh] md:pb-20">
          <h1 className="type-display max-w-[16ch] text-background">
            {site.name}
          </h1>
          <p className="type-body mt-5 max-w-[34ch] text-background/90 md:mt-6">
            {site.tagline}
          </p>
          <div className="mt-9 md:mt-10">
            <ButtonLink href="/enquire">Enquire about a stay</ButtonLink>
          </div>
        </div>
      </section>

      {/* Intro strip ------------------------------------------------------ */}
      <section className="section-rhythm">
        <div className="container-content">
          <div className="measure">
            <p className="type-eyebrow">
              {site.location.area} · {site.location.region}
            </p>
            <p className="type-h2 mt-6">
              Taamboolam is a family house in south Bengaluru with a few rooms
              for guests. It is not a hotel, and it does not try to be.
            </p>
            <p className="type-body mt-6 text-foreground-muted">
              You get a room, a quiet street, and breakfast in the morning. You
              also get someone who lives here and can tell you where to eat,
              which bus to take, and what is worth your afternoon.
            </p>
          </div>
        </div>
      </section>

      {/* Neighbourhood strip --------------------------------------------- */}
      <FeatureStrip
        src="/images/street.jpg"
        alt="A tree-lined residential street in Jayanagar, with shade across the road."
        brief="The street outside, or another Jayanagar street. Trees and shade in frame."
        eyebrow="The neighbourhood"
        line="Jayanagar, where the streets still have trees."
        body="We are in 8th Block, a few streets off Sarakki Main Road. It is a residential part of the city, so mornings are quiet and most things you need are a short walk away."
        href="/experience"
        linkLabel="More about the area"
        tone="surface"
      />

      {/* Property glimpse — curated, not a catalogue ---------------------- */}
      <section className="section-rhythm">
        <div className="container-content">
          <div className="measure">
            <p className="type-eyebrow">The house</p>
            <h2 className="type-h1 mt-5">A few rooms and a lot of light.</h2>
            <p className="type-body mt-5 text-foreground-muted">
              We keep the number of guests small on purpose. It stays quiet that
              way, and there is always somewhere to sit that is not your room.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-12 md:gap-6 lg:gap-8">
            {glimpse.map((photo) => (
              <div key={photo.src} className={photo.span}>
                <Photo
                  src={photo.src}
                  alt={photo.alt}
                  brief={photo.brief}
                  aspect={photo.aspect}
                  sizes={photo.sizes}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mornings --------------------------------------------------------- */}
      <section className="bg-surface">
        <div className="section-rhythm container-content grid items-center gap-10 md:grid-cols-12 md:gap-6 lg:gap-16">
          <div className="md:col-span-7">
            <Photo
              src="/images/breakfast.jpg"
              alt="Breakfast laid out on the table, with coffee poured and plates ready."
              brief="Breakfast on the table. Daylight, no flash. Hands in frame if you can."
              aspect="3 / 2"
              sizes="(min-width: 768px) 55vw, 100vw"
            />
          </div>
          <div className="md:col-span-5">
            <p className="type-eyebrow">Mornings</p>
            <h2 className="type-h1 mt-5">Breakfast is part of the room.</h2>
            <p className="type-body mt-5 text-foreground-muted">
              We cook breakfast every morning and everyone eats at the same
              table. Tell us before you arrive if there is something you do not
              eat, and we will cook around it.
            </p>
            <p className="mt-8">
              <TextLink href="/experience">How a day here goes</TextLink>
            </p>
          </div>
        </div>
      </section>

      {/* Closing invitation ---------------------------------------------- */}
      <section className="section-rhythm-lg">
        <div className="container-content flex flex-col items-center text-center">
          <TileGlyph className="w-10 text-accent-primary opacity-40" />
          <h2 className="type-h1 mt-8 max-w-[18ch]">
            A few rooms. Real replies.
          </h2>
          <p className="type-body mt-5 max-w-[42ch] text-foreground-muted">
            There is no booking button here. Tell us about your trip and{" "}
            {site.host} will write back herself.
          </p>
          <div className="mt-10">
            <ButtonLink href="/enquire">Tell us about your trip</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
