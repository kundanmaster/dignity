// src/components/dashboard/AccountForm.jsx
'use client'
import { useAuth } from '@/hooks/auth/authContext';
import { useState } from 'react';

const AccountForm = () => {
  const { user } = useAuth();
  const id = user?.id;
  const [formData, setFormData] = useState({
    email: user?.email || "",
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, such as sending data to an API
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow-md rounded-md">
      <div>
        <label htmlFor="email" className="form-label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div>
        <label htmlFor="currentPassword" className="form-label">Current Password</label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="form-label">New Password</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="form-input"
        />
      </div>
      <div>
        <button type="submit" className="btn-design-1">Save Account Settings</button>
      </div>
    </form>
  );
};

export default AccountForm;
