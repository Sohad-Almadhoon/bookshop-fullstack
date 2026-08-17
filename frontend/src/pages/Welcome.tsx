import { Link } from "react-router-dom";
import Header from "../components/shared/Header";
import Button from "../components/shared/Button";
import { getUser } from "../utils/helpers";

const Welcome = () => {
  // getUser() no longer throws when the entry is missing or malformed.
  const user = getUser();

  return (
    <div className="border-black border w-full flex flex-col min-h-screen">
      <Header />
      <div className="max-w-7xl py-5 mx-auto flex justify-center items-center flex-1 w-full">
        <div className="relative">
          <img src="/assets/frame-box2.png" alt="" />
          <div className="absolute top-1/2 left-1/2 translate-y-1/3 -translate-x-1/2 flex flex-col items-center md:gap-6 gap-1 w-[85%] max-w-[400px]">
            {/* /collection is not a route in this app */}
            <Link
              to="/profile"
              className="text-base sm:text-xl tracking-wider text-[#181818] uppercase font-voyage font-bold text-center truncate max-w-full">
              {user?.name ?? "Reader"}
            </Link>
            {/* kept narrow enough to stay inside the oval of the frame art */}
            <Link to="/tree" className="w-[62%] max-w-[220px]">
              <Button className="w-full px-2 py-2 sm:py-3 text-sm sm:text-base">
                DISCOVER
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
