"use client"
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/auth/authContext";
import AuthLayout from "@/components/client/common/Authlayout";
import Link from "next/link";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "@/components/client/common/Logo";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, signIn } = useAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const validationResult = signInSchema.safeParse({ email, password });

    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      await signIn(email, password);
    } catch (err) {
      setError("Failed to sign in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <section>
        <div className="flex flex-col items-center justify-center">
          <Link href="/">
            <Logo/>
          </Link>
        </div>

        <div>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSignIn}>
              <div>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
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
                    <p>Signing in...</p>
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <a
                  href="/signup"
                  className="font-medium text-goldlight hover:underline dark:text-primary-500"
                >
                  Sign up
                </a>
              </p>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                <Link
                  href="/forgot-password"
                  className="font-medium text-goldlight hover:underline dark:text-primary-500"
                >
                  Forgot your password?
                </Link>
              </p>
            </form>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </section>
    </AuthLayout>
  );
}
