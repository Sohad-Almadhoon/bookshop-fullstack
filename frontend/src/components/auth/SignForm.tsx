import React, { ReactNode } from "react";

import { Link, useNavigate } from "react-router-dom";
import Button from "../shared/Button";
import SocialMedia from "./SocialMedia";

interface SignFormProps {
  title: string;
  description: string;
  children: ReactNode;
  type: "login" | "register";
}

const SignForm: React.FC<SignFormProps> = ({
  title,
  description,
  children,
  type,
}) => {
  const isLogin = type === "login";
  const linkText = isLogin
    ? "Don't have an account?"
    : "Already have an account?";
  return (
    <div className="text-center flex flex-col border border-black flex-1">
      <div className="border border-black w-fit h-fit mx-auto rounded-full p-1 mt-5">
        <img
          src="/assets/mask-dark.svg"
          alt="Login or Register Icon"
          className="border rounded-full border-black"
        />
      </div>
      <h3 className="text-5xl uppercase mt-2">{title}</h3>
      <p className="text-xs mt-3 font-bold font-baskervville">{description}</p>

      {children}

      <span className="my-4">OR</span>
      <SocialMedia />

      <div className="my-4 flex-1">
        <p>
          {linkText}{" "}
          <Link
            to={isLogin ? "/register" : "/login"}
            className="border-b-black border-b uppercase">
            {isLogin ? "Register" : "LOGIN"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignForm;
