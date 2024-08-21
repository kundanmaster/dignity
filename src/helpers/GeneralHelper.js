import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const handleLogout = async (router) => {
  try {
    await axios.post("/apiRoutes/signout");
    Cookies.remove("token");
    toast.success("Logout successfully")
    router.push("/signin");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

export const useDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const closeDropdown = (event) => {
        const dropdownElement = document.querySelector(".dropdown");
        if (
          dropdownOpen &&
          dropdownElement &&
          !dropdownElement.contains(event.target)
        ) {
          setDropdownOpen(false);
        }
      };

      document.addEventListener("mousedown", closeDropdown);

      return () => {
        document.removeEventListener("mousedown", closeDropdown);
      };
    }
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return { dropdownOpen, toggleDropdown };
};

export const useUserDetails = ({ router }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/apiRoutes/userDetails");
        setUser(response.data.user);
        console.log("user-d", response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [router]);

  return { user, setUser };
};
