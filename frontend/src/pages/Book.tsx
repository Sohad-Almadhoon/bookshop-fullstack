import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/shared/Header";
import newRequest, { getErrorMessage } from "../utils/newRequest";
import BookHero from "../components/book/BookHero";
import ChaptersArea, { Chapter } from "../components/book/ChaptersArea";
import Loader from "../components/shared/Loader";
import useBookStates from "../hooks/useBookStates";

interface BookData {
  id: number;
  title: string;
  author: string;
  description: string;
  main_cover: string;
  generes: string[];
  created_at: string;
}

const Book = () => {
  const { id: bookId } = useParams();

  const {
    data: book,
    isLoading,
    isError,
    error,
  } = useQuery<BookData>({
    queryKey: ["book", bookId],
    queryFn: async () => (await newRequest.get(`/api/books/${bookId}`)).data,
    enabled: Boolean(bookId),
  });

  const chaptersQuery = useQuery<Chapter[]>({
    queryKey: ["chapters", bookId],
    queryFn: async () => {
      const response = await newRequest.get(`/api/books/${bookId}/chapters`);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: Boolean(bookId),
  });

  const { data: states } = useBookStates(bookId);

  if (isLoading) return <Loader />;

  if (isError || !book) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-xl">Error fetching book data</p>
        <p className="text-sm text-gray-700">
          {getErrorMessage(error, "This book could not be loaded.")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={book.title} className="text-2xl uppercase truncate max-w-[40vw]" />
      <main className="flex flex-1 flex-col gap-10 border border-black p-4 sm:p-6 lg:p-10">
        <BookHero
          bookId={book.id}
          title={book.title}
          author={book.author}
          imgUrl={book.main_cover}
          description={book.description}
          genres={book.generes || []}
          createdAt={book.created_at}
          chapterCount={chaptersQuery.data?.length ?? 0}
          isOwner={Boolean(states?.isOwner)}
        />

        <ChaptersArea
          bookId={bookId!}
          chapters={chaptersQuery.data ?? []}
          isLoading={chaptersQuery.isLoading}
          isError={chaptersQuery.isError}
          error={chaptersQuery.error}
          isOwner={Boolean(states?.isOwner)}
        />
      </main>
    </div>
  );
};

export default Book;
