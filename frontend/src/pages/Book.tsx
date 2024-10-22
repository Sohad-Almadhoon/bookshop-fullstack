import {
  BsCalendar2DateFill,
  BsChatFill,
  BsHeartFill,
  BsLayoutThreeColumns,
  BsListCheck,
  BsPeopleFill,
  BsPersonFill,
  BsPlus,
} from "react-icons/bs";
import { useState, FC, ReactNode } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Link } from "react-router-dom";
import Button from "../components/shared/Button";
import Header from "../components/shared/Header";

// Main Book Component
const Book: FC = () => {
  const [tab, setTab] = useState<number>(0);

  const chapters = [1, 2, 3, 4];
  const architects = [
    "MUSIC BY BOB JUBURI",
    "ILLUSTRATION BY FAIZAL “GANEE”",
    "WRITING BY MARYANNA CLARKE",
  ];
  const description =
    "The First Ever collaborative 'Crypto-Novel' follows the stories of 6 characters which travel through the minds of their owners, collecting unique journeys that evolve their stories, infinitely.";

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="The Oracles Verse" className="text-4xl uppercase" />

      <div className="flex border border-black flex-1">
        <Sidebar />
        <ContentArea
          tab={tab}
          setTab={setTab}
          chapters={chapters}
          architects={architects}
          description={description}
        />
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar: FC = () => (
  <div className="border-r border-black justify-end flex-1 p-4 flex flex-col px-28">
    <h1 className="uppercase text-5xl font-light mb-4 w-96">
      worldview ethics
    </h1>
    <Button>
      invest as little as <sup>$</sup>10
    </Button>
    <div className="self-end">
      <ImageSection />
      <ActionButtons />
    </div>
  </div>
);

// Image Section Component
const ImageSection: FC = () => (
  <div className="mt-4">
    <img src="/assets/book-2.png" alt="book cover" className="h-full w-full" />
  </div>
);

// Action Buttons Component
const ActionButtons: FC = () => (
  <div className="flex gap-3 mt-2 items-center">
    <Button variant="outline" className="flex gap-1 p-1 text-xs justify-center">
      <BsChatFill className="text-black text-sm" /> comments
    </Button>
    <Button variant="outline" className="flex gap-1 p-1 text-xs justify-center">
      <BsPeopleFill className="text-black text-sm" /> follow
    </Button>
    <Button
      variant="outline"
      className="flex gap-1 p-1 px-2 text-xs justify-center">
      <BsHeartFill className="text-black text-sm" /> like
    </Button>
  </div>
);

// Content Area Component
interface ContentAreaProps {
  tab: number;
  setTab: (tab: number) => void;
  chapters: number[];
  architects: string[];
  description: string;
}

const ContentArea: FC<ContentAreaProps> = ({
  tab,
  setTab,
  chapters,
  architects,
  description,
}) => (
  <div className="flex-2 p-12 flex-col flex px-20">
    <ProjectStats />
    <TabSelector currentTab={tab} setTab={setTab} />
    <div className="flex-1">
      {tab === 0 ? (
        <ChapterGrid chapters={chapters} />
      ) : (
        <DescriptionSection architects={architects} description={description} />
      )}
    </div>
  </div>
);

// Project Stats Component
const ProjectStats: FC = () => (
  <div className="flex  items-center flex-wrap gap-5">
    <InfoBlock
      icon={
        <img src="/assets/coins-stacked.svg" alt="coins" className="w-9 h-9" />
      }
      text="FUND: $3K"
    />
    <InfoBlock icon={<BsPersonFill />} text="CONTRIBUTORS: 34" />
    <InfoBlock icon={<BsCalendar2DateFill />} text="DATE CREATED: 22/03/2024" />
  </div>
);

// Info Block Component (Reusable for project stats)
interface InfoBlockProps {
  icon: ReactNode;
  text: string;
}

const InfoBlock: FC<InfoBlockProps> = ({ icon, text }) => (
  <div className="flex items-center text-2xl gap-1 justify-center">
    {icon} {text}
  </div>
);

// Tab Selector Component
interface TabSelectorProps {
  currentTab: number;
  setTab: (tab: number) => void;
}

const TabSelector: FC<TabSelectorProps> = ({ currentTab, setTab }) => (
  <div className="flex my-10">
    <TabButton
      selected={currentTab === 0}
      onClick={() => setTab(0)}
      icon={<BsLayoutThreeColumns />}
      label="Chapters"
    />
    <TabButton
      selected={currentTab === 1}
      onClick={() => setTab(1)}
      icon={<BsListCheck />}
      label="Description"
    />
  </div>
);

// Tab Button Component
interface TabButtonProps {
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}

const TabButton: FC<TabButtonProps> = ({ selected, onClick, icon, label }) => (
  <Button
    variant={selected ? "" : "outline"}
    className={`text-2xl flex gap-2 items-center justify-center font-light ${
      selected ? "rounded-r-none" : ""
    }`}
    onClick={onClick}>
    {icon} {label}
  </Button>
);

// Chapter Grid Component
interface ChapterGridProps {
  chapters: number[];
}

const ChapterGrid: FC<ChapterGridProps> = ({ chapters }) => (
  <div className="grid grid-cols-3 gap-x-4 gap-y-3">
    {chapters.map((num) => (
      <Link key={num} className="border-black border-2 w-48" to="/">
        <img src={`/assets/nft${num}.png`} alt={`nft ${num}`} />
      </Link>
    ))}
  </div>
);

// Description Section Component
interface DescriptionSectionProps {
  architects: string[];
  description: string;
}

const DescriptionSection: FC<DescriptionSectionProps> = ({
  architects,
  description,
}) => (
  <div className="flex flex-col gap-4">
    <ArchitectsList architects={architects} />
    <DescriptionText description={description} />
  </div>
);

// Architects List Component
interface ArchitectsListProps {
  architects: string[];
}

const ArchitectsList: FC<ArchitectsListProps> = ({ architects }) => (
  <div className="flex flex-col gap-4">
    <h4 className="text-2xl">ARCHITECTS</h4>
    <hr className="h-1 bg-black" />
    {architects.map((item, index) => (
      <Disclosure key={index}>
        {({ open }) => (
          <>
            <DisclosureButton>
              <p className="flex text-xl py-3 justify-between items-center pb-3 border-b border-black">
                <span className="pl-4">{item}</span>
                <BsPlus
                  className={`text-4xl transform ${open ? "rotate-45" : ""}`}
                />
              </p>
            </DisclosureButton>
            <DisclosurePanel className="text-base">
              If you're unhappy with your purchase for any reason, email us
              within 90 days and we'll refund you in full, no questions asked.
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    ))}
  </div>
);

// Description Text Component
interface DescriptionTextProps {
  description: string;
}

const DescriptionText: FC<DescriptionTextProps> = ({ description }) => (
  <div className="flex flex-col mt-12">
    <h4 className="text-2xl">DESCRIPTION</h4>
    <hr className="h-1 bg-black" />
    <p className="text-xl font-light mt-4">{description}</p>
  </div>
);

export default Book;
