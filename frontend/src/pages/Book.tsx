import { useParams } from "react-router-dom"; // To get the bookId from URL params
import Header from "../components/shared/Header";
import newRequest from "../utils/newRequest";

import { useEffect, useState } from "react";
import Sidebar from "../components/book/SideBar";
import ChaptersArea from "../components/book/ChaptersArea";
export interface BookData {
  id: string;
  title: string;
  main_cover: string;
}
const Book = () => {
  const { id: bookId } = useParams();
  const [bookData, setBookData] = useState<BookData | null>(null);

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
        <Sidebar imgUrl={bookData.main_cover} />
        <ChaptersArea />
      </div>
    </div>
  );
};

export default Book;