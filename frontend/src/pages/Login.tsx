import { Link } from "react-router-dom";
import CustomInput from "../components/shared/CustomInput";
import SignForm from "../components/auth/SignForm";
import Button from "../components/shared/Button";

const Login = () => {
  return (
    <SignForm
      title="welcome back"
      description="Login to make the most of the platform"
      type="login">
      <CustomInput placeholder="Enter Your Name" className="mt-4" />
      <CustomInput placeholder="Enter Your Email" />
      <div className="flex justify-between text-sm">
        <div>
          <CustomInput
            type="checkbox"
            onChange={() => console.log("hoo")}
          />
          <label className="ml-1">
            Remeber Me
          </label>
        </div>
        <p>Forget Password?</p>
      </div>
      <Button>
        <Link to="/book">Login</Link>
      </Button>
    </SignForm>
  );
};

export default Login;
