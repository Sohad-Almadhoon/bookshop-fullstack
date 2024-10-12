import Button from "../components/shared/Button";
import Heading from "../components/shared/Heading";
import { BsArrowDownShort } from "react-icons/bs";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full flex flex-col items-center min-h-screen">
      <div className="max-w-3xl py-5 flex justify-center items-center md:flex-1 w-full">
        <div className="relative">
          <img src="/assets/home-circle.svg" alt="" />
          <div className="absolute flex flex-col items-center gap-3 top-16  md:top-1/4  inset-0">
            <img src="/assets/home-title.svg" alt="" className="w-40 md:w-72" />
            <Heading size="sm" />
          </div>
          <div className="absolute top-3/4 left-1/2 md:w-[200px]   w-[120px] -ml-[60px]  -mt-3 md:-ml-[95px] md:mt-[25px]">
            <Link to="/login">
              <Button className="p-1 ">login</Button>
            </Link>
            <Link to="/register">
              <Button className="p-1 mt-1" variant="outline">
                sign up
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Link className="flex flex-col mt-3 items-center cursor-pointer" to="">
        <span className="text-gray-500 uppercase">discover</span>
        <BsArrowDownShort className="text-black text-4xl" />
      </Link>
    </div>
  );
};

export default Home;
