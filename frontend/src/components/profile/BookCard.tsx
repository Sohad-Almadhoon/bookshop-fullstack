import { Link } from "react-router-dom";
interface BookProps {
  title: string;
  author: string;
  main_cover: string;
}
const BookCard = ({ title, author, main_cover }: BookProps) => {
  return (
    <Link
      to="/books/2"
      className="border border-black border-opacity-30 rounded-md p-5">
      <div className="relative">
        <img src={main_cover} alt="" />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm">{author}</p>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
