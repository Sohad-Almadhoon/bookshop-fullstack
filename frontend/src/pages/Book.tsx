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
import { useNovelModal } from "../hooks/useNovelModal";
import { FC, useEffect, useState } from "react";
export interface BookData {
  id: string;
  title: string;
  main_cover: string;
}
const Book: FC = () => {
  const { id: bookId } = useParams();
  const [bookData, setBookData] = useState<BookData | null>(null);
  const userId = "currentUserId"; // Replace with actual user context or state

  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        const response = await newRequest.get(`/api/books/${bookId}`);
        setBookData(response.data);
      } catch (error) {
        console.error("Error fetching book info:", error);
      }
    };
    fetchBookInfo();
  }, [bookId]);

  if (!bookData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={bookData.title} className="text-3xl uppercase" />
      <div className="flex border border-black flex-1">
        <Sidebar bookData={bookData} userId={userId} />
        <ContentArea tab={0} setTab={() => {}} chapters={[1, 2, 3, 4]} />
      </div>
    </div>
  );
};
