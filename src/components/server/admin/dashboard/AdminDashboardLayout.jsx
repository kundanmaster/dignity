"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, usePathname } from "next/navigation"; // Added usePathname
import { menuData } from "constants/menuData"; // Adjusted import path
import { MdArrowForwardIos } from "react-icons/md";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/auth/authContext";

const useDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  return { dropdownOpen, toggleDropdown, setDropdownOpen };
};

const AdminDashboardLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState({});
  const [selectedPage, setSelectedPage] = useState("");
  const { dropdownOpen, toggleDropdown, setDropdownOpen } = useDropdown();
  const dropdownRef = useRef(null); // Ref for the dropdown
  const { user, handleLogout, token } = useAuth();

  useEffect(() => {
    const updateMenuState = () => {
      const currentPath = pathname;
      menuData.forEach((menuItem) => {
        if (menuItem.href === currentPath) {
          setSelectedPage(menuItem.label);
        }
        if (menuItem.submenu) {
          menuItem.submenu.forEach((submenuItem) => {
            if (submenuItem.href === currentPath) {
              setSelectedPage(submenuItem.sublabel);
              setOpenSubmenu((prev) => ({
                ...prev,
                [menuItem.label]: true,
              }));
            }
            if (submenuItem.submenuNested) {
              submenuItem.submenuNested.forEach((nestedItem) => {
                if (nestedItem.href === currentPath) {
                  setSelectedPage(nestedItem.sublabel);
                  setOpenSubmenu((prev) => ({
                    ...prev,
                    [menuItem.label]: true,
                    [submenuItem.sublabel]: true,
                  }));
                }
              });
            }
          });
        }
      });
    };

    updateMenuState();
  }, [pathname, router, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close dropdown if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, setDropdownOpen]);

  const onLogout = () => {
    handleLogout(router);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const toggleSubmenu = (menuLabel) => {
    setOpenSubmenu((prev) => ({
      ...prev,
      [menuLabel]: !prev[menuLabel],
    }));
  };

  return (
    <div className="bg-gray-50 h-screen flex flex-col">
      <nav className="backdrop-blur-xl bg-white p-4 flex items-center justify-between shadow-md">
        <div className="justify-between text-black text-2xl font-bold">
          <Link href="/admin/dashboard">
            <div className="text-2xl font-bold flex items-center text-goldlight">
              <Image
                src="/images/pages/mainlogoo.png"
                alt="alt"
                width={100}
                height={100}
              />
              <span>DIGNITY MEDICAL TRAINING</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2"
            >
              <Image
                src="/assets/icons8-user-100.png"
                alt="User Icon"
                className="w-12 h-12 rounded-full shadow-md hover:shadow-lg shadow-goldlight border-4"
                width={40}
                height={50}
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg dropdown border-2 border-gray-100 p-2 z-50">
                <span className="block w-full text-left px-4 py-2 text-gray-800 hover:text-white hover:bg-primarygold rounded-lg">
                  <span className="text-goldlight">Hi!</span>{" "}
                  {user ? user.firstname.toUpperCase() : "User"}
                </span>
                <Link href="/admin/dashboard">
                  <p className="block px-4 py-2 text-gray-800 hover:text-white hover:bg-primarygold rounded-lg">
                    Dashboard
                  </p>
                </Link>
                <Link href="/">
                  <p className="block px-4 py-2 text-gray-800 hover:text-white hover:bg-primarygold rounded-lg">
                    Home
                  </p>
                </Link>
                {/* <Link href="">
                  <p className="block px-4 py-2 text-gray-800 hover:text-white hover:bg-primarygold rounded-lg">
                    Profile
                  </p>
                </Link> */}
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:text-white hover:bg-primarygold rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex flex-grow">
        <div
          className={`shadow-gray-500/50 backdrop-blur-md bg-white shadow-md rounded-md m-4 w-64 p-4 lg:relative fixed inset-y-0 left-0 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <nav className="text-sm">
            <div className="flex items-center justify-center mb-4">
              <Image
                src="/assets/icons8-user-100.png"
                alt="User Icon"
                width={30}
                height={30}
                className="w-12 h-12 rounded-full shadow-md hover:shadow-lg shadow-goldlight border-4"
              />
            </div>
            <div className="flex items-center justify-center mb-4 text-center">
              <span className="block w-full px-4 py-2 text-gray-800 hover:bg-gray-200">
                {user ? user.firstname : "User"}
                <br />
                {user ? user.email : "User"}
              </span>
            </div>
            {menuData.map((menuItem, index) => (
              <div key={index}>
                {menuItem.submenu ? (
                  <>
                    <button
                      className={`flex items-center justify-between py-4 mt-2 px-4 w-full ${
                        openSubmenu[menuItem.label]
                          ? " text-goldlight rounded-lg"
                          : "hover:bg-black/10 hover:text-primarygold hover:rounded-lg"
                      }`}
                      onClick={() => toggleSubmenu(menuItem.label)}
                    >
                      <span className="flex justify-center items-center gap-2">
                        <span>{menuItem.icon}</span>
                        {menuItem.label}
                      </span>
                      <MdArrowForwardIos
                        className={`ml-2 ${
                          openSubmenu[menuItem.label]
                            ? "transform rotate-90"
                            : ""
                        } transition-transform`}
                      />
                    </button>
                    <div
                      className={`${
                        openSubmenu[menuItem.label]
                          ? "flex flex-col justify-between"
                          : "hidden"
                      } pl-4`}
                    >
                      {menuItem.submenu.map((submenuItem, subIndex) => (
                        <div key={subIndex}>
                          {submenuItem.submenuNested ? (
                            <>
                              <button
                                className={`flex items-center justify-between py-2 px-4 w-full ${
                                  openSubmenu[submenuItem.sublabel]
                                    ? " text-goldlight rounded-lg"
                                    : "hover:bg-gray-200 hover:text-primarygold hover:rounded-lg"
                                }`}
                                onClick={() =>
                                  toggleSubmenu(submenuItem.sublabel)
                                }
                              >
                                {submenuItem.sublabel}
                                <MdArrowForwardIos
                                  className={` items-center justify-between  ${
                                    openSubmenu[submenuItem.sublabel]
                                      ? "transform rotate-90"
                                      : ""
                                  } transition-transform`}
                                />
                              </button>
                              <div
                                className={`${
                                  openSubmenu[submenuItem.sublabel]
                                    ? "block"
                                    : "hidden"
                                } `}
                              >
                                {submenuItem.submenuNested.map(
                                  (nestedItem, nestedIndex) => (
                                    <Link
                                      href={nestedItem.href}
                                      key={nestedIndex}
                                    >
                                      <button
                                        className={`ml-2 text-left py-2 px-4 w-full ${
                                          selectedPage === nestedItem.sublabel
                                            ? "text-goldlight rounded-lg"
                                            : "hover:bg-gray-200 hover:text-primarygold hover:rounded-lg"
                                        }`}
                                        onClick={() =>
                                          setSelectedPage(nestedItem.sublabel)
                                        }
                                      >
                                        {nestedItem.sublabel}
                                      </button>
                                    </Link>
                                  )
                                )}
                              </div>
                            </>
                          ) : (
                            <Link href={submenuItem.href}>
                              <button
                                className={`ml-2 text-left py-4 px-4 w-full ${
                                  selectedPage === submenuItem.sublabel
                                    ? "bg-black/5 text-goldlight rounded-lg"
                                    : "hover:bg-gray-200 hover:text-primarygold hover:rounded-lg"
                                }`}
                                onClick={() =>
                                  setSelectedPage(submenuItem.sublabel)
                                }
                              >
                                {submenuItem.sublabel}
                              </button>
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link href={menuItem.href}>
                    <button
                      className={`flex items-center justify-between py-4 my-2 px-4 w-full ${
                        selectedPage === menuItem.label
                          ? "bg-gray-200 text-goldlight rounded-lg"
                          : "hover:bg-gray-200 hover:text-primarygold hover:rounded-lg"
                      }`}
                      onClick={() => {
                        router.push(menuItem.href);
                        setSelectedPage(menuItem.label);
                      }}
                    >
                      <span className="flex justify-center items-center gap-2">
                        <span>{menuItem.icon}</span>
                        {menuItem.label}
                      </span>
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
        <main className="flex-grow p-4 overflow-y-auto">
          <div className="bg-white p-4 mb-4 shadow-md rounded-md">
            {selectedPage}
          </div>

          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
  