import { Outlet } from "react-router-dom";
import Header from "../shared/Header";
import SideImage from "./SideImage";

const SignLayout: React.FC = () => {
  return (
    <div className=" bg-[#DDD1BB]  h-[calc(100vh - 400px)]">
      <Header />
      <div className="flex gap-2 border border-black mx-4 mt-5 mb-2 p-5">
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
