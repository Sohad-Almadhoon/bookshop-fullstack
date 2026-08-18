import { ReactNode } from "react";
import Header from "./Header";

interface ContentPageProps {
  eyebrow?: string;
  title: string;
  intro: string;
  children: ReactNode;
}

/** Shared shell for the written pages (About, How it works). */
const ContentPage: React.FC<ContentPageProps> = ({ eyebrow, title, intro, children }) => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1 border border-black p-4 sm:p-8 lg:p-12">
      <div className="mx-auto w-full max-w-3xl">
        {eyebrow && (
          <p className="font-baskervville text-sm uppercase tracking-[0.2em] text-black/50">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-2 font-voyage text-4xl uppercase leading-tight sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl font-baskervville text-base leading-relaxed text-black/75">
          {intro}
        </p>
        <div className="mt-10 flex flex-col gap-10">{children}</div>
      </div>
    </main>
  </div>
);

interface SectionProps {
  title: string;
  children: ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => (
  <section>
    <h2 className="font-voyage text-2xl uppercase sm:text-3xl">{title}</h2>
    <div className="mt-3 space-y-3 font-baskervville leading-relaxed text-black/80">
      {children}
    </div>
  </section>
);

interface StepProps {
  number: number;
  title: string;
  children: ReactNode;
}

export const Step: React.FC<StepProps> = ({ number, title, children }) => (
  <li className="flex gap-4">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black font-voyage text-sm text-[#DDD1BB]">
      {number}
    </span>
    <div className="min-w-0">
      <h3 className="font-romieMedium text-lg uppercase">{title}</h3>
      <p className="mt-1 font-baskervville leading-relaxed text-black/75">{children}</p>
    </div>
  </li>
);

export default ContentPage;
