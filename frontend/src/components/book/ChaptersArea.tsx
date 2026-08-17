import {
  BsBook,
  BsCalendar2,
  BsLayoutSidebarInsetReverse,
  BsLink,
} from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import Loader from "../shared/Loader";
import { formatDate } from "../../utils/helpers";

export interface Chapter {
  id: number;
  title: string;
  cover_image: string;
  book: {
    title: string;
    id: number;
  };
}

const ChaptersArea = ({ date, genres }: { date: string; genres: string[] }) => {
  const { id } = useParams();

  const {
    data: chapters = [],
    isLoading,
    isError,
    error,
  } = useQuery<Chapter[]>({
    queryKey: ["chapters", id],
    queryFn: async () => {
      const response = await newRequest.get(`/api/books/${id}/chapters`);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: Boolean(id),
  });

  return (
    <div className="p-4 sm:p-8 flex-col flex lg:p-12 lg:px-20">
      <div className="flex gap-2 flex-col items-start">
        <div className="flex lg:justify-end w-full gap-2 flex-wrap">
          {genres.map((genre: string) => (
            <span key={genre} className="text-sm rounded-md p-1 bg-black text-white">
              #{genre}
            </span>
          ))}
        </div>
        <div className="flex items-center text-base sm:text-xl gap-2 font-semibold flex-wrap">
          <BsCalendar2 className="text-xl sm:text-2xl" />
          Created Date:
          {/* used to render a clock time under a "date" label */}
          <div className="text-lg text-gray-700 underline">{formatDate(date)}</div>
        </div>
        <div className="flex items-center text-base sm:text-xl gap-2 font-semibold">
          <BsBook className="text-xl sm:text-2xl" /> CHAPTERS:
          <span className="underline flex justify-center items-center">
            {isLoading ? "…" : chapters.length}
          </span>
        </div>
      </div>
      <Link
        to="/create-book"
        className="text-sm text-gray-800 underline flex items-center gap-2 justify-end">
        CREATE MORE BOOKS <BsLink className="text-lg" />
      </Link>
      <div className="w-full my-3 flex gap-3 items-center justify-center bg-black text-white uppercase px-4 py-3 text-xl sm:text-2xl lg:text-3xl font-voyage rounded-lg">
        <BsLayoutSidebarInsetReverse /> chapters
      </div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <p className="text-red-600">{getErrorMessage(error, "Could not load chapters.")}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-3 sm:gap-5">
          {chapters.length > 0 ? (
            chapters.map((chapter) => (
              <Link
                key={chapter.id}
                className="border-black border-2 w-full relative"
                to={`/chapters/${chapter.id}`}>
                <img
                  src={chapter.cover_image}
                  alt={chapter.title}
                  className="h-full w-full object-cover aspect-[2/3]"
                />
                <span className="bg-slate-100 h-fit w-full text-center absolute bottom-0 truncate px-1">
                  {chapter.title}
                </span>
              </Link>
            ))
          ) : (
            <div>No chapters available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChaptersArea;
