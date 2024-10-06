import CustomInput from "../components/CustomInput";
import SignLayout from "../components/SignLayout";
import SignForm from "../components/SignForm";

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
          <span>Forget Password?</span>
        </div>
      </SignForm>
    </SignLayout>
  );
};

export default Login;
