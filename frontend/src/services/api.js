import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const registerUser = (userData) => api.post("/auth/register", userData);

export const loginUser = (userData) => api.post("/auth/login", userData);

export const getUserProfile = () => api.get("/users/profile");

export const updateUserProfile = (updatedData) => api.put("/users/profile", updatedData);

export const addNewSemester = () => api.post("/gpa/semesters");

export const getSemesters = () => api.get("/gpa");

export const addGPARecord = () => api.post("/gpa");

export const addCourse = (semesterId, courseData) => api.post(`/gpa/${semesterId}/courses`, courseData);

export const updateCourse = (semesterId, courseId, courseData) => api.put(`/gpa/${semesterId}/courses/${courseId}`, courseData);

export const deleteCourse = (semesterId, courseId) => api.delete(`/gpa/${semesterId}/courses/${courseId}`);

export const deleteSemester = (semesterId) => api.delete(`/gpa/semesters/${semesterId}`);

export default api;