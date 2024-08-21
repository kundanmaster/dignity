"use client";
import React, { useState } from 'react';
import Footer from "../../components/client/common/Footer";
import Header from "../../components/client/common/Header";
import axios from "axios";
const Page = () => {
  const [formdata, Setformdata] = useState({
    name: "",
    email: "",
    message: "",
  });
  const handleChange = (e) => {
    Setformdata({ ...formdata, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/sendEmail", formdata, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      if (response.ok) {
        console.log("Email sent successfully");
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  return (
    <>
      <Header />
      <section className="min-h-fit px-5 sm:px-10 md:px-16 xl:px-20 py-10 md:py-20 xl:py-40 bg-gradient-to-r from-[#f1dd7c29] to-[#eee]">
        <form className="sm:w-1/3 md:1/2 mx-auto bg-white p-10 rounded-xl shadow-sm" onSubmit={handleSubmit}>
        <h1 className="text-3xl text-center text-goldlight pb-10 font-bold">
          Contact Us
        </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="name" className="text-lg font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="border border-gray-300 p-2 rounded-md"
                pattern="^[a-zA-Z\s]+$"
                title="Please enter valid name"
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <label htmlFor="email" className="text-lg font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border border-gray-300 p-2 rounded-md"
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 mt-4">
            <label htmlFor="message" className="text-lg font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="border border-gray-300 p-2 rounded-md"
              onChange={handleChange}
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="text-white bg-primarygold hover:bg-goldlight hover:text-white py-2 px-8 rounded-md mt-5"
            >
              Submit
            </button>
          </div>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default Page;
