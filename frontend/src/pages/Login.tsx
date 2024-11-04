import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/shared/CustomInput";
import SignForm from "../components/auth/SignForm";
import Button from "../components/shared/Button";

// Define the type for the form inputs
interface LoginFormInputs {
  name: string;
  email: string;
  rememberMe: boolean;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();

  // onSubmit handler type-safe for LoginFormInputs
  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    navigate("/welcome");
  };

  return (
    <SignForm
      title="welcome back"
      description="Login to make the most of the platform"
      type="login">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mx-auto mt-5 flex-1 w-full max-w-sm">
        {/* Name Input */}
        <CustomInput
          placeholder="Enter Your Name"
          {...register("name", { required: "Name is required" })}
          className="mt-4"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        {/* Email Input */}
        <CustomInput
          placeholder="Enter Your Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Enter a valid email address",
            },
          })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        {/* Remember Me Checkbox  */}
        <div className="flex justify-between text-sm">
          <label className="flex items-center">
            <CustomInput
              type="checkbox"
              {...register("rememberMe")}
              className="custom-checkbox"
            />
            <span className="ml-1">Remember Me</span>
          </label>
          <p>Forget Password?</p>
        </div>

        {/* Login Button */}
        <Button type="submit">Login</Button>
      </form>
    </SignForm>
  );
};

export default Login;
