import {
  BsBook,
  BsCalendar2,
  BsLayoutSidebarInsetReverse,
  BsLink,
} from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import Loader from "../shared/Loader";
import { useQuery } from "@tanstack/react-query";

export interface Chapter {
  id: number;
  title: string;
  cover_image: string;
  book: {
    title: string;
    id: number;
  };
}

const ChaptersArea = ({ date }: { date: string }) => {
  const { id } = useParams();

const {
  data: chapters = [],
  isLoading,
} = useQuery<Chapter[]>({
  queryKey: ["chapters", id],
  queryFn: async () => {
    const response = await newRequest.get(`/api/books/${id}/chapters`);
    return response.data;
  },
  enabled: !!id,
});

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-12 flex-col flex lg:px-20">
      <div className="flex gap-2 flex-col items-start">
        <div className="flex items-center text-xl gap-2 justify-center font-semibold">
          <BsCalendar2 className="text-2xl" />
          Created Date:
          <div className="text-lg text-gray-700 underline">
            {new Date(date).toLocaleTimeString(undefined, {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
        <div className="flex items-center text-xl gap-2 justify-center font-semibold">
          <BsBook className="text-2xl" /> CHAPTERS:
          <span className=" underline flex justify-center items-center">
            {" "}
            {chapters.length}
          </span>
        </div>
      </div>
        <Link to="/create-book" className="text-sm text-gray-800 underline flex items-center gap-2 justify-end">CREATE MORE BOOKS <BsLink className="text-lg"/></Link>
      <div className="w-full my-3 flex gap-4 items-center justify-center bg-black text-white uppercase px-5 py-3 text-3xl font-voyage rounded-lg">
        <BsLayoutSidebarInsetReverse /> chapters
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-5">
        {chapters.length > 0 ? (
          chapters.map((chapter) => (
            <Link
              key={chapter.id}
              className="border-black border-2 w-52 relative"
              to={`/chapters/${chapter.id}`}
              state={{
                title: chapter.book.title,
                chapterTitle: chapter.title,
                id: chapter.book.id,
              }}>
              <img
                src={chapter.cover_image}
                alt={chapter.title}
                className="h-full w-full object-cover"
              />
              <span className="bg-slate-100 h-fit w-full text-center absolute bottom-0">
                {chapter.title.substring(0, 20)}
              </span>
            </Link>
          ))
        ) : (
          <div>No chapters available</div>
        )}
      </div>
    </div>
  );
};

export default ChaptersArea;
