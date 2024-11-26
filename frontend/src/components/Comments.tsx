import { FC, useState, useEffect } from "react";
import Button from "./shared/Button";
import newRequest from "../utils/newRequest"; // Assuming you have a custom utility for making requests

interface CommentType {
  id: number;
  userName: string;
  content: string;
  createdAt: string;
}

const Comments = () => {
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<CommentType[]>([]);

  // Fetch the comments for the book (use the book ID in your API)
  const fetchComments = async () => {
    try {
      const response = await newRequest.get("/api/books/comments"); 
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

  useEffect(() => {
    fetchComments();
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  // Submit the comment
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return; 

    try {
      const response = await newRequest.post("/api/books/comments", {
        content: comment,
      });
      if (response.status === 201) {
        setComment(""); // Clear the input field
        fetchComments(); // Refresh the comments list
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
    <div className="flex flex-col justify-center items-center max-w-md overflow-y-scroll">
      {/* Comment input */}
      <textarea
        placeholder="Enter your comments."
        value={comment}
        onChange={handleInputChange}
        className="p-3 bg-transparent border-black border-opacity-30 w-full border outline-none min-h-32 rounded-2xl placeholder:text-black placeholder:text-opacity-30"></textarea>

      {/* Submit button */}
      <Button onClick={handleCommentSubmit}>Send</Button>

      {/* List of existing comments */}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))
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
    <div className="flex mt-7 flex-col">
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-4">
          {/* Display user initials */}
          <span className="size-8 rounded-full text-white bg-black flex justify-center items-center">
            {comment.userName[0]} {/* First letter of user name */}
          </span>
          <p className="font-bold">{comment.userName}</p>
        </div>
        <span className="text-sm">
          {new Date(comment.createdAt).toLocaleTimeString()}
        </span>
      </div>
      <div className="leading-5 text-gray-600 text-sm mt-4 border-b border-black pb-3">
        {comment.content}
      </div>
    </div>
  );
};

export default Comments;
