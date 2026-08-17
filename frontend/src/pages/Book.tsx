import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/shared/Header";
import newRequest, { getErrorMessage } from "../utils/newRequest";
import Sidebar from "../components/book/SideBar";
import ChaptersArea from "../components/book/ChaptersArea";
import Loader from "../components/shared/Loader";

interface BookData {
  id: number;
  title: string;
  author: string;
  description: string;
  main_cover: string;
  generes: string[];
  created_at: string;
}

const fetchBookInfo = async (bookId: string): Promise<BookData> => {
  const response = await newRequest.get(`/api/books/${bookId}`);
  return response.data;
};

const Book = () => {
  const { id: bookId } = useParams();

  const {
    data: bookData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["book", bookId],
    queryFn: () => fetchBookInfo(bookId!),
    enabled: Boolean(bookId),
  });

  if (isLoading) return <Loader />;

  if (isError || !bookData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-2">
        <p className="text-xl">Error fetching book data</p>
        <p className="text-sm text-gray-700">
          {getErrorMessage(error, "This book could not be loaded.")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={bookData.title} className="text-3xl uppercase" />
      <div className="flex lg:flex-row flex-col border border-black flex-1">
        <Sidebar imgUrl={bookData.main_cover} description={bookData.description} />
        <ChaptersArea date={bookData.created_at} genres={bookData.generes || []} />
      </div>
    </div>
  );
};

export default Book;
