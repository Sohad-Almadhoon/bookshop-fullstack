import { Link } from "react-router-dom";
import { BsHeartFill, BsPeopleFill } from "react-icons/bs";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { Book } from "../../actions/books.action";

const BookCard = ({ book }: { book: Book }) => {
  const { title, author, main_cover, id } = book;

  const { data: stats } = useQuery<{ likes: number; follows: number }>({
    queryKey: ["bookStats", id],
    queryFn: async () => (await newRequest.get(`/api/books/${id}/stats`)).data,
    enabled: Boolean(id),
  });

  return (
    <Link
      to={`/books/${id}`}
      className="border border-black border-opacity-30 rounded-md p-3 sm:p-5">
      <div className="relative">
        <img src={main_cover} alt={title} className="w-full h-72 sm:h-96 object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
          <h1 className="text-2xl font-semibold truncate">{title}</h1>
          <p className="text-sm">{author}</p>
          <div className="flex items-center gap-4 justify-end p-1">
            {/* icons were swapped: the heart showed follows and vice versa */}
            <span className="flex gap-2 items-center" title="Likes">
              <BsHeartFill className="text-red-700" /> {stats?.likes ?? 0}
            </span>
            <span className="flex gap-2 items-center" title="Followers">
              <BsPeopleFill /> {stats?.follows ?? 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
