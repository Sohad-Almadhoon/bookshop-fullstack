import { FC, useState, useEffect } from "react";
import { BsBook, BsLayoutSidebarInsetReverse } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";

export interface Chapter {
  id: number;
  title: string;
  cover_image: string;
  book: {
    title: string;
    id: number;
  };
}

const ChaptersArea: FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await newRequest.get(`/api/books/${id}/chapters`);
        setChapters(response.data);
      } catch (err) {
        console.error("Error fetching chapters:", err);
        setError("Failed to fetch chapters.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [id]);

  if (loading) {
    return <div>Loading chapters...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div className="flex-2 p-12 flex-col flex px-20">
      <div className="flex items-center flex-wrap gap-10">
        <div className="flex items-center text-xl gap-2 justify-center font-semibold">
          <BsBook className="text-2xl" /> CHAPTERS:
          <span className="bg-black size-8 flex justify-center items-center text-white rounded-full">
            {" "}
            {chapters.length}
          </span>
        </div>
      </div>
      <div className="w-full my-3 flex gap-4 items-center justify-center bg-black text-white uppercase px-5 py-3 text-3xl font-voyage rounded-lg">
        <BsLayoutSidebarInsetReverse /> chapters
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-3">
        {chapters.map((chapter) => (
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
        ))}
      </div>
    </div>
  );
};

export default ChaptersArea;
