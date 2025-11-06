import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.Api";
import { toast } from "react-toastify";
import { setAuthStatus, setCredentials } from "../features/authSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* Login Form Handler*/
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginUser(data);
      console.log(res);
      dispatch(setCredentials({ user: res.user, isAuthenticated: true }));
      dispatch(setAuthStatus("succeeded"));
      toast.success(`Welcome back ${res.user.name || "user"}`);
      reset();
      navigate("/");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMsg);
      dispatch(setAuthStatus("failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background-dark px-4">
      <div className="flex flex-col items-stretch justify-start rounded-xl shadow-lg bg-card p-6 sm:p-8 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-text-light text-2xl font-bold leading-tight tracking-[-0.015em]">
            Welcome Back
          </h1>
          <p className="text-text-secondary-dark text-base mt-2">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* Email */}
          <label className="flex flex-col w-full">
            <p className="text-text-light text-sm font-medium pb-2">
              Email Address
            </p>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
              type="email"
              placeholder="Enter your email"
              className="flex w-full rounded-lg text-text-light focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-card h-12 placeholder:text-text-secondary-dark px-4 text-base"
            />
            {errors.email && (
              <span className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </span>
            )}
          </label>

          {/* Password */}
          <label className="flex flex-col w-full">
            <p className="text-text-light text-sm font-medium pb-2">Password</p>
            <div className="relative flex w-full items-stretch">
              <input
                {...register("password", { required: "Password is required" })}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="flex w-full rounded-lg text-text-light focus:outline-0 focus:ring-2 focus:ring-primary border-none bg-card h-12 placeholder:text-text-secondary-dark px-4 text-base"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-text-secondary-dark hover:text-text-light"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </span>
            )}
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-primary h-12 px-6 text-base font-semibold text-white hover:bg-[color-mix(in_oklab,var(--color-primary)_90%,black)] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark"
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
