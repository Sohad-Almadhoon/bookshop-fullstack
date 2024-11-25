import {
  BsCalendar2DateFill,
  BsChatFill,
  BsHeartFill,
  BsLayoutThreeColumns,
  BsPeopleFill,
  BsPersonFill,
} from "react-icons/bs";
import { useState, FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import Button from "../components/shared/Button";
import Header from "../components/shared/Header";
import { useCommentModal } from "../hooks/useCommentModal";
import { usePaymentModal } from "../hooks/usePaymentModal";

// Main Book Component
const Book: FC = () => {
  const [tab, setTab] = useState<number>(0);

  const chapters = [1, 2, 3, 4];

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="worldview ethics" className="text-3xl uppercase" />

      <div className="flex border border-black flex-1">
        <Sidebar />
        <ContentArea tab={tab} setTab={setTab} chapters={chapters} />
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar: FC = () => {
  const { openModal } = usePaymentModal();
  return (
    <div className="border-r border-black justify-end flex-1 p-4 flex flex-col px-28">
      <Button onClick={openModal}>
        invest as little as <sup>$</sup>10
      </Button>
      <div className="self-end">
        <ImageSection />
        <ActionButtons />
      </div>
    </div>
  );
};

// Image Section Component
const ImageSection: FC = () => (
  <div className="mt-4">
    <img src="/assets/book-2.png" alt="book cover" className="h-full w-full" />
  </div>
);

// Action Buttons Component
const ActionButtons: FC = () => {
  const { openModal } = useCommentModal();
  return (
    <div className="flex gap-3 mt-2 items-center">
      <Button
        variant="outline"
        className="flex gap-1 p-1 text-xs justify-center"
        onClick={openModal}>
        <BsChatFill className="text-black text-sm" /> comments
      </Button>

      <Button
        variant="outline"
        className="flex gap-1 p-1 text-xs justify-center">
        <BsPeopleFill className="text-black text-sm" /> follow
      </Button>
      <Button
        variant="outline"
        className="flex gap-1 p-1 px-2 text-xs justify-center">
        <BsHeartFill className="text-black text-sm" /> like
      </Button>
    </div>
  );
};

// Content Area Component
interface ContentAreaProps {
  tab: number;
  setTab: (tab: number) => void;
  chapters: number[];
}

const ContentArea: FC<ContentAreaProps> = ({ tab, setTab, chapters }) => (
  <div className="flex-2 p-12 flex-col flex px-20">
    <ProjectStats />
    <TabSelector currentTab={tab} setTab={setTab} />
    <ChapterGrid chapters={chapters} />
  </div>
);

// Project Stats Component
const ProjectStats: FC = () => (
  <div className="flex  items-center flex-wrap gap-10">
    <InfoBlock icon={<BsPersonFill />} text="CONTRIBUTORS: 34" />
    <InfoBlock icon={<BsCalendar2DateFill />} text="DATE CREATED: 22/03/2024" />
  </div>
);

interface InfoBlockProps {
  icon: ReactNode;
  text: string;
}

const InfoBlock: FC<InfoBlockProps> = ({ icon, text }) => (
  <div className="flex items-center text-xl gap-2 justify-center">
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
      selected ? "" : ""
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
  <div className="grid grid-cols-3 gap-x-2 gap-y-3">
    {chapters.map((num, index) => (
      <Link
        key={num}
        className="border-black border-2 w-48"
        to={`/chapters/${index + 1}`}>
        <img src={`/assets/nft${num}.png`} alt={`nft ${num}`} />
      </Link>
    ))}
  </div>
);
export default Book;
