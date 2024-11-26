import React from "react";
import { BsChatDotsFill, BsPeopleFill } from "react-icons/bs";
// Define types for the Book, User, Message, and Conversation

interface User {
  id: number;
  userId: number;
}

interface Book {
  id: number;
  title: string;
  main_cover: string;
}

interface Message {
  id: number;
  content: string;
  createdAt: string; // You can also use Date if you're parsing it to a Date object
}

interface ConversationType {
  id: number;
  participants: User[];
  book: Book;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// Props for the Conversation component
interface ConversationProps {
  book: Book;
  sender: User;
  lastMessage: string;
  unread: number;
  time: string;
}

// The Conversation component will receive props of type `ConversationProps`
const Conversation: React.FC<any> = ({ book, participants, messages }) => {
  return (
    <div className="flex-1 p-2">
      <div className="flex gap-2 mx-12 justify-around items-center border-b pb-2 border-black">
        <div className="flex items-center">
          {" "}
          <img
            src={book.main_cover}
            alt="book"
            className="w-12 h-16 object-cover"
          />
          <div className="flex-1 truncate">
            <div className="flex gap-10">
              <h3 className="text-xl font-bold tracking-tighter">
                {book.title}
              </h3>{" "}
              <div className="flex items-center gap-2">
                <span className="font-medium">Author:{book.author}</span>
              </div>
            </div>
          </div>{" "}
        </div>

        <p className="text-5xl">
          {" "}
          ...<BsChatDotsFill className="text-xl text-[#625C51]" />
        </p>
        {participants.length > 0 && (
          <div className="flex gap-2 items-center">
            <BsPeopleFill className="text-5xl" />
            <span className=" text-2xl font-bold flex justify-center size-12 items-center border-black border rounded-full">
              +{participants.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversation;
