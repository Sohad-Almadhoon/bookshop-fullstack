import React from "react";
import CustomInput from "../components/CustomInput";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import SignLayout from "../components/SignLayout";
import SocialMedia from "../components/SocialMedia";

const Login = () => {
  return (
    <SignLayout>
      <div>
        <img />
        <h3>welcome back</h3>
        <p>Login to make the most of the platform</p>
        <form>
          <CustomInput placeholder="Enter Your Name" />
          <CustomInput placeholder="Enter Your Email" />
          <div>
            <input type="checkbox" />
            <span>Forget Password?</span>
          </div>
          <Button>login</Button>
        </form>
        <span>OR</span>
        <SocialMedia />
        <p>
          <span>
            Don't you have an account <Link to="">RIGESTER</Link>
          </span>
        </p>
      </div>
    </SignLayout>
  );
};

export default Login;
