import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BsArrowsMove,
  BsEyeSlash,
  BsLayoutSidebarInsetReverse,
  BsPencil,
  BsTrash,
} from "react-icons/bs";
import toast from "react-hot-toast";
import Loader from "../shared/Loader";
import ConfirmDialog from "../shared/ConfirmDialog";
import Button from "../shared/Button";
import CustomInput from "../shared/CustomInput";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import usePrefetch from "../../hooks/usePrefetch";

export interface Chapter {
  id: number;
  title: string;
  cover_image: string;
  position?: number;
  published?: boolean;
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
  const [editing, setEditing] = useState<Chapter | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // Local copy so a drag feels instant; the server order arrives right after.
  const [order, setOrder] = useState<Chapter[]>(chapters);
  const [dragId, setDragId] = useState<number | null>(null);

  useEffect(() => setOrder(chapters), [chapters]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["chapters", bookId] });

  const deleteChapter = useMutation({
    mutationFn: (chapterId: number) => newRequest.delete(`/api/chapters/${chapterId}`),
    onSuccess: () => {
      toast.success("Chapter deleted");
      refresh();
      setPendingDelete(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not delete this chapter."));
      setPendingDelete(null);
    },
  });

  const updateChapter = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Record<string, unknown> }) =>
      newRequest.patch(`/api/chapters/${id}`, body),
    onSuccess: () => {
      refresh();
      setEditing(null);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not update the chapter.")),
  });

  const reorder = useMutation({
    mutationFn: (ids: number[]) =>
      newRequest.patch(`/api/books/${bookId}/chapters/order`, { order: ids }),
    onSuccess: () => {
      toast.success("Order saved");
      refresh();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not save the new order."));
      setOrder(chapters); // put it back the way it was
    },
  });

  const move = (fromId: number, toId: number) => {
    if (fromId === toId) return;
    const next = [...order];
    const from = next.findIndex((chapter) => chapter.id === fromId);
    const to = next.findIndex((chapter) => chapter.id === toId);
    if (from < 0 || to < 0) return;
    next.splice(to, 0, next.splice(from, 1)[0]);
    setOrder(next);
    reorder.mutate(next.map((chapter) => chapter.id));
  };

  /** Keyboard equivalent of dragging, so ordering is not mouse-only. */
  const nudge = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    move(order[index].id, order[target].id);
  };

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-black px-5 py-3 text-white">
        <h2 className="flex items-center gap-3 font-voyage text-xl uppercase sm:text-2xl">
          <BsLayoutSidebarInsetReverse className="shrink-0" /> Chapters
        </h2>
        {isOwner && order.length > 1 && (
          <p className="flex items-center gap-2 text-xs text-white/70">
            <BsArrowsMove /> Drag a chapter to reorder
          </p>
        )}
      </div>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <p className="mt-5 text-red-600">
          {getErrorMessage(error, "Could not load chapters.")}
        </p>
      ) : order.length === 0 ? (
        <p className="mt-5 text-center font-baskervville text-black/60">No chapters yet.</p>
      ) : (
        <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {order.map((chapter, index) => (
            <li
              key={chapter.id}
              draggable={isOwner}
              onDragStart={() => setDragId(chapter.id)}
              onDragOver={(e) => isOwner && e.preventDefault()}
              onDrop={() => dragId && move(dragId, chapter.id)}
              onDragEnd={() => setDragId(null)}
              className={`group relative ${dragId === chapter.id ? "opacity-40" : ""} ${
                isOwner ? "cursor-grab active:cursor-grabbing" : ""
              }`}>
              <Link
                to={`/chapters/${chapter.id}`}
                onMouseEnter={() => prefetchChapter(chapter.id)}
                onFocus={() => prefetchChapter(chapter.id)}
                className="block overflow-hidden rounded-lg border-2 border-black transition-transform hover:-translate-y-1">
                <div className="relative aspect-[3/4] w-full bg-black/5">
                  <img
                    src={chapter.cover_image}
                    alt=""
                    loading="lazy"
                    className={`h-full w-full object-cover ${
                      chapter.published === false ? "opacity-50 grayscale" : ""
                    }`}
                  />
                  {chapter.published === false && (
                    <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/80 px-2 py-0.5 text-[10px] uppercase text-white">
                      <BsEyeSlash /> Draft
                    </span>
                  )}
                </div>
                <p className="truncate border-t-2 border-black bg-[#cfc5b0] px-2 py-1.5 text-center text-sm">
                  {chapter.title}
                </p>
              </Link>

              {isOwner && (
                <div className="absolute right-2 top-2 flex flex-col gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 max-lg:opacity-100">
                  <button
                    type="button"
                    aria-label={`Edit ${chapter.title}`}
                    onClick={() => {
                      setEditing(chapter);
                      setEditTitle(chapter.title);
                    }}
                    className="rounded-full border border-black bg-[#DDD1BB] p-2 hover:bg-black hover:text-white">
                    <BsPencil />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${chapter.title}`}
                    onClick={() => setPendingDelete(chapter)}
                    className="rounded-full border border-black bg-[#DDD1BB] p-2 hover:bg-red-800 hover:text-white">
                    <BsTrash />
                  </button>
                </div>
              )}

              {isOwner && order.length > 1 && (
                <div className="mt-1 flex justify-center gap-1">
                  <button
                    type="button"
                    aria-label={`Move ${chapter.title} earlier`}
                    disabled={index === 0}
                    onClick={() => nudge(index, -1)}
                    className="rounded border border-black/20 px-2 text-xs disabled:opacity-30">
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${chapter.title} later`}
                    disabled={index === order.length - 1}
                    onClick={() => nudge(index, 1)}
                    className="rounded border border-black/20 px-2 text-xs disabled:opacity-30">
                    →
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <div className="mt-6 rounded-lg border border-black/30 p-4">
          <p className="font-romieMedium uppercase">Edit chapter</p>
          <CustomInput
            className="mt-3 w-full"
            value={editTitle}
            maxLength={120}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Chapter title"
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              className="w-fit px-4 py-2 text-xs"
              disabled={updateChapter.isPending || !editTitle.trim()}
              onClick={() =>
                updateChapter.mutate({ id: editing.id, body: { title: editTitle.trim() } })
              }>
              Save title
            </Button>
            <Button
              variant="outline"
              className="flex w-fit items-center gap-2 px-4 py-2 text-xs"
              disabled={updateChapter.isPending}
              onClick={() =>
                updateChapter.mutate({
                  id: editing.id,
                  body: { published: editing.published === false },
                })
              }>
              <BsEyeSlash />
              {editing.published === false ? "Publish" : "Move to drafts"}
            </Button>
            <Button
              variant="outline"
              className="w-fit border-none px-4 py-2 text-xs"
              onClick={() => setEditing(null)}>
              Close
            </Button>
          </div>
          <p className="mt-2 text-xs text-black/50">
            A draft stays visible to you and disappears for everyone else.
          </p>
        </div>
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
