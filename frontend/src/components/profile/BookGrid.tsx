import BookCard from "./BookCard";

const BookGrid: React.FC = () => (
  <div className="grid grid-cols-4 gap-8">
    {[1, 3, 5, 6, 4].map((card, index) => (
      <BookCard key={index} />
    ))}
  </div>
);
export default BookGrid;