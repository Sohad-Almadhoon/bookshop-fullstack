import { Link } from "react-router-dom";
import ContentPage, { Section } from "../components/shared/ContentPage";
import Button from "../components/shared/Button";

const About = () => (
  <ContentPage
    eyebrow="About"
    title="Block Book"
    intro="A place where a story is not finished when it is published. Books here are built in the open, block by block, by whoever wants to add the next piece.">
    <Section title="Why it exists">
      <p>
        Most reading happens alone and most writing happens behind a closed door. Block
        Book puts the two in the same room: you can open a book, read what is there, and
        add the paragraph that comes next. Text, audio and cover art all sit in the same
        chapter, so a book can be read, listened to and looked at.
      </p>
    </Section>

    <Section title="How a book is built">
      <p>
        A book is a shelf of chapters. A chapter is a cover, a stack of paragraphs and,
        optionally, one audio track. Nothing has to be finished before it is shared —
        publishing a single paragraph is a perfectly normal way to start.
      </p>
      <p>
        Whoever creates a book keeps control of it: they can remove anything that does not
        belong, and they alone can delete it. Everything else is collaborative.
      </p>
    </Section>

    <Section title="The tree">
      <p>
        The tree is the map of the site. Each ring is a place: your profile, discovery,
        creating a book, and these written pages. It replaces a menu, and it is meant to
        be wandered rather than read.
      </p>
    </Section>

    <Section title="What is coming">
      <ul className="list-disc space-y-2 pl-5">
        <li>Live conversations instead of refresh-to-see-new-messages.</li>
        <li>Notifications when a book you follow gains a chapter.</li>
        <li>Reordering chapters and paragraphs by dragging them.</li>
        <li>A public reading view that does not require an account.</li>
      </ul>
    </Section>

    <Section title="Start somewhere">
      <div className="flex flex-wrap gap-3">
        <Link to="/how-it-works">
          <Button className="w-fit px-6 py-2 text-sm">Read how it works</Button>
        </Link>
        <Link to="/discover">
          <Button variant="outline" className="w-fit px-6 py-2 text-sm">
            Explore books
          </Button>
        </Link>
      </div>
    </Section>
  </ContentPage>
);

export default About;
