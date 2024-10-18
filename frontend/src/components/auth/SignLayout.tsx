import { Outlet } from "react-router-dom";
import Header from "../shared/Header";
import SideImage from "./SideImage";

const SignLayout: React.FC = () => {
  return (
    <div className=" bg-[#DDD1BB] p-3 min-h-screen">
      <Header />
      <div className="flex gap-2 border border-black  mb-2 p-5">
        <SideImage />
        <main className="flex-1 grow flex flex-col">
          <Outlet />
        </main>
        <SideImage />
      </div>
    </div>
  );
};

export default SignLayout;
