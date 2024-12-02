import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/shared/Header";
import newRequest from "../utils/newRequest";
import { Link } from "react-router-dom";
import Loader from "../components/shared/Loader";

interface Book {
  id: number;
  main_cover: string;
  title: string;
}

const fetchRandomBooks = async (): Promise<Book[]> => {
  const response = await newRequest.get("/api/books/random-books"); 
  return response.data;
};



const Discover: FC = () => {
  const {
    data: books,
    isLoading,
    error,
  } = useQuery<Book[], Error>({
    queryKey: ["randomBooks"],
    queryFn: fetchRandomBooks,
  });
  console.log(books)

  const [activeCard, setActiveCard] = useState<number | null>(null);


  const handleCardHover = (index: number) => setActiveCard(index);
  const resetCardState = () => setActiveCard(null);

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title={
          <h3 className="text-3xl uppercase">
            Explore Books
          </h3>
        }
      />
      <div className="border border-black flex-1">
        <div className="flex flex-col justify-center max-w-6xl w-full mx-auto">
          <div className="relative mt-12 h-[400px] flex items-center justify-center">
            {isLoading ? (
              <Loader/>
            ) : error ? (
              <p className="text-red-500">Error: {error.message}</p>
            ) : (
              books?.map((book, index) => {
                // Default styles for cards
                const defaultStyles: string[] = [
                  "-rotate-15 -translate-x-28", // Card 1
                  "rotate-0 z-10", // Card 2
                  "rotate-15 translate-x-28", // Card 3
                ];

                return (
                  <Link
                    to={`/books/${book.id}`}
                    key={book.id}
                    className={`absolute w-72 h-auto cursor-pointer transition-transform duration-500 ease-in-out will-change-transform
                      ${
                        activeCard === index
                          ? "z-20 scale-110 rotate-0 translate-x-0 shadow-lg"
                          : activeCard !== null
                          ? "scale-75 opacity-50"
                          : defaultStyles[index]
                      }`}>
                    <img
                      className="w-full h-auto"
                      key={book.id}
                      src={book.main_cover}
                      alt={book.title}
                      onMouseEnter={() => handleCardHover(index)}
                      onMouseLeave={resetCardState}
                      onFocus={() => handleCardHover(index)}
                      onBlur={resetCardState}
                      tabIndex={0}
                    />
                  </Link>
                );
              })
            )}
          </div>
          <div className="flex z-20">
            <img
              src="/assets/wolf-left.png"
              alt="Wolf Left"
              className="absolute bottom-0 left-0"
            />
            <img
              src="/assets/wolf-right.png"
              alt="Wolf Right"
              className="absolute bottom-0 right-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discover;
