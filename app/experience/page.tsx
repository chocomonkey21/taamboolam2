import type { Metadata } from "next";
import { ButtonLink } from "@/components/Button";
import { FeatureStrip } from "@/components/FeatureStrip";
import { StorySection } from "@/components/StorySection";
import { TileDivider, TileGlyph } from "@/components/TileMotif";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Experience",
  description:
    "What staying at Taamboolam is actually like — the house, the Jayanagar streets around it, and how an ordinary day here goes.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <>
      {/* Page opening ---------------------------------------------------- */}
      <section className="section-rhythm border-b border-border">
        <div className="container-content">
          <p className="type-eyebrow">The Experience</p>
          <h1 className="type-display mt-6 max-w-[17ch]">
            What it is like to stay here.
          </h1>
          <p className="type-body measure mt-7 text-foreground-muted">
            Three things worth knowing before you write to us: what the house is
            like, what is around it, and how a day here actually goes.
          </p>
        </div>
      </section>

      {/* 01 — The House --------------------------------------------------- */}
      <StorySection
        id="house"
        index="01"
        eyebrow="The House"
        title="A house that was lived in first."
        src="/images/experience-house.jpg"
        alt="A wide view of the shared living space at Taamboolam, with light coming in from the street side."
        brief="Wide shot of the main shared space. Show how the light falls."
        detail="Rooms are cleaned every day, and we change linen between guests, not on a schedule."
      >
        <p className="type-body">
          This is a home, and the guest rooms were added to it. That is the
          whole difference. Nothing is laid out to a floor plan, and no two
          rooms are the same size.
        </p>
        <p className="type-body">
          Each room has a bed, a fan, storage, and a window that opens. There is
          hot water, and there is wifi that works. The rooms are quiet because
          the street is quiet.
        </p>
        <p className="type-body">
          Outside the rooms there is a sitting area, a table where people eat,
          and a balcony with plants on it. You are welcome to use all of it. Most
          guests end up on the balcony at some point in the evening.
        </p>
      </StorySection>

      <TileDivider />

      {/* 02 — The Neighbourhood ------------------------------------------- */}
      <StorySection
        id="neighbourhood"
        index="02"
        eyebrow="The Neighbourhood"
        title="Jayanagar moves slower than the rest of the city."
        src="/images/experience-street.jpg"
        alt="A quiet Jayanagar street lined with old trees, seen in the morning."
        brief="A Jayanagar street with its trees. Morning light, low traffic."
        detail="Almost everything here is walkable. You will not need a cab for breakfast."
      >
        <p className="type-body">
          Jayanagar is one of the older planned parts of Bengaluru. It was laid
          out in blocks, and the trees planted then are large now. Most of the
          streets are shaded.
        </p>
        <p className="type-body">
          We are in 8th Block, a few streets off Sarakki Main Road. It is
          residential, so the mornings are quiet. There are bakeries, small
          restaurants and a couple of good coffee places within a walk.
        </p>
        <p className="type-body">
          Sarakki Lake is close by if you want somewhere to walk in the morning.
          The Jayanagar 4th Block market is a short auto ride, and Lalbagh is
          about twenty minutes away.
        </p>
        <p className="type-body">
          If you are here to see the rest of the city, this is a good place to
          come back to at the end of the day.
        </p>
      </StorySection>

      <TileDivider />

      {/* 03 — A Day Here -------------------------------------------------- */}
      <StorySection
        id="day"
        index="03"
        eyebrow="A Day Here"
        title="Breakfast, then the day is yours."
        src="/images/experience-breakfast.jpg"
        alt="The breakfast table at Taamboolam, laid out for guests in the morning."
        brief="The table mid-breakfast. People eating, or the table just laid."
        detail="Tell us your arrival time and we will keep something aside if you land late."
      >
        <p className="type-body">
          Breakfast is cooked here every morning and everyone eats at the same
          table. It is usually South Indian, and there is coffee. If you do not
          eat something, tell us before you arrive.
        </p>
        <p className="type-body">
          After that the day is yours. We do not run tours and we do not have a
          schedule. What we do have is a person who lives here and knows the
          city, so ask.
        </p>
        <p className="type-body">
          You get a key and you come and go as you like. There is no reception
          and no one waiting up, but someone is always reachable on the phone.
        </p>
      </StorySection>

      {/* Who you are staying with ---------------------------------------- */}
      <FeatureStrip
        src="/images/experience-host.jpg"
        alt="The verandah at the front of the house, where guests sit in the evening."
        brief="Somewhere that suggests the host — the sitting area, the kitchen doorway, or a portrait if Radha is happy with one."
        eyebrow="Who you are staying with"
        line="You will be staying in Radha's house."
        body="She answers the enquiries, she is usually around at breakfast, and she is the one you ask when you need something. That is the whole staff list."
        flip
        tone="surface"
      />

      {/* Soft close ------------------------------------------------------- */}
      <section className="section-rhythm-lg">
        <div className="container-content flex flex-col items-center text-center">
          <TileGlyph className="w-10 text-accent-primary opacity-40" />
          <h2 className="type-h1 mt-8 max-w-[18ch]">
            Come see it for yourself.
          </h2>
          <p className="type-body mt-5 max-w-[42ch] text-foreground-muted">
            Photographs only go so far. Write to us and {site.host} will reply
            herself.
          </p>
          <div className="mt-10">
            <ButtonLink href="/enquire">Enquire about a stay</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
