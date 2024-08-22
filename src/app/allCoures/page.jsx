"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import { courses } from "./courses";
import Header from "@/components/client/common/Header";

export default function CourseList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filteredCourses = courses.filter((course) =>
    course.course_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setSearchTerm("");
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSelectedCourse(null);
  };

  return (
    <>
      <Header/>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-8 relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for a course..."
            className="pl-10 p-3 border border-gray-300 rounded-lg w-full focus:border-blue-500"
          />
          {searchTerm && filteredCourses.length > 0 && (
            <div className="border border-gray-300 rounded-lg mt-2 bg-white shadow-lg max-h-60 overflow-y-auto">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelectCourse(course)}
                >
                  {course.course_title}
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedCourse ? (
          <CourseCard course={selectedCourse} />
        ) : (
          filteredCourses.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))
        )}
      </div>
    </>
  );
}

function CourseCard({ course }) {
  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <div className="flex p-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-shrink-0">
        <Image
          src="/images/pages/course-1.webp" // Ensure this path is correct
          alt={course.course_title}
          width={100}
          height={100}
          className="w-24 h-24 object-cover rounded-lg"
        />
      </div>
      <div className="ml-4 flex-grow">
        <h2 className="text-xl font-semibold">{course.course_title}</h2>
        <p className="text-gray-600 mt-1">{stripHtmlTags(course.description)}</p>
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <span className="mx-2">•</span>
          <span>{course.hours} hours</span>
          <span className="mx-2">•</span>
          <span>{course.lectures} lectures</span>
          <span className="mx-2">•</span>
          <span>{course.selected_programming_level}</span>
        </div>
        <div className="mt-2 text-lg font-bold text-green-600">
          ${course.course_price}
          {course.discounted_price && (
            <span className="text-sm line-through text-gray-500 ml-2">
              ${course.discounted_price}
            </span>
          )}
        </div>
        {course.has_discount && (
          <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
            Bestseller
          </span>
        )}
      </div>
    </div>
  );
}
