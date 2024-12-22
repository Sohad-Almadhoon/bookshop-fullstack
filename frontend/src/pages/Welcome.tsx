import { Link } from "react-router-dom";
import Header from "../components/shared/Header";
import Button from "../components/shared/Button";
import { getUser } from "../utils/helpers";

const Welcome = () => {
  const { user } = getUser();
  return (
    <div className="border-black border w-full flex flex-col min-h-screen ">
      <Header />
      <div className="max-w-7xl py-5 mx-auto flex justify-center items-center flex-1 w-full">
        <div className="relative">
          <img src="/assets/frame-box2.png" alt="" />
          <div className="absolute top-1/2 left-1/2 translate-y-1/3 -translate-x-1/2 flex flex-col items-center md:gap-6 gap-1 w-[400px]">
            <Link
              to="/collection"
              className="text-xl tracking-wider text-[#181818] uppercase font-voyage font-bold">
              {user.name}
            </Link>
            <Button className="w-[220px]">
              <Link to="/tree">DISCOVER</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
