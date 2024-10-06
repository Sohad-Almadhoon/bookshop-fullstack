import CustomInput from "../components/CustomInput";
import SignLayout from "../components/SignLayout";
import SignForm from "../components/SignForm";

const Register = () => {
  return (
    <SignLayout>
      <SignForm
        title="Create Account"
        description="Create an account to make the most of the platform"
        type="register">
        <CustomInput placeholder="Enter Your Name" aria-label="Name" />
        <CustomInput placeholder="Enter Your Email" aria-label="Email" />
        <CustomInput placeholder="Create A Password" aria-label="Password" />
      </SignForm>
    </SignLayout>
  );
};

export default Register;
