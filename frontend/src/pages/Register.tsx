import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import CustomInput from "../components/shared/CustomInput";
import SignForm from "../components/auth/SignForm";
import Button from "../components/shared/Button";
import { useFormStore } from "../hooks/useFormStore";

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>();
  const { updateFormData } = useFormStore();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
    updateFormData(data);
    toast.success("One more step: tell us what you are into");
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
          autoComplete="name"
          {...register("name", {
            required: "Name is required",
            maxLength: { value: 60, message: "Name is too long" },
          })}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

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
          placeholder="Create A Password"
          aria-label="Password"
          type="password"
          autoComplete="new-password"
          {...register("password", {
            required: "Password is required",
            // Mirrors the server rule, so the user finds out here and not
            // after filling in the questionnaire.
            minLength: { value: 8, message: "Password must be at least 8 characters" },
            maxLength: { value: 72, message: "Password must be at most 72 characters" },
          })}
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        <Button type="submit">Register</Button>
      </form>
    </SignForm>
  );
};

export default Register;
