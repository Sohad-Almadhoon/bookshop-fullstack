import React, { ReactNode } from "react";
import Button from "./Button";
import SocialMedia from "./SocialMedia";
import { Link } from "react-router-dom";

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
  const buttonText = isLogin ? "LOGIN" : "register";
  const linkText = isLogin
    ? "Don't have an account? Sign Up"
    : "Already have an account? Sign In";

  return (
    <div className="text-center flex flex-col border border-black flex-1">
      <img
        src="/assets/mask-dark.svg"
        alt="Login or Register Icon"
        className="border rounded-full border-black m-auto mt-5"
      />
      <h3 className="text-5xl uppercase mt-2">{title}</h3>
      <p className="text-sm mt-3">{description}</p>

      <form className="flex flex-col gap-5 mx-auto mt-5 flex-1 w-full max-w-sm">
        {children}
        <Button>{buttonText}</Button>
      </form>

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
