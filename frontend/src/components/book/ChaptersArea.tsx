import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BsLayoutSidebarInsetReverse, BsTrash } from "react-icons/bs";
import toast from "react-hot-toast";
import Loader from "../shared/Loader";
import ConfirmDialog from "../shared/ConfirmDialog";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import usePrefetch from "../../hooks/usePrefetch";

export interface Chapter {
  id: number;
  title: string;
  cover_image: string;
  book: { title: string; id: number };
}

interface ChaptersAreaProps {
  bookId: string;
  chapters: Chapter[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isOwner: boolean;
}

const ChaptersArea: React.FC<ChaptersAreaProps> = ({
  bookId,
  chapters,
  isLoading,
  isError,
  error,
  isOwner,
}) => {
  const queryClient = useQueryClient();
  const { prefetchChapter } = usePrefetch();
  const [pendingDelete, setPendingDelete] = useState<Chapter | null>(null);

  const deleteChapter = useMutation({
    mutationFn: (chapterId: number) => newRequest.delete(`/api/chapters/${chapterId}`),
    onSuccess: () => {
      toast.success("Chapter deleted");
      queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });
      setPendingDelete(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not delete this chapter."));
      setPendingDelete(null);
    },
  });

  return (
    <section>
      <h2 className="flex items-center gap-3 rounded-lg bg-black px-5 py-3 font-voyage text-xl uppercase text-white sm:text-2xl">
        <BsLayoutSidebarInsetReverse className="shrink-0" /> Chapters
      </h2>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <p className="mt-5 text-red-600">
          {getErrorMessage(error, "Could not load chapters.")}
        </p>
      ) : chapters.length === 0 ? (
        <p className="mt-5 text-center font-baskervville text-black/60">
          No chapters yet.
        </p>
      ) : (
        // auto-fit + a fixed ratio keeps every card identical at any width
        <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {chapters.map((chapter) => (
            <li key={chapter.id} className="group relative">
              <Link
                to={`/chapters/${chapter.id}`}
                onMouseEnter={() => prefetchChapter(chapter.id)}
                onFocus={() => prefetchChapter(chapter.id)}
                className="block overflow-hidden rounded-lg border-2 border-black transition-transform hover:-translate-y-1">
                <div className="aspect-[3/4] w-full bg-black/5">
                  <img
                    src={chapter.cover_image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="truncate border-t-2 border-black bg-[#cfc5b0] px-2 py-1.5 text-center text-sm">
                  {chapter.title}
                </p>
              </Link>

              {isOwner && (
                <button
                  type="button"
                  aria-label={`Delete ${chapter.title}`}
                  onClick={() => setPendingDelete(chapter)}
                  className="absolute right-2 top-2 rounded-full border border-black bg-[#DDD1BB] p-2 text-black opacity-0 transition-opacity hover:bg-red-800 hover:text-white focus:opacity-100 group-hover:opacity-100 max-lg:opacity-100">
                  <BsTrash />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        loading={deleteChapter.isPending}
        title="Delete this chapter?"
        description={`"${pendingDelete?.title}" and its text and audio will be permanently removed.`}
        confirmLabel="Delete chapter"
        onConfirm={() => pendingDelete && deleteChapter.mutate(pendingDelete.id)}
        onClose={() => setPendingDelete(null)}
      />
    </section>
  );
};

export default ChaptersArea;
