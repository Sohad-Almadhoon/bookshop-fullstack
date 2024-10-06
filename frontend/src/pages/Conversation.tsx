import React from "react";
import Header from "../components/Header";

const Conversation = () => {
  return (
    <div className="bg-[#dfd4bf] min-h-screen border border-black m-2">
      <Header />
      <div className="border-black border mx-16 mt-8">
        {" "}
        <div className="flex justify-between h-24 items-center border-b px-12 border-black">
          <div className="flex items-center gap-2">
            <span>⬅️</span>{" "}
            <img
              src="/assets/book-1.png"
              alt="book"
              className="w-12 h-16 object-cover"
            />
            <div>
              <h3 className="text-2xl">The Watering Hole</h3>
              <span className="text-xs text-gray-600">
                We should talk more about this novel
              </span>
            </div>
          </div>
          <div className="flex items-center">
            {" "}
            <div className="flex items-center relative">
              <div className="w-12 h-12 border-black border rounded-full absolute right-9 z-30">
                <img src="/assets/profile.png" alt="" />
              </div>
              <div className="w-12 h-12 border-black border rounded-full absolute right-14 z-10"></div>
              <div className="w-12 h-12 text-lg border-black border rounded-full flex justify-center items-center z-50 bg-[#dfd4bf]">
                65+
              </div>
            </div>
            <span>📃</span>
          </div>
        </div>
        <div className="px-12">feip</div>
      </div>
    </div>
  );
};

export default Conversation;
