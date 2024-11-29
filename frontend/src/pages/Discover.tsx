import { useState, FC } from "react";
import Header from "../components/shared/Header";

// Define the component
const Discover: FC = () => {
  // State to track the active card index
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Card hover handlers
  const handleCardHover = (index: number) => setActiveCard(index);
  const resetCardState = () => setActiveCard(null);

  // Array of card image names
  const books: string[] = ["book-1", "book-2", "book-3"];

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title={
          <h3 className="text-3xl uppercase">
            NOVELS{" "}
            <span className="text-xl cursor-pointer hover:underline">
              scroll to explore
            </span>
          </h3>
        }
      />
      <div className="border border-black flex-1">
        <div className="flex flex-col justify-center max-w-6xl w-full mx-auto">
          <div className="relative mt-12 h-[400px] flex items-center justify-center">
            {books.map((book, index) => {
              // Default styles for cards
              const defaultStyles: string[] = [
                "-rotate-15 -translate-x-28", // Card 1
                "rotate-0 z-10", // Card 2
                "rotate-15 translate-x-28", // Card 3
              ];

              return (
                <img
                  key={index}
                  src={`/assets/${book}.png`}
                  alt={`Card ${index + 1}`}
                  className={`absolute w-72 h-auto cursor-pointer transition-transform duration-500 ease-in-out will-change-transform
                    ${
                      activeCard === index
                        ? "z-20 scale-110 rotate-0 translate-x-0 shadow-lg"
                        : activeCard !== null
                        ? "scale-75 opacity-50"
                        : defaultStyles[index]
                    }`}
                  onMouseEnter={() => handleCardHover(index)}
                  onMouseLeave={resetCardState}
                  onFocus={() => handleCardHover(index)} // For keyboard users
                  onBlur={resetCardState} // Reset on blur
                  tabIndex={0} // Make the card focusable
                />
              );
            })}
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
