import { useParams } from "react-router-dom";
import Header from "../components/shared/Header";
import newRequest from "../utils/newRequest";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "../components/book/SideBar";
import ChaptersArea from "../components/book/ChaptersArea";
import Loader from "../components/shared/Loader";

const fetchBookInfo = async (bookId: string) => {
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
    enabled: !!bookId, 
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div>
        Error fetching book data:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={bookData.title} className="text-3xl uppercase" />
      <div className="flex lg:flex-row flex-col border border-black flex-1">
        <Sidebar
          imgUrl={bookData.main_cover}
          description={bookData.description}
        />
        <ChaptersArea date={bookData.created_at} />
      </div>
    </div>
  );
};

export default Book;
