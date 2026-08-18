import BookCard from "./BookCard";
import { UserBookRow } from "../../actions/books.action";

interface BookGridProps {
  tab: number;
  books: UserBookRow[];
  isOwnProfile?: boolean;
  isLoading?: boolean;
}

const GRID_CLASSES = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";

const BookGrid: React.FC<BookGridProps> = ({
  tab,
  books,
  isOwnProfile = true,
  isLoading = false,
}) => {
  // Placeholders keep the same 3:4 boxes as the real cards, so the page does not
  // jump when the books arrive.
  if (isLoading) {
    return (
      <div className={GRID_CLASSES}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[3/4] w-full animate-pulse rounded-lg border-2 border-black/20 bg-black/5"
          />
        ))}
      </div>
    );
  }

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
    <div className={GRID_CLASSES}>
      {books
        .filter((row) => row?.book)
        .map((row) => (
          <BookCard key={row.id} book={row.book} />
        ))}
    </div>
  );
};

export default BookGrid;
