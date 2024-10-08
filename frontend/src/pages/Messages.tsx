import React from "react";
import Header from "../components/shared/Header";

const MessageItem = () => {
  return (
    <div className="bg-white flex-1 p-2">
      <div className="flex gap-2">
        <img
          src="/assets/book-1.png"
          alt="book"
          className="w-12 h-16 object-cover"
        />
        <div className="flex-1">
          <div className="flex gap-10">
            <h3 className="text-xl font-bold">The Watering Hole</h3>
            <div className="flex relative">
              <div className="w-9 h-9 border-black border rounded-full absolute right-5 z-30">
                <img src="/assets/profile.png" alt="" />
              </div>
              <div className="w-9 h-9 border-black border rounded-full absolute right-7 z-10"></div>
              <div className="w-9 h-9 text-lg border-black border rounded-full flex justify-center items-center z-50 bg-[#dfd4bf]">
                65+
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <img src="/assets/sender-1.png" alt="" />
            <span className="font-medium">~Emily89</span>
            <p className="text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-gray-400 text-sm">1408</span>
          <span className="rounded-full text-white bg-black flex items-center justify-center w-6 h-6">
            1
          </span>
        </div>
      </div>
    </div>
  );
};

const Messages = () => {
  return (
    <div className="bg-[#dfd4bf] min-h-screen border border-black m-2">
      <Header />
      <div className="border-black border mx-16 mt-8 h-screen">
        <div className="flex justify-between px-2 my-4">
          <span>Messages</span> <span>List</span>
        </div>
        <div className="flex gap-10 border-black">
          <MessageItem />
        </div>
        <div className="flex gap-10 border-t border-black">
          <MessageItem />
        </div>
      </div>
    </div>
  );
};

export default Messages;
