import React from "react";
import { BsChatDotsFill, BsPeopleFill } from "react-icons/bs";
import { formatClock } from "../../utils/helpers";

interface ConversationProps {
  book: { id: number; title: string; author: string; main_cover: string } | null;
  participants: { id: number; userId: number }[];
  lastMessage?: { content: string; createdAt: string };
}

// Every field is guarded: a conversation without a book used to crash the page.
const Conversation: React.FC<ConversationProps> = ({ book, participants, lastMessage }) => (
  <div className="flex-1 p-2 sm:p-3 max-w-full min-w-0">
    <div className="flex gap-3 items-center border-b pb-2 border-black">
      <img
        src={book?.main_cover || "/assets/book-1.png"}
        alt=""
        className="w-12 h-16 object-cover shrink-0"
      />

      {/* min-w-0 is what actually lets the text truncate inside a flex row */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg sm:text-xl font-bold tracking-tighter truncate">
          {book?.title || "Untitled conversation"}
        </h3>
        <span className="font-medium text-sm block truncate">
          Author: {book?.author || "Unknown"}
        </span>
        {lastMessage && (
          <p className="text-sm text-gray-600 truncate">
            {lastMessage.content}
            <span className="ml-2 text-xs">{formatClock(lastMessage.createdAt)}</span>
          </p>
        )}
      </div>

      {/* decorative on phones - it only stole width from the title */}
      <BsChatDotsFill className="hidden sm:block text-2xl lg:text-4xl text-[#625C51] shrink-0" />

      {participants.length > 0 && (
        <div className="flex gap-1 sm:gap-2 items-center shrink-0">
          <BsPeopleFill className="text-xl sm:text-3xl lg:text-5xl" />
          <span className="text-sm sm:text-lg lg:text-2xl font-bold flex justify-center size-7 sm:size-8 lg:size-12 items-center border-black border rounded-full">
            {participants.length}
          </span>
        </div>
      )}
    </div>
  </div>
);

export default Conversation;
