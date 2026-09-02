import clsx from "clsx";
import {
  DESIGN_PHILOSOPHY_FOOTNOTES,
  DESIGN_PHILOSOPHY_META,
  DESIGN_PHILOSOPHY_PILLARS,
  DESIGN_PHILOSOPHY_THOUGHTS,
} from "./content";

function ArticleImage({
  alt,
  caption,
}: {
  alt: string;
  caption: string;
}) {
  return (
    <figure className="flex w-full flex-col gap-3">
      <div
        aria-label={alt}
        className="aspect-[16/10] w-full rounded-2xl bg-zinc-100 sm:rounded-3xl"
        role="img"
      />
      <figcaption className="font-['Lucas',sans-serif] text-sm font-normal text-zinc-400">
        {caption}
      </figcaption>
    </figure>
  );
}

type DesignPhilosophyContentProps = {
  variant?: "page" | "modal";
  className?: string;
};

export default function DesignPhilosophyContent({
  variant = "page",
  className,
}: DesignPhilosophyContentProps) {
  const isModal = variant === "modal";

  return (
    <article
      className={clsx(
        "w-full",
        isModal
          ? "mx-auto max-w-[800px] px-8 pb-16 pt-32"
          : "max-w-2xl px-6 py-12 md:px-16 md:py-16",
        className,
      )}
    >
      <header className={clsx("flex flex-col gap-4", isModal ? "mb-8" : "mb-10")}>
        <p className="font-['Lucas',sans-serif] text-sm font-normal text-zinc-400">
          {DESIGN_PHILOSOPHY_META.date}
        </p>
        <h1
          className={clsx(
            "text-balance font-['Lucas',sans-serif] font-medium text-zinc-700",
            isModal ? "text-3xl md:text-4xl" : "text-3xl md:text-4xl",
          )}
        >
          {DESIGN_PHILOSOPHY_META.title}
        </h1>
      </header>

      <div className="flex flex-col gap-6 font-['Lucas',sans-serif] text-base leading-relaxed text-zinc-600">
        <p className="text-pretty">
          Tonight, I just came back from the gym, and I&apos;m exhausted. I did core for the
          first time in a long time and almost threw up lol. (Pro tip; I should&apos;ve eaten
          after the gym)
        </p>
        <p className="text-pretty">
          I&apos;m hunched over, writing on a desk too small under a bunk bed too short.
        </p>
        <p className="text-pretty">
          I&apos;m writing on a laptop with a broken screen, effectively making it an iPad.
        </p>
        <p className="text-pretty">
          I just took my 43rd consecutive shower at the gym; this is because the showers at the
          place I&apos;m staying at are poorly maintained and unusable.
        </p>

        <h2 className="text-balance pt-2 text-2xl font-medium text-zinc-700">
          I should be weary, miserable and tired.
        </h2>

        <p className="text-pretty">
          Despite this, on the 30min walk back from the gym, I couldn&apos;t suppress this feeling
          of excitement and joy. More precisely; it felt like a sense of intense trepidation.
        </p>
        <p className="text-pretty">
          That&apos;s because tomorrow, and the day after, and the day after that, I have the
          privilege of getting into the office early at 7:00am. I get to grab a coffee and start
          ripping designs on Figma, sweating every little detail. I get to boot up Claude and
          spend hours building feature demos and bringing ideas to life. I get to sweat every
          granular detail at a company that respects and pushes me to be a better designer. I get
          to build, design, and contribute to one of the most highly anticipated products of 2027
          at such an early stage.
        </p>
        <p className="text-pretty">
          I am happy. I am filled with purpose. Above all, I am brimming with excitement.
        </p>

        <ArticleImage
          alt="The Ando team working together in the office"
          caption="The Ando office, where I spend 90% of my day (not including sleep)"
        />

        <h3 className="text-balance pt-2 text-xl font-medium text-zinc-700">
          Thoughts from a young, optimistic designer.
        </h3>

        <ul className="flex flex-col gap-3">
          {DESIGN_PHILOSOPHY_THOUGHTS.map((thought) => (
            <li
              key={thought}
              className="text-pretty text-sm font-normal text-zinc-500 before:mr-2 before:content-['-']"
            >
              {thought}
            </li>
          ))}
        </ul>

        <h2 className="text-balance pt-4 text-2xl font-medium text-zinc-700">
          My design philosophy
        </h2>

        <p className="text-pretty">
          Although I am early in my career, and likely blindly naive about a lot of things; I
          know that I enjoy design, and that I feel a strong sense of purpose &amp; fulfillment
          in the work I do.
        </p>
        <p className="text-pretty">
          Much of this is influenced by my design philosophy, which is currently inspired by the
          following:
        </p>

        <div className="flex flex-col gap-2 py-2">
          {DESIGN_PHILOSOPHY_PILLARS.map((pillar) => (
            <p key={pillar} className="text-pretty font-medium text-zinc-700">
              {pillar}
            </p>
          ))}
        </div>

        <section className="flex flex-col gap-4 pt-2">
          <h3 className="text-balance text-lg font-medium text-zinc-700">
            1. There has never been a better time to be a designer.
          </h3>
          <p className="text-pretty">
            Perhaps this is a contrarian take, but I am bullish on this. Taste is still a moat,
            the bar for visual mediocrity is higher ofc due to AI, but it&apos;s never been easier
            to learn, build and just create.
          </p>
          <p className="text-pretty">
            Tools are so so so accessible, and you can really go hard into interactions,
            prototyping, and building whatever the hell you want. In the last 1.5 months at Ando,
            I&apos;ve vicariously been learning about agents, AI, LLM&apos;s and how they function,
            work and operate. Harnesses, conductors, mental models, vector memory, context etc. All
            fascinating topics.
          </p>
          <p className="text-pretty">
            As of this moment I&apos;ve pushed 30+ PR&apos;s; I&apos;ve had wonderfully stimulating
            conversations with other engineers, and have shifted to a more agentically-aligned
            designer.
          </p>
          <blockquote className="border-l-2 border-zinc-200 pl-4 text-pretty italic text-zinc-500">
            <p>&ldquo;In a world of scarcity, we treasure tools.&rdquo;</p>
            <p>&ldquo;In a world of abundance, we treasure taste.&rdquo;</p>
          </blockquote>
          <p className="text-sm text-zinc-400">Anu Atluru, Taste is Eating Silicon Valley</p>
        </section>

        <section className="flex flex-col gap-4 pt-2">
          <h3 className="text-balance text-lg font-medium text-zinc-700">
            2. Curiosity, genuineness, and thoughtfulness have yet to fail me.
          </h3>
          <p className="text-pretty">
            Just asking questions, being proactive, and genuinely interested can get you so far!!
            So much of my own understanding of design, ai, and agents comes from just listening to
            those around me, asking silly questions (there are no dumb questions), and being
            excited and reading from resources online!
          </p>
          <p className="text-pretty">
            Questions with the right crowd can foster surprising and meaningful discussions. One
            such example occurred during Ando&apos;s Tulum retreat earlier this week. On the topic
            of agentic memory, I asked what RAM stood for (random access memory). This billowed
            into a lovely conversation about vector memory, analogies about how agentic memory
            mirrors our own neural systems, and a deeper dive on how we can optimize it.
          </p>
          <p className="text-pretty">
            Keep in mind before asking this, I didn&apos;t even know about memory as a component of
            ai.
          </p>

          <ArticleImage
            alt="The Ando team at breakfast during the Tulum retreat"
            caption="So many wonderful conversations get sparked as a byproduct of spending time together intentionally. (Ando Tulum 2026 retreat; breakfast)"
          />
        </section>

        <section className="flex flex-col gap-4 pt-2">
          <h3 className="text-balance text-lg font-medium text-zinc-700">
            3. Design is a labour of love.
          </h3>
          <p className="text-pretty">
            Give it your everything. Of course, this is adjacent to burnout mentality, so pace
            yourself. This also doesn&apos;t mean working 24/7 around the clock. Rather, be
            introspective, find what gets your gears going; what gets you excited, and then how to
            get the most leverage / impact out of it.
          </p>
          <p className="text-pretty">
            For me personally, I&apos;m very fortunate to have what I can only assume to be a
            natural affinity for work (that is a nice way of saying I&apos;m a workaholic). I am
            incredibly fortunate to be in San Francisco for this summer, working at a company with
            a very high bar for design. Working in SF has been my dream since 2nd year, and now
            the stars have aligned and here I am. While I may only be here for 4 months, you can
            be sure as hell that I intend to make the most and work the hardest these next 4
            months.
          </p>
          <p className="text-pretty">Re; pressure creates diamonds.</p>
          <p className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-pretty text-sm text-zinc-500">
            A Slack message: &ldquo;I dream to help make Ando world class :))))) It would be
            stellar.&rdquo;
          </p>
        </section>

        <section className="flex flex-col gap-4 pt-2">
          <h3 className="text-balance text-lg font-medium text-zinc-700">
            4. Don&apos;t be afraid to inspire, and likewise, aspire, at the same time.
          </h3>
          <p className="text-pretty">
            How fortunate am I that people look up to my designs :) I am honoured.
          </p>
          <p className="text-pretty">Hmm, this section is WIP.</p>
        </section>

        <h2 className="text-balance pt-4 text-2xl font-medium text-zinc-700">
          Disclaimer: perhaps I&apos;m just naive.
        </h2>

        <p className="text-pretty">
          I recognize that I&apos;m still at an insanely early stage in my career, and that I
          haven&apos;t really spent enough time marinating in design work to form an educated
          opinion.
        </p>
        <p className="text-pretty">
          But that&apos;s the fun thing about opinions! They&apos;re yours to make, and all I know
          is that I&apos;m having fun, I&apos;m happy, and I feel purposeful and fulfilled.
        </p>

        <section className="flex flex-col gap-4 border-t border-zinc-100 pt-10">
          <h3 className="text-balance text-lg font-medium text-zinc-700">Footnotes</h3>
          {DESIGN_PHILOSOPHY_FOOTNOTES.map((note) => (
            <p key={note} className="text-pretty text-sm text-zinc-500">
              {note}
            </p>
          ))}
        </section>
      </div>
    </article>
  );
}
