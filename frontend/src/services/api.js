import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { "Content-Type": "application/json" },
});

// Automatically include JWT token in every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// AUTHENTICATION ENDPOINTS

// Register a new user
export const registerUser = (userData) => api.post("/auth/register", userData);

// Login and receive JWT token
export const loginUser = (userData) => api.post("/auth/login", userData);

// Get the logged-in user's profile
export const getUserProfile = () => api.get("/users/profile");

// Update the user’s profile
export const updateUserProfile = (updatedData) => api.put("/users/profile", updatedData);

// GPA MANAGEMENT ENDPOINTS

// Add a new semester
export const addNewSemester = () => api.post("/gpa/semesters");

// Get all semesters for the logged-in user
export const getSemesters = () => api.get("/gpa");

//Create a new GPA record
export const addGPARecord=()=>api.post("/gpa")

// Add a course to a specific semester
export const addCourse = (semesterId, courseData) => api.post(`/gpa/${semesterId}/courses`, courseData);

// Update a course inside a semester
export const updateCourse = (semesterId, courseId, courseData) => api.put(`/gpa/${semesterId}/courses/${courseId}`, courseData);

// Delete a course from a semester
export const deleteCourse = (semesterId, courseId) => api.delete(`/gpa/${semesterId}/courses/${courseId}`);

export default api;