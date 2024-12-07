import { BsChevronLeft } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";

const MessageHeader: React.FC = () => {
  const location = useLocation();
  const book = location.state?.book;
 console.log(book)
  return (
    <div className="flex justify-between h-24 items-center border-b px-12 border-black">
      <div className="flex items-center gap-2">
        <Link to="/messages">
          <BsChevronLeft />
        </Link>
        <img
          src={book?.main_cover || "/assets/book-1.png"} // Use the book cover
          alt="book"
          className="w-12 h-16 object-cover"
        />
        <div>
          <Link to={`/books/${book.id}`} className="text-2xl">{book?.title || "Unknown Book"}</Link>
          <p className="text-sm text-gray-500">
            {book?.author || "Unknown Author"}
          </p>
        </div>
      </div>
    </div>
  )
};

export default MessageHeader;
