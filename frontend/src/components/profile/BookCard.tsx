import { Link } from "react-router-dom";
interface BookProps {
  title: string;
  author: string;
  main_cover: string;
  id: number;
}
const BookCard = ({ title, author, main_cover ,id  }: BookProps) => {
  return (
    <Link
      to={`/books/${id}`}
      className="border border-black border-opacity-30 rounded-md p-5">
      <div className="relative">
        <img src={main_cover} alt="" className="w-full h-96 object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm">{author}</p>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
