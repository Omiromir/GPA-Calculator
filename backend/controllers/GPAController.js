const GPA = require("../models/Semester");
const mongoose = require("mongoose");

// @desc   Create a new empty GPA record for logged-in user
// @route  POST /gpa
// @access Private
const createGPA = async (req, res) => {
  try {
    let semesters;
    if (req.body) {
      semesters = req.body;
    }
    const newGPA = new GPA({
      user: req.user._id,
      semesters: semesters || [],
    });
    await newGPA.save();
    res.status(201).json(newGPA);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Get logged-in user's GPA record
// @route  GET /gpa
// @access Private
const getGPA = async (req, res) => {
  try {
    const userId = req.user._id;
    let gpa = await GPA.findOne({ user: userId });
    if (!gpa) {
      gpa = new GPA({ user: userId,});
      await gpa.save();
    }
    res.json(gpa);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Update logged-in user's  GPA record
// @route  PUT /gpa/:id
// @access Private
const updateGPA = async (req, res) => {
  try {
    const { semesters } = req.body;
    const userId = req.user._id;
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

// @desc   Delete logged-in user's GPA record
// @route  DELETE /gpa/:id
// @access Private
const deleteGPA = async (req, res) => {
  try {
    const userId = req.user._id;
    const gpa = await GPA.findOneAndDelete({ user: userId });
    if (!gpa) {
      return res.status(404).json({ message: "GPA record not found" });
    }
    res.json({ message: "GPA record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Add a new empty semester to logged-in user's gpa record
// @route  POST /gpa/semesters
// @access Private
const addSemester = async (req, res) => {
  try {
    console.log("Attempting to add new semester for user:", req.user ? req.user._id : "no user");
    const userId = req.user._id;
    let gpa = await GPA.findOne({ user: userId });

    if (!gpa) {
      console.log("No GPA record found, creating new one...");
      gpa = new GPA({ user: userId,});
    }

    console.log("Current semesters:", gpa.semesters);

    const existingIds = gpa.semesters.map(s => s.id);
    const nextSemesterId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    console.log("Next semester ID:", nextSemesterId);

    gpa.semesters.push({
      id: nextSemesterId,
      displayOrder: gpa.semesters.length+1
    });
    await gpa.save();
    console.log("Semester added successfully, new GPA:", gpa);

    res.json({ message: "Semester added successfully", semesterId: nextSemesterId,displayOrder:gpa.semesters.length+1, gpa });
  } catch (error) {
    console.error("Error adding semester:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Add a new course to semester in logged-in user's record
// @route  POST /:semesterId/courses
// @access Private
const addCourseToSemester = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const { name, grade, credits } = req.body;
    const userId = req.user._id;

    let gpa = await GPA.findOne({ user: userId });
    if (!gpa) {
      gpa = new GPA({ user: userId, semesters: [] });
      await gpa.save();
    }

    const semester = gpa.semesters.find(s => s.id === parseInt(semesterId));
    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    // Create new course object
    const newCourse = { _id: new mongoose.Types.ObjectId(), name, grade, credits };

    // Push new course with ID
    semester.courses.push(newCourse);
    await gpa.save();

    res.json({ message: "Course added successfully", course: newCourse }); // Return the new course
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Update a course in a semester in logged-in user's record
// @route  PUT /:semesterId/courses/:courseId
// @access Private
const updateCourseInSemester = async (req, res) => {
  try {
    const { semesterId, courseId } = req.params;
    const { name, grade, credits } = req.body;
    console.log(req.body);

    const userId = req.user._id;
    const gpa = await GPA.findOne({ user: userId });
    if (!gpa) {
      return res.status(404).json({ message: "GPA record not found" });
    }

    const semester = gpa.semesters.find(s => s.id === parseInt(semesterId));
    if (!semester) {
      return res.status(404).json({ message: "Semester not found" });
    }

    const course = semester.courses[courseId];
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (name !== undefined) course.name = name;
    if (grade !== undefined) course.grade = grade;
    if (credits !== undefined) course.credits = credits;

    await gpa.save();

    res.json({ message: "Course updated successfully", gpa });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc   Delete course from logged-in user's semester
// @route  DELETE /:semesterId/courses/:courseId
// @access Private
const removeCourseFromSemester = async (req, res) => {
  try {
    const { semesterId, courseId } = req.params;

    const userId = req.user._id;
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

// @desc   Delete logged-in user's semester with all of its courses
// @route  DELETE /semesters/:semesterId
// @access Private
const deleteSemester = async (req, res) => {
  try {
    const { semesterId } = req.params;
    const userId = req.user._id;

    const gpa = await GPA.findOne({ user: userId });
    if (!gpa) {
      return res.status(404).json({ message: "GPA record not found" });
    }

    // Find index of semester to remove
    const semesterIndex = gpa.semesters.findIndex(s => s.id === parseInt(semesterId));
    if (semesterIndex === -1) {
      return res.status(404).json({ message: "Semester not found" });
    }

    // Remove the semester
    gpa.semesters.splice(semesterIndex, 1);

    // Reorder remaining semesters (reassign displayOrder)
    gpa.semesters.forEach((semester, index) => {
      semester.displayOrder = index + 1; // Ensure sequential numbering
    });

    await gpa.save();

    res.json({ message: "Semester deleted successfully", semesters: gpa.semesters });
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
  deleteSemester,
};