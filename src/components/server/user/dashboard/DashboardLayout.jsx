'use client';
import Header from "@/components/server/common/Header";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { VscSymbolClass } from "react-icons/vsc";
import { LuMessageSquare } from "react-icons/lu";
import { FaCameraRetro, FaHistory, FaLock, FaRegHeart } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import clsx from 'clsx';

const DashboardLayout = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("/apiRoutes/userDetails");
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header />

      {/* Toggle Sidebar Button for Small Screens */}
      <button
        onClick={toggleSidebar}
        className="sm:hidden fixed top-4 left-4 z-50 bg-goldlight text-white p-2 rounded-md shadow-md"
      >
        {isSidebarOpen ? "Hide Menu" : "Show Menu"}
      </button>

      {/* Sidebar and Main Content */}
      <section className="flex">
        {/* Sidebar */}
        {isSidebarOpen && (
          <aside className={clsx(
            "text-md shadow-gray-500/50 backdrop-blur-md bg-white shadow-md rounded-md m-4 p-4 transform shrink-0 transition-transform duration-300 ease-in-out",
            {
              "w-[20rem]": isSidebarOpen,
              "-translate-x-full sm:translate-x-0": !isSidebarOpen, // Hide sidebar on small screens
            }
          )}>
            <div className="flex items-center justify-center mb-4">
              <Image src="/assets/icons8-user-100.png" alt="User Icon" width={50} height={50} className="w-12 h-12 rounded-full shadow-lg" />
            </div>
            <div className={clsx(
              "flex flex-col items-center justify-center mb-4 text-center transition-opacity duration-300 ease-in-out",
              { "opacity-0 sm:opacity-100": !isSidebarOpen } // Hide welcome text when sidebar is closed on small screens
            )}>
              <span className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200">
                {user ? user.firstname : "User"}
                <br />
                {user ? user.email : "email"}
              </span>
            </div>
            <ul className="flex flex-col space-y-4 font-medium">
              <Link href="/user/courses">
                <li className={clsx("aside-li", { "bg-primarygold rounded-md text-goldlight font-bold": pathname === "/user/courses" })}>
                  <VscSymbolClass /> <span>My Courses</span>
                </li>
              </Link>
              <Link href="/user/wishlist">
                <li className={clsx("aside-li", { "bg-primarygold rounded-md text-goldlight font-bold": pathname === "/user/wishlist" })}>
                  <FaRegHeart /><span>Wishlist</span>
                </li>
              </Link>
              <Link href="/user/messages">
                <li className={clsx("aside-li", { "bg-primarygold rounded-md text-goldlight font-bold": pathname === "/user/messages" })}>
                  <LuMessageSquare /><span>Messages</span>
                </li>
              </Link>
              <Link href="/user/purchase-history">
                <li className={clsx("aside-li", { "bg-primarygold rounded-md text-goldlight font-bold": pathname === "/user/purchase-history" })}>
                  <FaHistory /><span>Purchase History</span>
                </li>
              </Link>
              <Link href="/user/profile">
                <li className={clsx("aside-li", { "bg-primarygold rounded-md text-goldlight font-bold": pathname === "/user/profile" })}>
                  <CgProfile /><span>Profile</span>
                </li>
              </Link>
              <Link href="/user/account">
                <li className={clsx("aside-li", { "bg-primarygold rounded-md text-goldlight font-bold": pathname === "/user/account" })}>
                  <FaLock /><span>Account</span>
                </li>
              </Link>
              <Link href="/user/photo">
                <li className={clsx("aside-li", { "bg-primarygold rounded-md text-goldlight font-bold": pathname === "/user/photo" })}>
                  <FaCameraRetro /><span>Photo</span>
                </li>
              </Link>
            </ul>
          </aside>
        )}

        {/* Main Content */}
        <div className={clsx("m-4 flex-grow transition-all duration-300", {
          "w-full": !isSidebarOpen, // Full width when sidebar is hidden
          "": isSidebarOpen, // Adjust width based on sidebar
        })}>
          {children}
        </div>
      </section>
    </>
  );
};

export default DashboardLayout;
