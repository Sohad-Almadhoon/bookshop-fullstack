import React from "react";
import Header from "../components/shared/Header";
import { Link } from "react-router-dom";
import Conversation from "../components/messages/Conversation";

const messages = [
  {
    id: 1,
    sender: {
      name: "John Doe",
      avatar: "/assets/sender-1.png",
    },
    book: {
      title: "The Art of War",
      image: "/assets/book-1.png",
    },
    lastMessage:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    unread: 2,
    time: "14:08",
  },
  {
    id: 2,
    sender: {
      name: "Emily89",
      avatar: "/assets/sender-2.png",
    },
    book: {
      title: "The Art of War",
      image: "/assets/book-2.png",
    },
    lastMessage: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    unread: 1,
    time: "15:23",
  },
];

const Messages = () => {
  return (
    <div className=" min-h-screen border border-black m-2">
      <Header profile />
      <div className="border-black border mx-16 my-8 h-screen">
        <div className="flex justify-between items-center p-4">
          <p className="text-2xl">Messages</p>
          <img src="/assets/file-check.svg" alt="file-check" />
        </div>
        <div>
          {messages.map((message) => (
            <Link to="/messages/2" className="flex gap-10 border-black mt-2">
              <Conversation {...message} key={message.id} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
