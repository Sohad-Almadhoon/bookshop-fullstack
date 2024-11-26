import { FC, useState, useEffect, ReactNode } from "react";
import { useParams } from "react-router-dom"; // To get the bookId from URL params
import Button from "../components/shared/Button";
import Header from "../components/shared/Header";
import { usePaymentModal } from "../hooks/usePaymentModal";
import { useCommentModal } from "../hooks/useCommentModal";
import {
  BsCalendar2DateFill,
  BsChatFill,
  BsHeartFill,
  BsLayoutThreeColumns,
  BsPeopleFill,
  BsPersonFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import newRequest from "../utils/newRequest";

// Define the shape of the book data
interface BookData {
  title: string;
  main_cover: string;
  // Add other properties as needed
}

const Book: FC = () => {
  const { id: bookId } = useParams(); // Extract bookId from the URL params
  // State to store book data and selected tab
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [tab, setTab] = useState<number>(0); // State for managing the selected tab

  const chapters = [1, 2, 3, 4]; // Example chapters data

  // Fetch book info when the component mounts or bookId changes
  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const response = await newRequest.get(`/api/books/${bookId}`);
        console.log(response);
        setBookData(response.data); // Assuming response.data contains the book info
      } catch (error) {
        console.error("Error fetching book info:", error);
      }
    };
    fetchBookInfo();
  }, [bookId]);

  // Render loading state while the bookData is being fetched
  if (!bookData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={bookData.title} className="text-3xl uppercase" />

      <div className="flex border border-black flex-1">
        <Sidebar bookData={bookData} />
        <ContentArea tab={tab} setTab={setTab} chapters={chapters} />
      </div>
    </div>
  );
};

// Sidebar Component (Modified to receive book data)
const Sidebar: FC<{ bookData: BookData }> = ({ bookData }) => {
  const { openModal } = usePaymentModal();

  return (
    <div className="border-r border-black justify-end flex-1 p-4 flex flex-col px-28">
      <Button onClick={openModal}>
        invest as little as <sup>$</sup>10
      </Button>
      <div className="self-end">
        <ImageSection bookCover={bookData.main_cover} />
        <ActionButtons />
      </div>
    </div>
  );
};

// Image Section Component (Display the book cover image)
const ImageSection: FC<{ bookCover: string }> = ({ bookCover }) => (
  <div className="mt-4">
    <img src={bookCover} alt="book cover" className="h-full w-full" />
  </div>
);

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

const ContentArea: FC<{
  tab: number;
  setTab: (tab: number) => void;
  chapters: number[];
}> = ({ tab, setTab, chapters }) => (
  <div className="flex-2 p-12 flex-col flex px-20">
    <ProjectStats />
    <TabSelector currentTab={tab} setTab={setTab} />
    <ChapterGrid chapters={chapters} />
  </div>
);

const ProjectStats: FC = () => (
  <div className="flex items-center flex-wrap gap-10">
    <InfoBlock icon={<BsPersonFill />} text="CONTRIBUTORS: 34" />
    <InfoBlock icon={<BsCalendar2DateFill />} text="DATE CREATED: 22/03/2024" />
  </div>
);

const InfoBlock: FC<{ icon: ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center text-xl gap-2 justify-center">
    {icon} {text}
  </div>
);

const TabSelector: FC<{
  currentTab: number;
  setTab: (tab: number) => void;
}> = ({ currentTab, setTab }) => (
  <div className="flex my-10">
    <TabButton
      selected={currentTab === 0}
      onClick={() => setTab(0)}
      icon={<BsLayoutThreeColumns />}
      label="Chapters"
    />
  </div>
);

const TabButton: FC<{
  selected: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}> = ({ selected, onClick, icon, label }) => (
  <Button
    variant={selected ? "" : "outline"}
    className={`text-2xl flex gap-2 items-center justify-center font-light`}
    onClick={onClick}>
    {icon} {label}
  </Button>
);

const ChapterGrid: FC<{ chapters: number[] }> = ({ chapters }) => (
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
