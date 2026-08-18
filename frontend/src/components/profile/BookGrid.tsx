import BookCard from "./BookCard";
import { UserBookRow } from "../../actions/books.action";

interface BookGridProps {
  tab: number;
  books: UserBookRow[];
  isOwnProfile?: boolean;
}

const BookGrid: React.FC<BookGridProps> = ({ tab, books, isOwnProfile = true }) => {
  if (books.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4">
        {tab === 0
          ? isOwnProfile
            ? "You have no books in your collection."
            : "This user has no books yet."
          : isOwnProfile
          ? "You are not following any book yet."
          : "This user is not following any book yet."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {books
        .filter((row) => row?.book)
        .map((row) => (
          <BookCard key={row.id} book={row.book} />
        ))}
    </div>
  );
};

export default BookGrid;
