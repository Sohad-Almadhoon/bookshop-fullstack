import { FC, useState, useEffect } from "react";
import Button from "./shared/Button";
import newRequest from "../utils/newRequest"; // Assuming you have a custom utility for making requests
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
interface User{
  name: string;
  id: number
}
interface CommentType {
  id: number;
  user: User;
  content: string;
  created_at: string;
}

const Comments = () => {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<CommentType[]>([]);
  const {id} = useParams(); // Extract bookId from the URL params


  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await newRequest.get(`/api/books/${id}/comments`);
        if (response.status === 200) {
          setComments(response.data);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error fetching comments:", error.message);
        } else {
          console.error("Error fetching comments:", error);
        }
      }
    };
    fetchComments();
  }, [id]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  // Submit the comment
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return; 

    try {
      const response = await newRequest.post(`/api/books/${id}/comments`, {
        content: comment,
      });
      if (response.status === 201) {
        setComment(""); 
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching comments:", error.message);
      } else {
        console.error("Error fetching comments:", error);
      }
    }
  };

  return (
    <div className="flex flex-col  items-center w-full max-w-xl overflow-y-scroll">
      {/* Comment input */}
      <textarea
        placeholder="Enter your comments."
        value={comment}
        onChange={handleInputChange}
        className="p-3 bg-transparent border-black border-opacity-30 w-full border outline-none min-h-32 rounded-2xl placeholder:text-black placeholder:text-opacity-30"></textarea>

      {/* Submit button */}
      <Button onClick={handleCommentSubmit} className="mt-5 w-fit self-end">
        Send
      </Button>

      {/* List of existing comments */}
      {comments.length > 0 ? (
        <div className="w-full max-w-md p-3">
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No comments yet.</p>
      )}
    </div>
  );
};

interface CommentProps {
  comment: CommentType;
}

const Comment: FC<CommentProps> = ({ comment }) => {
  return (
    <div className="flex mt-7 flex-col w-full ">
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-4">
          {/* Display user initials */}
          <Link to={`/profile`} state={{
            userId: comment.user.id
          }} className="size-8 rounded-full text-white bg-black flex justify-center items-center">
            {comment.user.name.charAt(0)}
          </Link>
          <p className="font-bold">{comment.user.name}</p>
        </div>
        <span className="text-sm">
          {new Date(comment.created_at).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
      <div className="leading-5 text-start text-gray-600 text-sm mt-4 border-b border-black pb-3">
        {comment.content}
      </div>
    </div>
  );
};

export default Comments;
