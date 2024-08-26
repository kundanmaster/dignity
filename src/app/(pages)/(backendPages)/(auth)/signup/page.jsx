"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AuthLayout from "@/components/client/common/Authlayout";
import Link from "next/link";
import { z } from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "@/components/client/common/Logo";
import { toast } from "sonner";

const signUpSchema = z
  .object({
    firstname: z.string().min(2, "First name must be at least 2 characters"),
    lastname: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    role: z.enum(["user", "instructor"], {
      required_error: "User type is required",
    }),
    identityProof: z.string().optional(),
    specialtyAreas: z.string().optional(),
    degrees: z.string().optional(),
    teachingPhilosophy: z.string().optional(),
    onlineTeachingExperience: z.enum(["yes", "no"]).optional(),
    verified: z.enum(["verified", "unverified"]).optional(),
  })
  .refine(
    (data) =>
      data.role === "user" ||
      (data.identityProof && data.specialtyAreas && data.degrees && data.onlineTeachingExperience),
    {
      message:
        "Instructor details are required for the instructor role",
      path: ["role"], // Adjust the path if you want to show the error at a specific field
    }
  );

export default function SignUp() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [identityProof, setIdentityProof] = useState("");
  const [specialtyAreas, setSpecialtyAreas] = useState("");
  const [degrees, setDegrees] = useState("");
  const [teachingPhilosophy, setTeachingPhilosophy] = useState("");
  const [onlineTeachingExperience, setOnlineTeachingExperience] =
    useState("no");
  const [verified, setVerified] = useState("unverified");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  // Option arrays (customize these as needed)
  const identityProofOptions = [
    { value: "", label: "Select an Identity Proof" },
    { value: "passport", label: "Passport" },
    { value: "driver_license", label: "Driver's License" },
    { value: "id_card", label: "ID Card" },
    // Add more options as needed
  ];

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
        role,
        identityProof,
        specialtyAreas,
        degrees,
        teachingPhilosophy,
        onlineTeachingExperience,
        verified,
      });
  
      if (!result.success) {
        setError(result.error.errors[0].message);
        setLoading(false);
        return;
      }
  
      const response = await axios.post("/apiRoutes/signup", {
        firstname,
        lastname,
        email,
        password,
        role,
        identityProof: role === "instructor" ? identityProof : undefined,
        specialtyAreas: role === "instructor" ? specialtyAreas : undefined,
        degrees: role === "instructor" ? degrees : undefined,
        teachingPhilosophy: role === "instructor" ? teachingPhilosophy : undefined,
        onlineTeachingExperience: role === "instructor" ? onlineTeachingExperience : undefined,
        verified: role === "instructor" ? verified : undefined,
      });
  
      if (response.data.success) {
        toast.success("Signup successful");
        router.push("/signin");
      } else {
        setError(response.data.error || "Sign-up failed");
      }
    } catch (error) {
      setError(error.response.data.error || "Sign-up failed");
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
              Sign up for an account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSignUp}>
              {/* Role Selection */}
              <div className="flex justify-evenly items-center">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="user"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={(e) => setRole(e.target.value)}
                    className="mr-2"
                  />
                  <label
                    htmlFor="user"
                    className="text-gray-700 dark:text-white"
                  >
                    User
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="instructor"
                    name="role"
                    value="instructor"
                    checked={role === "instructor"}
                    onChange={(e) => setRole(e.target.value)}
                    className="mr-2"
                  />
                  <label
                    htmlFor="instructor"
                    className="text-gray-700 dark:text-white"
                  >
                    Instructor
                  </label>
                </div>
              </div>

              {/* Basic Fields */}
              <div>
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="First Name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value.trim())}
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
                  onChange={(e) => setLastname(e.target.value.trim())}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
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
                  onChange={(e) => setPassword(e.target.value.trim())}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>

              {/* Conditional Fields for Instructors */}
              {role === "instructor" && (
                <>
                  <div>
                    <select
                      id="identityProof"
                      name="identityProof"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={identityProof}
                      onChange={(e) => setIdentityProof(e.target.value)}
                    >
                      {identityProofOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <textarea
                      name="specialtyAreas"
                      id="specialtyAreas"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Specialty Areas"
                      value={specialtyAreas}
                      onChange={(e) => setSpecialtyAreas(e.target.value)}
                    ></textarea>
                  </div>

                  <div>
                    <textarea
                      name="degrees"
                      id="degrees"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Degrees"
                      value={degrees}
                      onChange={(e) => setDegrees(e.target.value)}
                    ></textarea>
                  </div>
                  <div>
                    <textarea
                      name="teachingPhilosophy"
                      id="teachingPhilosophy"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Teaching Philosophy"
                      value={teachingPhilosophy}
                      onChange={(e) => setTeachingPhilosophy(e.target.value)}
                    ></textarea>
                  </div>
                  <div>
                    <p className="text-gray-700 dark:text-white">
                      Do you have online teaching experience?
                    </p>
                    <div className="flex items-center mt-2 justify-center">
                      <input
                        type="radio"
                        id="onlineTeachingExperienceYes"
                        name="onlineTeachingExperience"
                        value="yes"
                        checked={onlineTeachingExperience === "yes"}
                        onChange={(e) =>
                          setOnlineTeachingExperience(e.target.value)
                        }
                        className="mr-2"
                      />
                      <label
                        htmlFor="onlineTeachingExperienceYes"
                        className="mr-4 text-gray-700 dark:text-white"
                      >
                        Yes
                      </label>
                      <input
                        type="radio"
                        id="onlineTeachingExperienceNo"
                        name="onlineTeachingExperience"
                        value="no"
                        checked={onlineTeachingExperience === "no"}
                        onChange={(e) =>
                          setOnlineTeachingExperience(e.target.value)
                        }
                        className="mr-2"
                      />
                      <label
                        htmlFor="onlineTeachingExperienceNo"
                        className="text-gray-700 dark:text-white"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </>
              )}

              {error && <p className="text-red-500">{error}</p>}
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
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </AuthLayout>
  );
}
