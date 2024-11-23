import BookCard from "./BookCard";
interface BookGridProps {
  tab: number;
  books:any[]
}
const BookGrid: React.FC<BookGridProps> = ({ tab , books}) => {
  return (
    <div>
      {tab === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
          {books.map((book, index) => (
            <BookCard key={index} url={book.main_cover} {...book} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[1, 3, 5, 6, 4].map((card, index) => (
            <BookCard key={index} url="/assets/book-3.png" />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookGrid;
