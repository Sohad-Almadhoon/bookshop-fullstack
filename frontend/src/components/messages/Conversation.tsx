import React from "react";
import { BsChatDotsFill, BsPeopleFill } from "react-icons/bs";

const Conversation: React.FC<any> = ({ book, participants }) => {
  return (
    <div className="flex-1 p-2 max-w-full">
      <div className="flex gap-2 justify-around items-center border-b pb-2 border-black">
        <div className="flex items-center gap-4 truncate">
          {" "}
          <img
            src={book.main_cover}
            alt="book"
            className="w-12 h-16 object-cover"
          />
          <div className="flex-1 truncate">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold tracking-tighter">
                {book.title}
              </h3>{" "}
              <span className="font-medium">Author:{book.author}</span>
            </div>
          </div>{" "}
        </div>

        <BsChatDotsFill className="text-2xl lg:text-4xl text-[#625C51]" />
        {participants.length > 0 && (
          <div className="flex gap-2 items-center">
            <BsPeopleFill className="text-3xl lg:text-5xl" />
            <span className="text-lg lg:text-2xl font-bold flex justify-center size-8 lg:size-12 items-center border-black border rounded-full">
              +{participants.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversation;
