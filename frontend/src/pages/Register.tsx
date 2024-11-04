import CustomInput from "../components/shared/CustomInput";
import SignForm from "../components/auth/SignForm";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../components/shared/Button";

interface LoginFormInputs {
  name: string;
  email: string;
  rememberMe: boolean;
}
const Register = () => {
  const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<LoginFormInputs>();
const navigate = useNavigate();

// onSubmit handler type-safe for LoginFormInputs
const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
  navigate("/questionnaire");
};
  return (
    <SignForm
      title="Create Account"
      description="Create an account to make the most of the platform"
      type="register">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mx-auto mt-5 flex-1 w-full max-w-sm">
        <CustomInput
          placeholder="Enter Your Name"
          aria-label="Name"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        <CustomInput
          placeholder="Enter Your Email"
          aria-label="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Enter a valid email address",
            },
          })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        <CustomInput
          placeholder="Create A Password"
          aria-label="Password"
          type="password"
        />
        <Button type="submit">Register</Button>
      </form>
    </SignForm>
  );
};

export default Register;
