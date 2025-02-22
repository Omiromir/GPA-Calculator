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

router.post("/", authMiddleware, createGPA);

router.get("/", authMiddleware, getGPA);

router.put("/:id", authMiddleware, updateGPA);

router.delete("/:id", authMiddleware, deleteGPA);

router.post("/:semesterId/courses", authMiddleware, addCourseToSemester);

router.put("/:semesterId/courses/:courseId", authMiddleware, updateCourseInSemester);

router.delete("/:semesterId/courses/:courseId", authMiddleware, removeCourseFromSemester);

router.post("/semesters", authMiddleware, addSemester);

router.delete("/semesters/:semesterId", authMiddleware, deleteSemester);

module.exports = router;