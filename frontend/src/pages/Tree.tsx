import React from "react";
import Header from "../components/shared/Header";
import Ring from "../components/Ring";
const Tree = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="relative flex pt-12 justify-center w-full items-end flex-1 min-h-screen  border-black border">
        <img src="/assets/tree.svg" alt="tree" className="mt-28" />
        <div className="absolute left-[18%] bottom-[20%]">
          <Ring
            content={
              <img
                className="h-[150px] object-contain"
                src="/assets/owl.png"
                alt=""
              />
            }
            text="Profile&nbsp;Profile&nbsp;Profile&nbsp;Profile"
            href="/profile"
          />
        </div>
        <div className="absolute left-[22%] top-20">
          <Ring
            content={
              <img
                className="h-[150px] object-contain"
                width={150}
                height={150}
                src="/assets/dog.png"
                alt=""
              />
            }
            text="Discover&nbsp;&nbsp;Discover&nbsp;&nbsp;Discover"
            href="/discover"
          />
        </div>
        <div className="absolute left-[42%] -top-[0]">
          <Ring
            content={
              <img
                className="h-[150px] object-contain"
                width={150}
                height={150}
                src="/assets/fish.png"
                alt=""
              />
            }
            text="About&nbsp;&nbsp;About&nbsp;&nbsp;About&nbsp;&nbsp;About"
            href="/about"
          />
        </div>
        <div className="absolute right-[22%] top-20">
          <Ring
            content={
              <img
                className="h-[150px] w-[150px] object-contain"
                src="/assets/bat.png"
                alt=""
              />
            }
            text="How it works&nbsp;&nbsp;How it works"
            href="/how-it-works"
          />
        </div>
        <div className="absolute right-[22%] bottom-[20%]">
          <Ring
            content={
              <img
                className="h-[150px] w-[150px] object-contain"
                src="./assets/fish-2.png"
                alt=""
              />
            }
            text="Redeem&nbsp;Redeem&nbsp;Redeem&nbsp;Redeem"
            href="/redeem"
          />
        </div>
      </div>
    </div>
  );
};

export default Tree;
