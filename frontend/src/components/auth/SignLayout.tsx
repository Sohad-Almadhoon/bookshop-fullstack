import { Outlet, useNavigate } from "react-router-dom";
import Header from "../shared/Header";
import SideImage from "./SideImage";
import { useEffect } from "react";

const SignLayout: React.FC = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Check for token in localStorage
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     // If token exists, redirect to profile page
  //     navigate("/profile");
  //   }
  // }, [navigate]);
  
  return (
    <div className=" bg-[#DDD1BB] p-3 min-h-screen font-romie">
      <Header />
      <div className="flex gap-4 border border-black  mb-2 p-5">
        <SideImage />
        <main className="flex-1 flex flex-col p-2  border border-black ">
          <Outlet />
        </main>
        <SideImage />
      </div>
    </div>
  );
};

export default SignLayout;
