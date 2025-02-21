// backend/routes/GPARoutes.js
const express = require("express");
const {
    createGPA,
    getGPA,
    updateGPA,
    deleteGPA,
    addCourseToSemester,
    updateCourseInSemester,
    removeCourseFromSemester,
    addSemester,
} = require("../controllers/GPAController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new GPA record
router.post("/", authMiddleware, createGPA);

// Get all GPA records for the logged-in user
router.get("/", authMiddleware, getGPA);

// Update a specific GPA record
router.put("/:id", authMiddleware, updateGPA);

// Delete a specific GPA record
router.delete("/:id", authMiddleware, deleteGPA);

// Add a course to a specific semester
router.post("/:semesterId/courses", authMiddleware, addCourseToSemester);

// Update a specific course in a semester
router.put("/:semesterId/courses/:courseId", authMiddleware, updateCourseInSemester);

// Remove a course from a semester
router.delete("/:semesterId/courses/:courseId", authMiddleware, removeCourseFromSemester);

// Add a new semester
router.post("/semesters", authMiddleware, addSemester);

module.exports = router;