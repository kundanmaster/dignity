"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const TrainingCenter = () => {
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [popupImage, setPopupImage] = useState(null);

  const instructors = [
    {
      src: "/images/pages/at11.png",
      name: "Instructor 1",
      bio: "Bio for Instructor 1",
    },
    {
      src: "/images/pages/at7.png",
      name: "Instructor 2",
      bio: "Bio for Instructor 2",
    },
    {
      src: "/images/pages/at8.png",
      name: "Instructor 3",
      bio: "Bio for Instructor 3",
    },
    {
      src: "/images/pages/at10.png",
      name: "Instructor 4",
      bio: "Bio for Instructor 4",
    },
    {
      src: "/images/pages/at9.png",
      name: "Instructor 5",
      bio: "Bio for Instructor 5",
    },
    {
      src: "/images/pages/at11.png",
      name: "Instructor 6",
      bio: "Bio for Instructor 6",
    },
  ];

  const handleCardClick = (instructor) => {
    setSelectedInstructor(instructor);
  };

  const handleImageClick = (src) => {
    setPopupImage(src);
  };

  const closeSidebar = () => {
    setSelectedInstructor(null);
  };

  const closePopup = () => {
    setPopupImage(null);
  };

  return (
    <section className="relative bg-[#f8f8f8] py-16 px-4">
      <div className="container mx-auto flex flex-col md:flex-row">
        {/* Content Side */}
        <div className="md:w-1/2 flex flex-col items-center">
          {/* Instructor Cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {instructors.map((instructor, index) => (
              <div
                key={index}
                className="relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
                onClick={() => handleCardClick(instructor)}
              >
                <Image
                  src={instructor.src}
                  alt={instructor.name}
                  width={500}
                  height={300}
                  className="w-full h-48 object-cover cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick(instructor.src);
                  }}
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold">{instructor.name}</h3>
                  <p className="text-gray-600">{instructor.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Content */}
        <div
          className="md:w-1/2 flex flex-col items-center md:items-start md:pl-12"
          id="Instructors"
        >
          <h2 className="text-3xl font-bold mb-4 text-center md:text-left">
            Our Instructors
          </h2>
          <p className="text-gray-700 mb-4 text-center md:text-left">
            Dignity Medical Training educators are skilled in different areas,
            such as behavioral health (BH), emergency medical services (EMS),
            nursing, and special education. We are certain that our educators
            take great pride in teaching them the ideal of lifelong learning.
          </p>
          <ul className="list-disc list-inside text-left mb-6">
            <li>Behavioral Health Professionals</li>
            <li>College Professors</li>
            <li>EMT's</li>
            <li>Medical Assistants</li>
            <li>Nurses</li>
            <li>Seasoned Caregivers</li>
            <li>Special Education Teachers</li>
          </ul>
          <Link href="/instructorPageView">
            <button className="bg-primarygold text-white py-2 px-4 rounded hover:bg-goldlight hover:white transition-colors duration-300">
              View All Instructors
            </button>
          </Link>
        </div>

        {/* Sidebar for detailed view */}
        {selectedInstructor && (
          <div className="fixed inset-0 z-50 bg-white shadow-lg overflow-auto w-full md:w-1/3">
            <button
              className="absolute top-4 right-4 text-xl font-bold"
              onClick={closeSidebar}
            >
              &times;
            </button>
            <div className="p-8">
              <Image
                src={selectedInstructor.src}
                alt={selectedInstructor.name}
                width={400}
                height={400}
                className="w-full h-auto rounded-lg"
              />
              <h2 className="text-2xl font-bold mt-4">
                {selectedInstructor.name}
              </h2>
              <p className="text-gray-700 mt-2">{selectedInstructor.bio}</p>
            </div>
          </div>
        )}

        {/* Popup modal */}
        {popupImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={closePopup}
          >
            <div className="relative">
              <Image
                src={popupImage}
                alt="Instructor"
                width={416}
                height={416}
                className="rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrainingCenter;
