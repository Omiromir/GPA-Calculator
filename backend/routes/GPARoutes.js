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
    deleteSemester,
} = require("../controllers/GPAController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new empty GPA record for logged-in user
router.post("/", authMiddleware, createGPA);

// Get logged-in user's GPA record
router.get("/", authMiddleware, getGPA);

// Update logged-in user's  GPA record
router.put("/:id", authMiddleware, updateGPA);

// Delete logged-in user's GPA record
router.delete("/:id", authMiddleware, deleteGPA);

// Add a new course to semester in logged-in user's record
router.post("/:semesterId/courses", authMiddleware, addCourseToSemester);

// Update a course in a semester in logged-in user's record
router.put("/:semesterId/courses/:courseId", authMiddleware, updateCourseInSemester);

// Delete course from logged-in user's semester
router.delete("/:semesterId/courses/:courseId", authMiddleware, removeCourseFromSemester);

// Add a new empty semester to logged-in user's gpa record
router.post("/semesters", authMiddleware, addSemester);

// Delete logged-in user's semester with all of its courses
router.delete("/semesters/:semesterId", authMiddleware, deleteSemester);

module.exports = router;