"use client";
import { useAuth } from "@/hooks/auth/authContext";
import React, { useState } from "react";
const ProfilePageForm = () => {
  const { user } = useAuth();
  const id = user?.id;
  const [formData, setFormData] = useState({
    firstName: user?.firstname || "",
    lastName: user?.lastname || "",
    biography: user?.biography || "",
    twitterLink: "",
    facebookLink: "",
    linkedinLink: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, such as sending data to an API
    console.log("Form submitted:", formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white shadow-md rounded-md"
    >
      <div className="flex flex-row space-x-6">
        <div className="flex-grow">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="flex-grow">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>
      <div>
        <label htmlFor="biography" className="form-label">
          Biography
        </label>
        <textarea
          id="biography"
          name="biography"
          value={formData.biography}
          onChange={handleChange}
          className="form-input"
          rows="4"
        />
      </div>
      {/* <div>
                <label htmlFor="twitterLink" className="form-label">Twitter Link</label>
                <input
                    type="text"
                    id="twitterLink"
                    name="twitterLink"
                    value={formData.twitterLink}
                    onChange={handleChange}
                    className="form-input"
                />
            </div>
            <div>
                <label htmlFor="facebookLink" className="form-label">Facebook Link</label>
                <input
                    type="text"
                    id="facebookLink"
                    name="facebookLink"
                    value={formData.facebookLink}
                    onChange={handleChange}
                    className="form-input"
                />
            </div>
            <div>
                <label htmlFor="linkedinLink" className="form-label">LinkedIn Link</label>
                <input
                    type="text"
                    id="linkedinLink"
                    name="linkedinLink"
                    value={formData.linkedinLink}
                    onChange={handleChange}
                    className="form-input"
                />
            </div> */}
      <div>
        <button type="submit" className="btn-design-1">
          Save Profile
        </button>
      </div>
    </form>
  );
};

export default ProfilePageForm;
