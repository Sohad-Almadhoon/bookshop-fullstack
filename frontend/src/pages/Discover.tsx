import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Header from "../components/shared/Header";
import newRequest, { getErrorMessage } from "../utils/newRequest";
import Loader from "../components/shared/Loader";

interface Book {
  id: number;
  main_cover: string;
  title: string;
  author?: string;
}

const fetchRandomBooks = async (): Promise<Book[]> => {
  const response = await newRequest.get("/api/books/random-books");
  // The API used to answer with an object when there were fewer than 3 books,
  // which made .map() throw.
  return Array.isArray(response.data) ? response.data : [];
};

const fanStyles: string[] = [
  "-rotate-15 -translate-x-28",
  "rotate-0 z-10",
  "rotate-15 translate-x-28",
];

const Discover: FC = () => {
  const {
    data: books = [],
    isLoading,
    isError,
    error,
  } = useQuery<Book[], Error>({
    queryKey: ["randomBooks"],
    queryFn: fetchRandomBooks,
  });

  const [activeCard, setActiveCard] = useState<number | null>(null);

  const status = isLoading ? (
    <Loader />
  ) : isError ? (
    <p className="text-red-500">{getErrorMessage(error, "Could not load books.")}</p>
  ) : books.length === 0 ? (
    <p className="text-gray-600 text-lg">No books yet. Be the first to create one!</p>
  ) : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={<h3 className="text-3xl uppercase">Explore Books</h3>} />
      <div className="border border-black flex-1 relative">
        {/* Phones and tablets get a real grid: the fanned stack below relies on
            hover, which does not exist on touch, and the cards overlapped each
            other almost completely at 375px. */}
        <div className="lg:hidden p-4">
          <h3 className="text-2xl uppercase text-center mb-5 lg:hidden">Explore Books</h3>
          {status ? (
            <div className="flex justify-center py-16">{status}</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {books.map((book) => (
                <Link
                  to={`/books/${book.id}`}
                  key={book.id}
                  className="border border-black rounded-lg overflow-hidden active:scale-95 transition-transform">
                  <img
                    className="w-full aspect-[2/3] object-cover"
                    src={book.main_cover}
                    alt={book.title}
                  />
                  <p className="text-sm text-center p-2 truncate">{book.title}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:flex flex-col justify-center items-center mt-5 max-w-6xl w-full mx-auto">
          <div className="relative mt-12 h-[400px] flex items-center justify-center">
            {status ??
              books.map((book, index) => (
                <Link
                  to={`/books/${book.id}`}
                  key={book.id}
                  className={`absolute w-72 h-auto cursor-pointer transition-transform duration-500 ease-in-out will-change-transform
                      ${
                        activeCard === index
                          ? "z-20 scale-110 rotate-0 translate-x-0 shadow-lg"
                          : activeCard !== null
                          ? "scale-75 opacity-50"
                          : fanStyles[index % fanStyles.length]
                      }`}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                  onFocus={() => setActiveCard(index)}
                  onBlur={() => setActiveCard(null)}>
                  <img className="w-full h-auto" src={book.main_cover} alt={book.title} />
                </Link>
              ))}
          </div>
          <div className="flex z-20">
            <img src="/assets/wolf-left.png" alt="" className="absolute bottom-0 left-0" />
            <img src="/assets/wolf-right.png" alt="" className="absolute bottom-0 right-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
