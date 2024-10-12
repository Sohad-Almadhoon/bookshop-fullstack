import { BsCalendar2Date, BsCalendar2DateFill, BsChatFill, BsHeartFill, BsPeopleFill, BsPerson, BsPersonFill } from "react-icons/bs";
import Button from "../components/shared/Button";
import Header from "../components/shared/Header";

const Book = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex border border-black px-12 flex-1">
        <div className="border-r w-96 border-black flex-1 p-4 flex flex-col items-center">
          <h1 className="uppercase max-w-96 text-5xl font-light mb-4">
            worldview ethics
          </h1>
          <Button>
            invest as little as <sup>$</sup>10
          </Button>
          <div className="mt-4 mx-auto">
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
        <div className="flex-1 p-12">
          <div className="flex flex-wrap items-center">
            <div className="flex items-center">
              <img src="/assets/coins-stacked.svg" alt="" />
              FUND:$3K
            </div>
            <div className="flex items-center">
              <BsPersonFill />
              CONTRIBUTORS: 34
            </div>
            <div className="flex items-center">
              <BsCalendar2DateFill />
              DATE CREATED: 22/03/2024
            </div>
          </div>
          <div className="flex my-10">
            <Button variant="outline">Chapters</Button>
            <Button>description</Button>
          </div>
          <div></div>
          <div>
            The First Ever collaborative “Crypto-Novel” follows the stories of 6
            characters which travel through the minds of their owners,
            collecting unique journeys that evolve their stories, infinitely.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
