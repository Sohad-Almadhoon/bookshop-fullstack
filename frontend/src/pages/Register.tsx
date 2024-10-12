import CustomInput from "../components/shared/CustomInput";
import SignForm from "../components/auth/SignForm";
import SignLayout from "../components/auth/SignLayout";

const Register = () => {
  return (
      <SignForm
        title="Create Account"
        description="Create an account to make the most of the platform"
        type="register">
        <CustomInput placeholder="Enter Your Name" aria-label="Name" />
        <CustomInput placeholder="Enter Your Email" aria-label="Email" />
        <CustomInput placeholder="Create A Password" aria-label="Password" />
      </SignForm>
  );
};

export default Register;
