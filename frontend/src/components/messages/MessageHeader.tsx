import { BsChevronLeft } from "react-icons/bs";
import { Link } from "react-router-dom";

interface MessageHeaderProps {
  book: { id: number; title: string; author: string; main_cover: string } | null;
}

// Receives the book as a prop now: it used to read router state and threw on a
// direct visit or a page refresh.
const MessageHeader: React.FC<MessageHeaderProps> = ({ book }) => (
  <div className="flex justify-between h-20 sm:h-24 items-center border-b px-3 sm:px-4 lg:px-12 border-black">
    <div className="flex items-center gap-2 min-w-0">
      <Link to="/messages" aria-label="Back to messages">
        <BsChevronLeft />
      </Link>
      <img
        src={book?.main_cover || "/assets/book-1.png"}
        alt="book"
        className="w-10 h-14 sm:w-12 sm:h-16 object-cover shrink-0"
      />
      <div className="min-w-0">
        {book ? (
          <Link to={`/books/${book.id}`} className="text-lg sm:text-2xl line-clamp-1">
            {book.title}
          </Link>
        ) : (
          <span className="text-lg sm:text-2xl">Conversation</span>
        )}
        <p className="text-sm text-gray-500">{book?.author || "Unknown Author"}</p>
      </div>
    </div>
  </div>
);

export default MessageHeader;
