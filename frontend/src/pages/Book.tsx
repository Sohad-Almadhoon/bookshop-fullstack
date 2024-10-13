import {
  BsCalendar2DateFill,
  BsCashCoin,
  BsCashStack,
  BsChatFill,
  BsHeartFill,
  BsLayoutSidebar,
  BsLayoutSplit,
  BsLayoutThreeColumns,
  BsListCheck,
  BsPeopleFill,
  BsPersonFill,
  BsPlus,
  BsStack,
} from "react-icons/bs";
import Button from "../components/shared/Button";
import Header from "../components/shared/Header";
import { useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Link } from "react-router-dom";

const Book = () => {
  const [tab, setTab] = useState(0);
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="The Oracles Verse" className="text-4xl uppercase" />
      <div className="flex border border-black flex-1">
        <div className="border-r border-black flex-1 p-4 flex flex-col px-28">
          <h1 className="uppercase text-5xl font-light mb-4 w-96">
            worldview ethics
          </h1>
          <Button>
            invest as little as <sup>$</sup>10
          </Button>
          <div className="mt-4 flex-1">
            <img src="/assets/book-2.png" alt="" className="h-full w-full" />
          </div>
          <div className="flex gap-3 mt-2 items-center">
            <Button variant="outline" className="flex gap-1 p-1 text-xs">
              <BsChatFill className="text-black text-sm" />
              comments
            </Button>
            <Button variant="outline" className="flex gap-1 p-1 text-xs">
              <BsPeopleFill className="text-black text-sm " />
              follow
            </Button>
            <Button variant="outline" className="flex gap-1 p-1 px-2 text-xs">
              <BsHeartFill className="text-black text-sm " />
              like
            </Button>
          </div>
        </div>
        <div className="flex-2 p-12 flex-col flex px-20">
          <div className="flex flex-wrap items-center gap-3 w-3/4">
            <div className="flex items-center text-2xl gap-1">
              <img src="/assets/coins-stacked.svg" alt="" className="w-9 h-9" />
              FUND:$3K
            </div>
            <div className="flex items-center text-2xl gap-1">
              <BsPersonFill />
              CONTRIBUTORS: 34
            </div>
            <div className="flex items-center text-2xl gap-1">
              <BsCalendar2DateFill />
              DATE CREATED: 22/03/2024
            </div>
          </div>
          <div className="flex my-10">
            <Button
              variant={tab === 0 ? "" : "outline"}
              className="text-2xl flex gap-2 items-center justify-center font-light rounded-r-none"
              onClick={() => setTab(0)}>
              <BsLayoutThreeColumns /> Chapters
            </Button>
            <Button
              variant={tab === 1 ? "" : "outline"}
              onClick={() => setTab(1)}
              className="text-2xl flex gap-2 items-center justify-center font-light rounded-l-none">
              <BsListCheck />
              description
            </Button>
          </div>

          <div className="flex-1">
            {tab === 0 ? (
              <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                {[1, 2, 3, 4].map((num) => (
                  <Link className=" border-black border-2 w-48 " to="/">
                    <img
                      src={`/assets/nft${num}.png`}
                      alt="nft"
        
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <h4 className="text-2xl">ARCHITECTS</h4>
                <hr className=" h-1 bg-black " />
                {[
                  "MUSIC BY BOB JUBURI",
                  " ILLUSTRATION BY FAIZAL “GANEE”",
                  " WRITING BY MARYANNA CLARKE",
                ].map((item, index) => (
                  <Disclosure key={index}>
                    {() => (
                      <>
                        <DisclosureButton>
                          <p className="flex text-xl py-3 justify-between items-center pb-3  border-b border-black">
                            <span className="pl-4">{item}</span>
                            <BsPlus className="text-4xl" />
                          </p>
                        </DisclosureButton>
                        <DisclosurePanel className="text-base">
                          If you're unhappy with your purchase for any reason,
                          email us within 90 days and we'll refund you in full,
                          no questions asked.
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                ))}
                <div className="flex flex-col mt-12">
                  <h4 className="text-2xl">DESCRIPTION</h4>
                  <hr className=" h-1 bg-black " />
                  <p className="text-xl font-light mt-4">
                    The First Ever collaborative “Crypto-Novel '' follows the
                    stories of 6 characters which travel through the minds of
                    their owners, collecting unique journeys that evolve their
                    stories, infinitely.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
