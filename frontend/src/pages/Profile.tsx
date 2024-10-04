import React from "react";
import Button from "../components/Button";
import BookCard from "../components/BookCard";

const Profile = () => {
  return (
    <div className="p-2">
      <div className="flex justify-between border-black border h-16 items-center px-12">
        <div>Logo</div>
        <div className="flex gap-5">
          <div>Notification</div>
          <div>Messages</div>
          <div>Menu bar</div>
        </div>
      </div>
      <div className="px-12 border-black border ">
        {" "}
        <div className="border rounded-md text-gray-500 p-8 mt-5 flex gap-4">
          <div>
            <img src="/assets/collection-thumbnail.png" alt="profile-img" />
          </div>
          <div className="flex-1">
            <h1 className="uppercase text-5xl text-black font-light mb-3">
              andrew <sub>nox</sub>
            </h1>
            <p>
              I am dedicated writer that aspires to be the greatest of all time.
              One becomes part of the art we see and I want people to see the
              taste at its best.
            </p>
            <div className="flex items-center gap-2">
              <Button className="w-fit rounded-md">follow</Button>
              <p>
                <span>705</span>
                <span>Following</span>
              </p>
              <p>
                <span>900</span>
                <span>Follower</span>
              </p>
            </div>
          </div>
          <div>
            <div>TOTAL IP:$8400</div>
            <div className="flex gap-2 ">
              {" "}
              <p className="border rounded-md text-gray-500 py-1 px-2 text-sm">
                #HORROR
              </p>
              <p className="border rounded-md text-gray-500 py-1 px-2 text-sm">
                #SCL-F1
              </p>
              <p className="border rounded-md text-gray-500 py-1 px-2 text-sm">
                #EROTIC
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="flex my-4">
            <Button>
              <span></span>BLOCKS <span>3</span>
            </Button>
            <Button className="bg-white text-black">
              <span></span>FOLLOWING <span>3</span>
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 3, 5, 6, 4].map((card) => (
              <BookCard />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
