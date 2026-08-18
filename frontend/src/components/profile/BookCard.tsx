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
      className="group block overflow-hidden rounded-lg border-2 border-black transition-transform hover:-translate-y-1">
      {/* same 3:4 box as the chapter cards, so no cover is ever squashed */}
      <div className="relative aspect-[3/4] w-full bg-black/5">
        <img
          src={main_cover}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/60 to-transparent p-3 pt-8 text-white">
          <h3 className="truncate text-base font-semibold leading-tight">{title}</h3>
          <p className="truncate text-xs text-white/70">{author}</p>
          <div className="mt-2 flex items-center gap-4 text-xs">
            {/* icons used to be swapped: the heart showed follows */}
            <span className="flex items-center gap-1.5" title="Likes">
              <BsHeartFill className="text-red-500" /> {stats?.likes ?? 0}
            </span>
            <span className="flex items-center gap-1.5" title="Followers">
              <BsPeopleFill /> {stats?.follows ?? 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
