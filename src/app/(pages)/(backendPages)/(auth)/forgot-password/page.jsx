"use client";
import { useState } from "react";
import Image from "next/image";
import { z } from "zod";
import { useAuth } from "@/hooks/auth/authContext";
import AuthLayout from "@/components/client/common/Authlayout";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Logo from "@/components/client/common/Logo";

// Define the validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
});

const ForgotPassword = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleForgotPassword = async (data) => {
    setError(null);
    setLoading(true);

    try {
      // Replace this with your actual forgot password logic
      console.log('Email for password reset:', data.email);
      // For example: await signIn(data.email);
    } catch (err) {
      setError("Failed to process the request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <section>
        <div className="flex flex-col items-center justify-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <div>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
              Forgot Password
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(handleForgotPassword)}>
              <div>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                className="btn-design-1 w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p>Processing...</p>
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Remember your password?{" "}
                <Link href="/signin" className="font-medium text-goldlight hover:underline dark:text-primary-500">
                  Sign in
                </Link>
              </p>
            </form>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </section>
    </AuthLayout>
  );
};

export default ForgotPassword;
