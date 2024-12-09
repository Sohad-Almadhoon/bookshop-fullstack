import { useForm, SubmitHandler } from "react-hook-form";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/shared/CustomInput";
import SignForm from "../components/auth/SignForm";
import Button from "../components/shared/Button";
import newRequest from "../utils/newRequest";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface LoginFormInputs {
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

  const mutation = useMutation<AxiosResponse<any>, Error, LoginFormInputs>({
    mutationFn: (data: LoginFormInputs) =>
      newRequest.post("/api/auth/login", data),
    onSuccess: (response) => {
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      toast.success("Logged In Successfully");
      navigate("/welcome");
    },
    onError: (error: any) => {
      if (error.response) {
        if (error.response.status === 404) {
          toast.error("Incorrect email or password.");
        } else {
          const message = error.response.data.error || "An error occurred.";
          toast.error(message);
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    mutation.mutate(data);
  };

  return (
    <SignForm
      title="welcome back"
      description="Login to make the most of the platform"
      type="login">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 mx-auto mt-5 flex-1 w-full max-w-sm">
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
        {errors.email && (
          <p className="text-red-500">
            {errors.email.message || mutation.error?.message}
          </p>
        )}
        <CustomInput
          type="password"
          placeholder="Enter Your Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 5,
              message: mutation.error?.message || "Password is required",
            },
          })}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <div className="flex justify-between text-sm">
          <label className="flex items-center">
            <CustomInput type="checkbox" className="custom-checkbox" />
            <span className="ml-1">Remember Me</span>
          </label>
          <p>Forget Password?</p>
        </div>

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Logging In..." : "Login"}
        </Button>
      </form>
    </SignForm>
  );
};

export default Login;
