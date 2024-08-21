"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import AuthLayout from "@/components/client/common/Authlayout";
import Link from "next/link";
import { z } from "zod";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const signUpSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/(?=.*[0-9])(?=.*[a-zA-Z])/, "Password must contain special character, letters and numbers"),
});

export default function SignUp() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("/apiRoutes/authCheck");
        if (response.data.authenticated) {
          router.push("/");
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
      }
    };

    checkAuth();
  }, [router]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = signUpSchema.safeParse({
        firstname,
        lastname,
        email,
        password,
      });

      if (!result.success) {
        setError(result.error.errors.map((err) => err.message).join(", "));
        setLoading(false);
        return;
      }

      const response = await axios.post("/apiRoutes/signup", {
        firstname,
        lastname,
        email,
        password,
      });

      if (response.data.success) {
        router.push("/signin");
      } else {
        setError("Sign-up failed");
      }
    } catch (err) {
      setError("Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <section>
        <div className="flex flex-col items-center justify-center">
        <Link href="/">
            <div className="flex items-center justify-center">
              <Image
                src="/images/pages/mainlogoo.png"
                alt="alt"
                width={100}
                height={100}
              />
            </div>
            <div className="text-2xl font-bold items-center text-goldlight">
            <span>DIGNITY MEDICAL TRAINING</span>
            </div>
          </Link>
        </div>
        <div>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-black">
              Sign up for an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSignUp}>
              <div>
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="First Name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Last Name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Toggle type based on showPassword state
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? (
                   <FaEye/>
                  ) : (
                    <FaEyeSlash/>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="w-full btn-design-1"
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
                    <p>Signing up...</p>
                  </span>
                ) : (
                  "Sign up"
                )}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="font-medium text-goldlight hover:underline dark:text-primary-500"
                >
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
}
