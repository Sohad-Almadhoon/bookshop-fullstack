import React from "react";
import CustomInput from "../components/CustomInput";
import Button from "../components/Button";
import SignLayout from "../components/SignLayout";
import SocialMedia from "../components/SocialMedia";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <SignLayout>
      {" "}
      <div>
        <img />
        <h3>create account</h3>
        <p>Create an account to make the most of the platform</p>
        <form>
          <CustomInput placeholder="Enter Your Name" />
          <CustomInput placeholder="Enter Your Email" />
          <CustomInput placeholder="Create A Password" />
          <Button>register</Button>
        </form>
        <SocialMedia />
        <p>
          <span>
            Do you have an account <Link to="">LOGIN</Link>
          </span>
        </p>
      </div>
    </SignLayout>
  );
};

export default Register;
