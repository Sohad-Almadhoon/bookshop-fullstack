import BookCard from "./BookCard";

interface BookGridProps {
  tab: number;
  books: any[];
}

const BookGrid: React.FC<BookGridProps> = ({ tab, books }) => {
  return (
    <div>
      {books.length === 0 ? (
        <div className="text-center text-gray-500 mt-4">
          {tab === 0
            ? "You have no books in your collection."
            : "No books available from followed users."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-1">
          {books.map((book, index) => (
            <BookCard key={index} {...book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookGrid;
