import axios from 'axios';

const baseURL = '/apiRoutes'; 

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000, // Adjust timeout as needed
  withCredentials: true, // Ensures cookies are sent along with requests
});

// Api for Course starts
export const createCourse = async (courseData) => {
  try {
    const response = await axiosInstance.post('/courses', courseData);
    return response.data;
  } catch (error) {
    throw error.response.data; 
  }
};


export const updateCourse = async (courseId, courseData) => {
  try {
    console.log(courseData);
    const response = await axiosInstance.put(`/addcourse?id=${courseId}`, courseData);
    return response.data;
  } catch (error) {
    throw error.response.data; 
  }
};


export const fetchCourses = async (params = {}) => {
  try {
    const response = await axiosInstance.get('/courses', { params });
    return response.data;
  } catch (error) {
    throw error.response.data; 
  }
};


export const deleteCourse = async (courseId) => {
    try {
      const response = await axiosInstance.delete(`/addcourse?id=${courseId}`);
      return response.data;
    } catch (error) {
      throw error.response.data; 
    }
  };
  // Api for Course Ends -------------

// Api for Manage Admin Starts
export const updateAdmin = async (adminId, formData) => {
  try {
    console.log(formData);
    const response = await axiosInstance.put(`/manage-admin?id=${adminId}`, formData);
    return response;
  } catch (error) {
    throw error.response; 
  }
};

export const deleteAdmin = async (id) => {
  try {
    const response = await axiosInstance.delete(`/manage-admin?id=${id}`);
    return response;
  } catch (error) {
    throw error.response; 
  }
};

  // Api for Manage Admin Ends -------------

  // Api for Manage Student Starts
export const updateStudent = async (studentId, formData) => {
  try {
    console.log(formData);
    const response = await axiosInstance.put(`/manage-student?id=${studentId}`, formData);
    return response;
  } catch (error) {
    throw error.response; 
  }
};

export const deleteStudent = async (id) => {
  try {
    const response = await axiosInstance.delete(`/manage-student?id=${id}`);
    return response;
  } catch (error) {
    throw error.response; 
  }
};

  // Api for Manage Student Ends -------------

  // Api for Manage Student Starts
export const updateInstructor = async (instructorId, formData) => {
  try {
    console.log(formData);
    const response = await axiosInstance.put(`/manage-student?id=${instructorId}`, formData);
    return response;
  } catch (error) {
    throw error.response; 
  }
};

export const deleteInstructor = async (id) => {
  try {
    const response = await axiosInstance.delete(`/manage-instructor?id=${id}`);
    return response;
  } catch (error) {
    throw error.response; 
  }
};

  // Api for Manage Student Ends -------------