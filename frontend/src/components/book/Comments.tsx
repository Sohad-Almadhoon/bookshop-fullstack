import { FC, useLayoutEffect } from "react";
import Button from "../shared/Button";
import newRequest from "../../utils/newRequest";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../shared/Loader";
import toast from "react-hot-toast";
import { BsTrash } from "react-icons/bs";

// Define types
interface User {
  name: string;
  id: number;
}

interface CommentType {
  id: number;
  user: User;
  content: string;
  created_at: string;
}

const Comments = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const {
    data: comments = [],
    isLoading,
    isError,
  } = useQuery<CommentType[]>({
    queryKey: ["comments", id],
    queryFn: async () => {
      const response = await newRequest.get(`/api/books/${id}/comments`);
      return response.data;
    },
    enabled: !!id,
  });
  const fetchComments = async (newCommentContent: string) => {
    const response = await newRequest.post(`/api/books/${id}/comments`, {
      content: newCommentContent,
    });
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: fetchComments,
    onSuccess: (newComment) => {
      queryClient.setQueryData(
        ["comments", id],
        (oldComments: CommentType[] | undefined) => [
          ...(oldComments || []),
          newComment,
        ]
      );
      (document.querySelector("textarea[name='comment']") as HTMLTextAreaElement).value = "";
      toast.success("Comment submitted successfully");
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.error("Error submitting comment:", error.message);
      } else {
        console.error("Error submitting comment:", error);
      }
    },
  });

  const handleCommentSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    comment: string
  ) => {
    e.preventDefault();
    if (comment.trim()) {
      mutation.mutate(comment);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl overflow-y-scroll">
      <form
        onSubmit={(e) =>
          handleCommentSubmit(e, (e.target as any).elements.comment.value)
        }
        className="w-full">
        <textarea
          name="comment"
          placeholder="Enter your comments."
          className="p-3 bg-transparent border-black border-opacity-30 w-full border outline-none min-h-32 rounded-2xl placeholder:text-black placeholder:text-opacity-30"></textarea>

        <Button
          type="submit"
          className="mt-5 w-fit self-end"
          disabled={mutation.isPending}>
          {mutation.isPending ? "Sending..." : "Send"}
        </Button>
      </form>

      {isLoading ? (
        <Loader />
      ) : isError ? (
        <p className="text-red-500">Error loading comments</p>
      ) : comments.length > 0 ? (
        <div className="w-full max-w-md p-3">
          {comments.map((comment) => (
            <Comment key={comment.id} bookId={id} comment={comment} />
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
}

const Comment: FC<CommentProps> = ({ comment, bookId }) => {
  const queryClient = useQueryClient();
  const [isAbleToDelete, setIsAbleToDelete] = useState(false);

  useLayoutEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (currentUser?.user?.id === comment.user.id) {
      setIsAbleToDelete(true);
    } else {
      setIsAbleToDelete(false);
    }

    return () => {
      setIsAbleToDelete(false);
    }
  }, [])

  const handleDeleteComment = async () => {
    try {
      if (!bookId || !comment?.id) {
        toast.error("Invalid comment or book ID");
        return;
      }

      await newRequest.delete(`/api/books/${bookId}/comments/${comment.id}`);

      queryClient.invalidateQueries({ queryKey: ["comments", bookId] });

      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete the comment. Please try again.");
    }
  };
  return (
    <div className="flex mt-7 flex-col w-full">
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-4">
          <Link
            to={`/profile`}
            state={{
              userId: comment.user.id,
            }}
            className="size-8 rounded-full text-white bg-black flex justify-center items-center">
            {comment.user.name.charAt(0)}
          </Link>
          <p className="font-bold">{comment.user.name}</p>
        </div>
        <span className="text-sm">
          {new Date(comment.created_at).toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <div className="flex w-full justify-between items-center border-b border-black pb-3">
        <div className="leading-5 text-start text-gray-600 text-sm mt-4 ">
          {comment.content}
        </div>
        {isAbleToDelete && (
          <BsTrash className="text-xl cursor-pointer" onClick={handleDeleteComment} />
        )}
      </div>
    </div>
  );
};

export default Comments;
