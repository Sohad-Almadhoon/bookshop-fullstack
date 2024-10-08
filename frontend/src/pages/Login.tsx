import { Link } from "react-router-dom";
import CustomInput from "../components/shared/CustomInput";
import SignForm from "../components/auth/SignForm";
import SignLayout from "../components/auth/SignLayout";

const Login = () => {
  return (
    <SignLayout>
      <SignForm
        title="welcome back"
        description="Login to make the most of the platform"
        type="login">
        <CustomInput placeholder="Enter Your Name" className="mt-4" />
        <CustomInput placeholder="Enter Your Email" />
        <div className="flex justify-between text-sm">
          <div>
            <input type="checkbox" id="check" />
            <label htmlFor="check" className="ml-1">
              Remeber Me
            </label>
          </div>
          <Link to="#">Forget Password?</Link>
        </div>
      </SignForm>
    </SignLayout>
  );
};

export default Login;
