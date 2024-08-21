"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDropdown } from "../../../helpers/GeneralHelper";
import { useAuth } from "@/hooks/auth/authContext";
import CartPanel from "./CartPanel";
import {
  loadCartFromLocalStorage,
  calculateTotalPrice,
  removeFromCart,
} from "@/utils/cartUtils";
import {
  FaPhoneAlt,
  FaShoppingCart,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { IoMdBusiness } from "react-icons/io"; // Import the required icon
import { FaUserCircle } from "react-icons/fa";
import { BiSearchAlt } from "react-icons/bi";

const Header = ({ token }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const { dropdownOpen, toggleDropdown } = useDropdown();
  const { handleLogout, user } = useAuth();

  useEffect(() => {
    const items = loadCartFromLocalStorage() || [];
    console.log(items);
    
    setCartItems(items);
    setCartCount(items.length || 0);
  }, [isCartOpen]);
  console.log("Header count cart",cartCount);
  
  const onLogout = () => {
    handleLogout(router);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleRemoveFromCart = (itemToRemove) => {
    console.log("Removing item:", itemToRemove);
    removeFromCart(itemToRemove);
    const updatedItems = loadCartFromLocalStorage() || [];
    setCartItems(updatedItems);
    setCartCount(updatedItems.length || 0);
  };

  const Sessionrole = () => {
    if (user) {
      if (user.role === "admin") {
        return "Admin";
      } else if (user.role === "instructor") {
        return "Instructor";
      } else if (user.role === "user") {
        return "User";
      }
    }
    return "Guest";
  };

  const role = Sessionrole();
  const handleNewAgency =() =>{
    alert("Not yet implemented!")
  }
  return (
    <>
      <div className="text-center py-4 bg-goldlight text-white">
        <div className="flex justify-center items-center space-x-8">
          <div className="flex items-center space-x-2 hover:bg-primarygold p-2 rounded text-white">
            <Link href="/" onClick={handleNewAgency}>
              {" "}
              <h4>NEW AGENCY SIGNUP</h4>
            </Link>
          </div>
          <a href="tel:+1-800-123-4567">
            <div className="flex items-center space-x-2 text-white">
              <FaPhoneAlt color="#F27B21" className="" />
              <span>+1-800-123-4567</span>
            </div>
          </a>
          <a href="tel:+1-800-765-4321">
            <div className="flex items-center space-x-2 text-white">
              <FaPhoneAlt color="#F27B21" />
              <span>+1-800-765-4321</span>
            </div>
          </a>
          {!user ? (
            <>
              <a
                href="/signin"
                className="flex items-center space-x-2 hover:bg-primarygold p-2 rounded text-white"
              >
                <FaSignInAlt color="#F27B21" />
                <span>Login</span>
              </a>
              <a
                href="/signup"
                className="flex items-center space-x-2 hover:bg-primarygold p-2 rounded text-white"
              >
                <FaUserPlus color="#F27B21" />
                <span>Register</span>
              </a>
            </>
          ) : (
            <a
              href={`/${role.toLowerCase()}/dashboard`}
              className="flex items-center space-x-2 hover:bg-primarygold p-2 rounded text-white"
            >
              <FaUserPlus />
              <span>My Account</span>
            </a>
          )}
        </div>
      </div>

      <header className=" bg-white text-black font-medium sticky top-0 z-40 shadow-sm shadow-black/20">
        <div className="py-4 px-5 flex items-center justify-between bg-[#ececec]">
          <div className="flex items-center space-x-4">
            <Link href="/">
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
          <div className="flex items-center space-x-6">
            <nav className="relative flex items-center space-x-6 font-semibold text-base">
              <div className="group relative">
                <a
                  href="#allcourse"
                  className="text-black hover:text-goldlight"
                >
                  ALL COURSES
                </a>
                <div className="absolute left-0 text-nowrap hidden group-hover:block bg-white shadow-lg text-black">
                  <a
                    href="#online"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Online Self-Placed
                  </a>
                  <a
                    href="#online"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Zoom Classes
                  </a>
                  <a
                    href="#online"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Classroom Courses
                  </a>
                </div>
              </div>
              <div className="group relative">
                <a href="#" className="text-black hover:text-goldlight">
                  ABOUT
                </a>
                <div className="absolute text-nowrap left-0 hidden group-hover:block bg-white shadow-lg text-black">
                  <a
                    href="#aboutus"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Leadership
                  </a>
                  <a
                    href="#Instructors"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    instructors
                  </a>
                  <a
                    href="#testimonials"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Testimonials
                  </a>
                </div>
              </div>
              <div className="group relative">
                <a href="#" className="text-black hover:text-goldlight">
                  LOCATION
                </a>
                <div className="absolute left-0 text-nowrap hidden group-hover:block bg-white shadow-lg text-black">
                  <a href="#" className="block px-2 py-2 hover:bg-gray-100">
                    Arizona
                  </a>
                  {/* <a href="#" className="block px-2 py-2 hover:bg-gray-100">
                    Offsite
                  </a> */}
                </div>
              </div>
              <Link
                href="/contact-us"
                className={`${
                  user ? "hidden" : ""
                } animate-text text-black hover:text-goldlight`}
              >
                CONTACT US
              </Link>
              <a href="#faq" className="text-black hover:text-goldlight">
                FAQ
              </a>
              <a href="#" className="text-black hover:text-goldlight">
                CONSULTING
              </a>
              <a href="#" className="text-black hover:text-goldlight">
                CAREER
              </a>
              <div className="relative flex items-center">
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search"
                  className="w-64 pl-4 pr-10 py-2 rounded-full text-sm border border-gray-300 focus:outline-none focus:border-primarygold bg-[#d9e2d6]"
                />

                {/* Search Icon */}
                <BiSearchAlt className="absolute right-3 text-gray-500" />
              </div>
              <div className="flex">
                <div>
                  {token ? (
                    <div className="relative">
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
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg dropdown border-2 border-gray-100 p-2 z-40">
                          <span className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-primarygold rounded-lg hover:text-white">
                            <span className="text-goldlight">Hi!</span>{" "}
                            {user ? user.firstname.toUpperCase() : "User"}
                          </span>
                          {role !== "Guest" ? (
                            <>
                              {user.role !== "user" && (
                                <Link href={`/${role.toLowerCase()}/dashboard`}>
                                  <p className="block px-4 py-2 text-gray-800 hover:bg-primarygold rounded-lg hover:text-white">
                                    Dashboard
                                  </p>
                                </Link>
                              )}
                              {user.role === "user" && (
                                <Link
                                  href="/user/courses"
                                  className="animate-text"
                                >
                                  <p className="block px-4 py-2 text-gray-800 hover:bg-primarygold rounded-lg hover:text-white">
                                    My Courses
                                  </p>
                                </Link>
                              )}
                              <Link href="">
                                <p className="block px-4 py-2 text-gray-800 hover:bg-primarygold rounded-lg hover:text-white">
                                  Profile
                                </p>
                              </Link>
                              <button
                                onClick={onLogout}
                                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-primarygold rounded-lg hover:text-white"
                              >
                                Logout
                              </button>
                            </>
                          ) : (
                            <>
                              <Link href="/signin">
                                <p className="block px-4 py-2 text-gray-800 hover:bg-primarygold rounded-lg hover:text-white">
                                  Signin
                                </p>
                              </Link>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link href="/signin" className={`animate-text`}>
                      <FaUserCircle size={30} />
                    </Link>
                  )}
                </div>
                <div className="self-center">
                  <button onClick={toggleCart} className="px-2 py-2">
                    <FontAwesomeIcon
                      icon={faCartShopping}
                      className="text-lg"
                    />
                    {cartCount > 0 && (
                      <span className="absolute top-0 right-0 bg-primarygold text-white text-xs rounded-full px-2 py-1">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  {isCartOpen && (
                    <>
                      {/* Dark Overlay */}
                      <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
                        onClick={toggleCart}
                        aria-hidden="true"
                      />
                      {/* Cart Panel */}
                      <CartPanel
                        cartItems={cartItems}
                        onClose={toggleCart}
                        onRemoveFromCart={handleRemoveFromCart}
                        totalPrice={calculateTotalPrice(cartItems)}
                        className="hover:bg-primarygold"
                      />
                    </>
                  )}
                </div>
                <div>
                  <button
                    onClick={toggleMenu}
                    className="px-2 py-1 text-lg rounded-md md:hidden"
                  >
                    <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
