import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BsCalendar2, BsBook, BsTrash, BsPencil, BsShare } from "react-icons/bs";
import toast from "react-hot-toast";
import Button from "../shared/Button";
import ConfirmDialog from "../shared/ConfirmDialog";
import ActionButtons from "./ActionButtons";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import { formatDate } from "../../utils/helpers";
import UserBadges from "../shared/UserBadges";
import useAccount from "../../hooks/useAccount";
import useCheckout from "../../hooks/useCheckout";
import { useNovelModal } from "../../hooks/useNovelModal";

interface BookHeroProps {
  bookId: number;
  title: string;
  author: string;
  imgUrl: string;
  description: string;
  genres: string[];
  createdAt: string;
  chapterCount: number;
  isOwner: boolean;
  owner?: { id: number; name: string; role?: string } | null;
}

/**
 * Cover on the left, everything about the book on the right. The cover used to
 * be a fixed 384px square inside a flex column, so it was squashed whenever the
 * column got narrower than that.
 */
const BookHero: React.FC<BookHeroProps> = ({
  bookId,
  title,
  author,
  imgUrl,
  description,
  genres,
  createdAt,
  chapterCount,
  isOwner,
  owner,
}) => {
  const { openModal } = useNovelModal();
  const { hasPaid, isChecking } = useAccount();
  const checkout = useCheckout();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const canContribute = isOwner || hasPaid;

  const deleteBook = useMutation({
    mutationFn: () => newRequest.delete(`/api/books/${bookId}`),
    onSuccess: () => {
      toast.success("Book deleted");
      queryClient.invalidateQueries({ queryKey: ["userBooks"] });
      queryClient.invalidateQueries({ queryKey: ["randomBooks"] });
      navigate("/profile", { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not delete this book."));
      setConfirmOpen(false);
    },
  });

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-10">
      {/* fixed ratio: the image can no longer stretch or shrink out of shape */}
      <div className="mx-auto w-full max-w-[300px] lg:mx-0">
        <img
          src={imgUrl}
          alt={`${title} cover`}
          className="aspect-[3/4] w-full rounded-xl border-2 border-black object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-voyage text-3xl uppercase leading-tight sm:text-4xl">
              {title}
            </h1>
            <p className="mt-1 font-baskervville text-sm text-black/60">by {author}</p>
            {owner && (
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-black/50">Created by</span>
                <Link
                  to="/profile"
                  state={{ userId: owner.id }}
                  className="font-romieMedium underline underline-offset-4">
                  {owner.name}
                </Link>
                <UserBadges role={owner.role} isOwner />
              </p>
            )}
          </div>

          {isOwner && (
            <div className="flex shrink-0 gap-2">
            <Link
              to={`/books/${bookId}/edit`}
              className="flex items-center gap-2 rounded-md border border-black/30 px-3 py-2 text-sm transition-colors hover:bg-black hover:text-white">
              <BsPencil /> Edit
            </Link>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex shrink-0 items-center gap-2 rounded-md border border-red-900/40 px-3 py-2 text-sm text-red-900 transition-colors hover:bg-red-900 hover:text-white">
              <BsTrash /> Delete book
            </button>
            </div>
          )}
        </div>

        {genres.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {genres.map((genre) => (
              <span
                key={genre}
                className="rounded-md bg-black px-2 py-1 text-xs text-white">
                #{genre}
              </span>
            ))}
          </div>
        )}

        <p className="mt-4 max-w-2xl font-baskervville text-sm leading-relaxed text-black/80">
          {description}
        </p>

        <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div className="flex items-center gap-2">
            <BsCalendar2 className="text-base" />
            <dt className="sr-only">Created</dt>
            <dd>{formatDate(createdAt)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <BsBook className="text-base" />
            <dt className="sr-only">Chapters</dt>
            <dd>
              {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
            </dd>
          </div>
        </dl>

        <div className="mt-5">
          <ActionButtons />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="flex w-full items-center justify-center gap-2 px-6 py-2 text-sm sm:w-fit"
            onClick={() => {
              // the public page needs no account, so this link works anywhere
              const url = `${window.location.origin}/read/${bookId}`;
              navigator.clipboard
                ?.writeText(url)
                .then(() => toast.success("Public link copied"))
                .catch(() => toast.error(url));
            }}>
            <BsShare /> Share
          </Button>
          {canContribute ? (
            <Button
              className="w-full px-6 py-2 text-sm sm:w-fit"
              disabled={isChecking}
              onClick={() => openModal("visual")}>
              + New chapter
            </Button>
          ) : (
            <Button
              className="w-full px-6 py-2 text-sm sm:w-fit"
              disabled={checkout.isPending || isChecking}
              onClick={() => checkout.mutate()}>
              {checkout.isPending ? "Processing…" : "Subscribe for $5 to contribute"}
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        loading={deleteBook.isPending}
        title="Delete this book?"
        description={`"${title}" and all of its chapters, content, comments and its conversation will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete book"
        onConfirm={() => deleteBook.mutate()}
        onClose={() => setConfirmOpen(false)}
      />
    </section>
  );
};

export default BookHero;
