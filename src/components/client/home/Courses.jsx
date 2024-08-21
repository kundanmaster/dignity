"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "./courseCard";
import CartPanel from "../common/CartPanel"; // Adjust the import path based on your project structure
import { toast } from "sonner";
import { saveCartToLocalStorage, loadCartFromLocalStorage, addToCart, removeFromCart, calculateTotalPrice } from "@/utils/cartUtils";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/apiRoutes/addcourse");
      if (response.data.success && Array.isArray(response.data.courses)) {
        setCourses(response.data.courses);
      } else {
        console.error("Failed to fetch courses:", response.data.error);
        toast.error("Failed to fetch courses.");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("An error occurred while fetching courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    const loadedCartItems = loadCartFromLocalStorage();
    console.log(loadedCartItems);
    
    setCartItems(Array.isArray(loadedCartItems) ? loadedCartItems : []);
  }, []);

  const handleAddToCart = (course) => {
    if (!Array.isArray(cartItems)) {
      toast.error("Cart is not loaded properly.");
      return;
    }

    const courseExists = cartItems.some((item) => item.id === course.id);
    if (courseExists) {
      toast.error("Course already in cart.");
      return;
    }

    const updatedCart = [...cartItems, course];
    console.log(updatedCart);
    
    setCartItems(updatedCart);
    saveCartToLocalStorage(updatedCart);
    setIsCartOpen(true);
  };

  const handleEnroll = (course) => {
    router.push(`user/enrollpage/${course.id}`);
  };

  const handleRemoveFromCart = (courseId) => {
    const updatedCart = cartItems.filter((item) => item.id !== courseId);
    console.log(updatedCart);
    
    setCartItems(updatedCart);
    saveCartToLocalStorage(updatedCart);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  const totalPrice = calculateTotalPrice(cartItems);

  return (
    <section
      className="mx-0 md:mx-2 lg:mx-36 my-10 md:my-2 px-5 sm:px-10 md:px-16 xl:px-32 py-10 lg:py-10 bg-zinc-100 transition-colors duration-300 ease-in-out hover:bg-zinc-200 rounded-3xl shadow-2xl"
      id="allcourse"
    >
      <h3 className="text-3xl font-bold text-goldlight text-center pb-5 sm:pb-10">
        Our Trending Courses
      </h3>
      {loading ? (
        <div className="text-center text-white">
          <ClipLoader size={20} color={"#1D3563 "} />
        </div>
      ) : Array.isArray(courses) && courses.length > 0 ? (
        <div className="flex overflow-x-auto space-x-10 snap-center p-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onAddToCart={handleAddToCart}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-black">No courses available. Please check back later.</p>
      )}
      {isCartOpen && (
        <>
          {/* Dark Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
            onClick={handleCloseCart}
            aria-hidden="true"
          />
          {/* Cart Panel */}
          <CartPanel
            cartItems={cartItems}
            onClose={handleCloseCart}
            onRemoveFromCart={handleRemoveFromCart}
            totalPrice={totalPrice}
          />
        </>
      )}
    </section>
  );
};

export default Courses;
