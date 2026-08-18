import { Link } from "react-router-dom";
import ContentPage, { Section, Step } from "../components/shared/ContentPage";
import Button from "../components/shared/Button";

const HowItWorks = () => (
  <ContentPage
    eyebrow="Getting started"
    title="How it works"
    intro="Block Book is a library that gets written by the people reading it. A book starts as a cover and a description, and grows one chapter — one paragraph — at a time.">
    <Section title="The idea">
      <p>
        Every book here is a shared shelf rather than a finished object. The person who
        creates a book owns it and decides what stays. Everyone else can follow it, join
        its conversation, and — with a subscription — add chapters, paragraphs and audio to
        it.
      </p>
    </Section>

    <Section title="Step by step">
      <ol className="space-y-6">
        <Step number={1} title="Create a book">
          Give it a title, an author, a description, a few genres and a cover. The book
          appears on your profile straight away, along with its own conversation.
        </Step>
        <Step number={2} title="Add a chapter">
          A chapter is a cover image and a title. Open a book and press{" "}
          <b>New chapter</b> — it shows up in the chapter grid immediately.
        </Step>
        <Step number={3} title="Write inside the chapter">
          Open a chapter and write straight into the page. Each paragraph is saved on its
          own, up to 2000 characters, so you can come back and add to it whenever you like.
          Ctrl+Enter adds a paragraph without reaching for the mouse.
        </Step>
        <Step number={4} title="Add audio">
          Any chapter can carry one audio track — a reading, a score, an atmosphere. MP3
          or WAV, up to 20MB.
        </Step>
        <Step number={5} title="Follow, like, discuss">
          Following a book adds you to its conversation, so the people building it can
          talk in one place. Likes and follower counts show on every book card.
        </Step>
      </ol>
    </Section>

    <Section title="Who can change what">
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <b>Anyone signed in</b> can read books, follow them, like them, comment and take
          part in the conversation of a book they follow.
        </li>
        <li>
          <b>Subscribers</b> ($5, one payment) can add chapters, paragraphs and audio to
          any book.
        </li>
        <li>
          <b>The book owner</b> can delete a paragraph, a chapter or the whole book, and
          can remove comments on it. Deletions are permanent and always ask first.
        </li>
      </ul>
    </Section>

    <Section title="Ready?">
      <div className="flex flex-wrap gap-3">
        <Link to="/create-book">
          <Button className="w-fit px-6 py-2 text-sm">Create a book</Button>
        </Link>
        <Link to="/discover">
          <Button variant="outline" className="w-fit px-6 py-2 text-sm">
            Explore what exists
          </Button>
        </Link>
      </div>
    </Section>
  </ContentPage>
);

export default HowItWorks;
