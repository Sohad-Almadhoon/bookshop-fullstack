import { Outlet } from "react-router-dom";
import Header from "../shared/Header";
import SideImage from "./SideImage";

const SignLayout: React.FC = () => {
  return (
    <div className="bg-[#DDD1BB] p-2 sm:p-3 min-h-screen font-romie">
      <Header />
      <div className="flex gap-4 border border-black mb-2 p-2 sm:p-5">
        <SideImage />
        <main className="flex-1 min-w-0 flex flex-col p-2 border border-black">
          <Outlet />
        </main>
        <SideImage />
      </div>
    </div>
  );
};

export default SignLayout;
