// authContext.js
"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
const AuthContext = createContext();
import Cookies from "js-cookie";
import { toast } from "sonner";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/apiRoutes/userDetails");
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
        // toast.error("Error fetching user details:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [token]);

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/apiRoutes/signin", {
        email,
        password,
      });
      const data = response.data;
      setUser(data.user);
      setToken(data.token);
      if (data.user.role === "admin") {
        toast.success("You have Logged in as Admin");
        router.push("/admin/dashboard");
      } else if(data.user.role === "instructor") {
        toast.success("You have Logged in as Instructor");
        router.push("/instructor/dashboard");
      }else{
        toast.success("Logged in success Welcome");
        router.push("/");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("Something went wrong");
      setError("Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/apiRoutes/signout");
      Cookies.remove("token", {path: '/'});
      setUser(null);
      setToken(null);
      toast.success("Logged out Successfully");
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to sign out:", error);
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, loading, error, token, signIn, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
