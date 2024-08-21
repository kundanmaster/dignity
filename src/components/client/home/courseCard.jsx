'use client';
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useCart } from "../../../hooks/cart/cartContext"; 
import image from "../../../../public/images/pages/course-1.webp";

// Function to strip HTML tags
const stripHtmlTags = (html) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
};

const CourseCard = ({ course, onAddToCart, onEnroll }) => {
  return (
    <div className="relative flex flex-col mt-6 text-gray-700 bg-white shadow-goldlight shadow-md bg-clip-border rounded-xl w-80 sm:w-96 group">
      <div className="relative h-56 mx-4 -mt-6 overflow-hidden text-white shadow-lg bg-clip-border rounded-xl bg-blue-gray-500 shadow-goldlight">
        <Image
          src={image}
          width="500"
          height="500"
          alt="cpr"
          className="rounded-md w-full mx-auto"
        />
      </div>
      <div className="flex flex-col justify-between flex-grow p-6">
        <div>
          <h5 className="block mb-2 text-xl antialiased font-bold leading-snug tracking-normal text-goldlight">
            {course.course_title}
          </h5>
          <p className="font-sans text-base antialiased font-light leading-relaxed text-inherit line-clamp-4">
            {stripHtmlTags(course.description)}
          </p>
        </div>
        <div className="flex justify-between items-center py-4">
          <p className="font-semibold text-nowrap pr-4">
            Price : <span className="text-goldlight font-bold">${course.course_price}</span>
          </p>
          <button onClick={() => onEnroll(course)} className="text-white font-bold py-2 px-4 mr-4 rounded-md bg-goldlight hover:bg-primarygold hover:text-white transition duration-100">
            Enroll
          </button>
          <div
            role="button"
            onClick={() => onAddToCart(course)}
            className="text-white hover:text-white font-bold py-2 px-4 rounded-md bg-goldlight hover:bg-primarygold transition duration-100"
          >
            <FontAwesomeIcon
              icon={faCartShopping}
              className="text-lg group-hover:translate-x-3 transition duration-500 group-hover:-rotate-[10deg]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
