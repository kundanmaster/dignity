"use client"
import React,{ useState } from 'react'
import AdminDashboardLayout from "@/components/server/admin/dashboard/AdminDashboardLayout";

const Settings = () => {
  const [formData, setFormData] = useState({
    websiteName: '',
    websiteTitle: '',
    websiteKeywords: '',
    websiteDescription: '',
    author: '',
    slogan: '',
    systemEmail: '',
    address: '',
    phone: '',
    youtubeApiKey: '',
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
    console.log(formData);
  };
  return (
    <AdminDashboardLayout>
    <div className=" bg-gray-100 ">
      <div className=" mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">System Settings <span className='text-red-400'>*(In Progress when its done it will be workable)</span></h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website name*</label>
            <input
              type="text"
              name="websiteName"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              value={formData.websiteName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website title*</label>
            <input
              type="text"
              name="websiteTitle"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              value={formData.websiteTitle}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website keywords</label>
            <input
              type="text"
              name="websiteKeywords"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              value={formData.websiteKeywords}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Website description</label>
            <textarea
              name="websiteDescription"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              value={formData.websiteDescription}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input
              type="text"
              name="author"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              value={formData.author}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slogan*</label>
            <input
              type="text"
              name="slogan"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              value={formData.slogan}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">System email*</label>
            <input
              type="email"
              name="systemEmail"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              value={formData.systemEmail}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Youtube API key*</label>
            <input
              type="text"
              name="youtubeApiKey"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-opacity-50"
              value={formData.youtubeApiKey}
              onChange={handleChange}
            />
          </div>
          <div>
            <button
              type="submit"
              className="btn-design-1"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminDashboardLayout>
  )
}

export default Settings