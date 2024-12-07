import React from "react";
import { BsChatDotsFill, BsPeopleFill } from "react-icons/bs";

const Conversation: React.FC<any> = ({ book, participants }) => {
  return (
    <div className="flex-1 p-2">
      <div className="flex gap-2 justify-around items-center border-b pb-2 border-black">
        <div className="flex items-center gap-4">
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

        <BsChatDotsFill className="text-4xl text-[#625C51]" />
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
