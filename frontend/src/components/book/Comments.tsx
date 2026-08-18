import { FC, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BsTrash } from "react-icons/bs";
import Button from "../shared/Button";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import Loader from "../shared/Loader";
import { formatDateTime } from "../../utils/helpers";
import { getCurrentUser } from "../../utils/session";
import UserBadges from "../shared/UserBadges";

interface User {
  name: string;
  id: number;
  role?: string;
}

interface CommentType {
  id: number;
  user: User;
  user_id: number;
  content: string;
  created_at: string;
}

const Comments = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const currentUserId = getCurrentUser()?.id;
  // The book already carries its creator, so marking their comments costs
  // nothing extra: this reads the cache the book page just filled.
  const book = queryClient.getQueryData<{ owner?: { id: number } }>(["book", id]);
  const ownerId = book?.owner?.id;

  const {
    data: comments = [],
    isLoading,
    isError,
    error,
  } = useQuery<CommentType[]>({
    queryKey: ["comments", id],
    queryFn: async () => {
      const response = await newRequest.get(`/api/books/${id}/comments`);
      return Array.isArray(response.data) ? response.data : [];
    },
    enabled: Boolean(id),
  });

  const createMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await newRequest.post(`/api/books/${id}/comments`, { content });
      return response.data as CommentType;
    },
    onSuccess: (newComment) => {
      // The list is newest-first, so the new comment goes on top.
      queryClient.setQueryData(["comments", id], (old: CommentType[] | undefined) => [
        newComment,
        ...(old || []),
      ]);
      setDraft("");
      toast.success("Comment submitted successfully");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not post your comment.")),
  });

  const handleCommentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const content = draft.trim();
    if (!content) {
      toast.error("Write something before sending.");
      return;
    }
    createMutation.mutate(content);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl overflow-y-auto">
      <form onSubmit={handleCommentSubmit} className="w-full">
        <textarea
          name="comment"
          value={draft}
          maxLength={1000}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Enter your comments."
          className="p-3 bg-transparent border-black border-opacity-30 w-full border outline-none min-h-32 rounded-2xl placeholder:text-black placeholder:text-opacity-30"
        />
        <Button
          type="submit"
          className="mt-5 w-fit self-end"
          disabled={createMutation.isPending}>
          {createMutation.isPending ? "Sending..." : "Send"}
        </Button>
      </form>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <p className="text-red-500">{getErrorMessage(error, "Error loading comments")}</p>
      ) : comments.length > 0 ? (
        <div className="w-full max-w-md p-3">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              bookId={id}
              comment={comment}
              canDelete={comment.user?.id === currentUserId}
              isBookOwner={Boolean(ownerId) && comment.user?.id === ownerId}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mt-3">No comments yet.</p>
      )}
    </div>
  );
};

interface CommentProps {
  comment: CommentType;
  bookId?: string;
  canDelete: boolean;
  isBookOwner?: boolean;
}

const Comment: FC<CommentProps> = ({ comment, bookId, canDelete, isBookOwner }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => newRequest.delete(`/api/books/${bookId}/comments/${comment.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", bookId] });
      toast.success("Comment deleted successfully");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Failed to delete the comment. Please try again.")),
  });

  return (
    <div className="flex mt-7 flex-col w-full">
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            state={{ userId: comment.user.id }}
            className="size-8 rounded-full text-white bg-black flex justify-center items-center">
            {comment.user.name.charAt(0)}
          </Link>
          <p className="font-bold">{comment.user.name}</p>
          <UserBadges role={comment.user.role} isOwner={isBookOwner} />
        </div>
        <span className="text-sm">{formatDateTime(comment.created_at)}</span>
      </div>
      <div className="flex w-full justify-between items-center border-b border-black pb-3">
        <div className="leading-5 text-start text-gray-600 text-sm mt-4 break-words">
          {comment.content}
        </div>
        {canDelete && (
          <button
            type="button"
            aria-label="Delete comment"
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate()}>
            <BsTrash className="text-xl cursor-pointer" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Comments;
