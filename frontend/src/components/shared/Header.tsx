import { Link } from "react-router-dom";
import Heading from "./Heading";

const Header = ({ profile }: { profile?: boolean; }) => {
  return (
    <div className="flex items-center  border-black border py-1 px-12">
      <Link to="/" className="flex-1">
        <img src="/assets/logo-dark.svg" alt="logo" className="w-14" />
      </Link>
      {!profile && <Heading size="lg" />}
      <div className="flex-1 justify-end flex gap-3">
        {profile && (
          <div className="flex gap-3">
            <Link className="relative" to="/notifications">
              <img src="/assets/bell.svg" alt="" />
              <div className="absolute top-0 right-0 w-6 h-6 bg-black rounded-full flex justify-center items-center">
                <p className="text-xs text-white">2</p>
              </div>
            </Link>
            <Link to="/messages">
              {" "}
              <img src="/assets/messages.svg" alt="" />
            </Link>
          </div>
        )}
        <img src="/assets/menu-black.svg" alt="menu" />
      </div>
    </div>
  );
};

export default Header;
