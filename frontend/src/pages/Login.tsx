import { useForm, SubmitHandler } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import CustomInput from "../components/shared/CustomInput";
import SignForm from "../components/auth/SignForm";
import Button from "../components/shared/Button";
import newRequest, { getErrorMessage } from "../utils/newRequest";
import { setSession, Session } from "../utils/session";

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
  const location = useLocation();
  const redirectTo = (location.state as { from?: string })?.from || "/welcome";

  const mutation = useMutation<Session, Error, LoginFormInputs>({
    mutationFn: async (data) => {
      const response = await newRequest.post("/api/auth/login", data);
      return response.data as Session;
    },
    onSuccess: (session) => {
      setSession(session);
      toast.success("Logged in successfully");
      navigate(redirectTo, { replace: true });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not log you in."));
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => mutation.mutate(data);

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
          aria-label="Email"
          autoComplete="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
              message: "Enter a valid email address",
            },
          })}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <CustomInput
          type="password"
          placeholder="Enter Your Password"
          aria-label="Password"
          autoComplete="current-password"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

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
