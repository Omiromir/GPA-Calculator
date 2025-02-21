const GPA = require("../models/Semester");
const mongoose = require("mongoose");

// Create a new GPA record for a specific user
const createGPA = async (req, res) => {
  try {
    let semesters;
    if (req.body) {
      semesters = req.body;
    }
    const newGPA = new GPA({
      user: req.user._id, // Используем req.user._id, так как пользователь уже авторизован
      semesters: semesters || [],
    });
    await newGPA.save();
    res.status(201).json(newGPA);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Retrieve the GPA record for the logged-in user
const getGPA = async (req, res) => {
  try {
    const userId = req.user._id; // Используем req.user._id
    let gpa = await GPA.findOne({ user: userId });
    if (!gpa) {
      gpa = new GPA({ user: userId, semesters: [] });
      await gpa.save();
    }
    res.json(gpa);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a specific GPA record for the logged-in user
const updateGPA = async (req, res) => {
  try {
    const { semesters } = req.body;
    const userId = req.user._id; // Используем req.user._id
    let gpa = await GPA.findOne({ user: userId });
    if (!gpa) {
      return res.status(404).json({ message: "GPA record not found" });
    }
    if (semesters) {
      gpa.semesters = semesters;
    }
    await gpa.save();
    res.json({ message: "GPA updated successfully", gpa });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a specific GPA record for the logged-in user
const deleteGPA = async (req, res) => {
  try {
    const userId = req.user._id; // Используем req.user._id
    const gpa = await GPA.findOneAndDelete({ user: userId });
    if (!gpa) {
      return res.status(404).json({ message: "GPA record not found" });
    }
    res.json({ message: "GPA record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a new semester to the user's GPA record
const addSemester = async (req, res) => {
  try {
    console.log("Attempting to add new semester for user:", req.user ? req.user._id : "no user");
    const userId = req.user._id; // Используем req.user._id, так как пользователь авторизован
    let gpa = await GPA.findOne({ user: userId });

    if (!gpa) {
      console.log("No GPA record found, creating new one...");
      gpa = new GPA({ user: userId, semesters: [] });
      await gpa.save();
    }

    console.log("Current semesters:", gpa.semesters);

    let nextSemesterId = 1;
    if (gpa.semesters.length > 0) {
      const semesterIds = gpa.semesters.map(s => s.id).filter(id => typeof id === 'number' && !isNaN(id));
      if (semesterIds.length > 0) {
        nextSemesterId = Math.max(...semesterIds) + 1;
      } else {
        console.warn("No valid semester IDs found, starting from 1.");
      }
    }

    console.log("Next semester ID:", nextSemesterId);

    gpa.semesters.push({ id: nextSemesterId, courses: [] });
    await gpa.save();
    console.log("Semester added successfully, new GPA:", gpa);

    res.json({ message: "Semester added successfully", semesterId: nextSemesterId, gpa });
  } catch (error) {
    console.error("Error adding semester:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a new course to a specific semester for the user's GPA
const addCourseToSemester = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const { name, grade, credits } = req.body;

    if (!name || !grade || credits === undefined) {
      return res.status(400).json({ message: "All course fields are required" });
    }

    const userId = req.user._id; // Используем req.user._id
    let gpa = await GPA.findOne({ user: userId });
    if (!gpa) {
      gpa = new GPA({ user: userId, semesters: [] });
      await gpa.save();
    }

    const semester = gpa.semesters.find(s => s.id === parseInt(semesterId));
    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    semester.courses.push({ name, grade, credits });
    await gpa.save();

    res.json({ message: "Course added successfully", gpa });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing course in a semester for the user's GPA
const updateCourseInSemester = async (req, res) => {
  try {
    const { semesterId, courseId } = req.params;
    const { name, grade, credits } = req.body;

    const userId = req.user._id; // Используем req.user._id
    const gpa = await GPA.findOne({ user: userId });
    if (!gpa) {
      return res.status(404).json({ message: "GPA record not found" });
    }

    const semester = gpa.semesters.find(s => s.id === parseInt(semesterId));
    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    const course = semester.courses.id(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (name) course.name = name;
    if (grade) course.grade = grade;
    if (credits !== undefined) course.credits = credits;

    await gpa.save();

    res.json({ message: "Course updated successfully", gpa });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove a course from a semester for the user's GPA
const removeCourseFromSemester = async (req, res) => {
  try {
    const { semesterId, courseId } = req.params;

    const userId = req.user._id; // Используем req.user._id
    const gpa = await GPA.findOne({ user: userId });
    if (!gpa) {
      return res.status(404).json({ message: "GPA record not found" });
    }

    const semester = gpa.semesters.find(s => s.id === parseInt(semesterId));
    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    const courseIndex = semester.courses.findIndex(c => c._id.toString() === courseId);
    if (courseIndex === -1) {
      return res.status(404).json({ message: "Course not found" });
    }

    semester.courses.splice(courseIndex, 1);
    await gpa.save();

    res.json({ message: "Course removed successfully", gpa });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addSemester,
  createGPA,
  getGPA,
  updateGPA,
  deleteGPA,
  addCourseToSemester,
  updateCourseInSemester,
  removeCourseFromSemester,
};