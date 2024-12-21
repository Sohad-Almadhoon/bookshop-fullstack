import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import { BsHeartFill, BsPersonCircle } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";

const BookCard = ({ book }: any) => {
  const { title, author, main_cover, id } = book.book;
  console.log(id)
  const { data: stats } = useQuery({ queryKey: ["bookStats", id], queryFn: async () => {
    const { data } = await newRequest.get(`/api/books/${id}/stats`);
    return data;
  }
  });
  
  return (
    <Link
      to={`/books/${id}`}
      className="border border-black border-opacity-30 rounded-md p-5">
      <div className="relative">
        <img src={main_cover} alt="" className="w-full h-96 object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm">{author}</p>
          <div className="flex items-center gap-4 justify-end p-1">
            <span className="flex gap-2 items-center">
              <BsPersonCircle /> {stats?.likes}
            </span>
            <span className="flex gap-2 items-center">
              <BsHeartFill className="text-red-700" /> {stats?.follows}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
