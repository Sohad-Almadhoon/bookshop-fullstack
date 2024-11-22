import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/shared/CustomInput";
import SignForm from "../components/auth/SignForm";
import Button from "../components/shared/Button";
import newRequest from "../utils/newRequest";

interface LoginFormInputs {
  name: string;
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const navigate = useNavigate();

  // onSubmit handler type-safe for LoginFormInputs
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const res = await newRequest.post("/api/auth/login", data);
      // Save the token to localStorage
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("Failed to submit data", error);
    }

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
        {/* Password Input */}
        <CustomInput
          type="password"
          placeholder="Enter Your Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 5,
              message: "Password must be at least 6 characters long",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        {/* Remember Me Checkbox  */}
        <div className="flex justify-between text-sm">
          <label className="flex items-center">
            <CustomInput type="checkbox" className="custom-checkbox" />
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
