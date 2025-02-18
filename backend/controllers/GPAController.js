const GPA = require("../models/Semester");

// Create a new GPA record
const createGPA = async (req, res) => {
    try {
        let semesters;
        // Expecting semesters data in the request body (optional)
        if (req.body) {
             semesters = req.body;
        }
        const newGPA = new GPA({
            user: req.user._id, // Set by authMiddleware
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
        const gpa = await GPA.find({ user: req.user._id });
        res.json(gpa);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a specific GPA record
const updateGPA = async (req, res) => {
    try {
        const { semesters } = req.body;
        // Find the GPA record that belongs to the logged-in user
        let gpa = await GPA.findOne({ _id: req.params.id, user: req.user._id });
        if (!gpa) {
            return res.status(404).json({ message: "GPA record not found" });
        }
        // Update the semesters if provided
        if (semesters) {
            gpa.semesters = semesters;
        }
        await gpa.save();
        res.json({ message: "GPA updated successfully", gpa });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a specific GPA record
const deleteGPA = async (req, res) => {
    try {
        const gpa = await GPA.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });
        if (!gpa) {
            return res.status(404).json({ message: "GPA record not found" });
        }
        res.json({ message: "GPA record deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// Add a new course to a specific semester
const addCourseToSemester = async (req, res) => {
    try {
        const { semesterId } = req.params;
        const { name, grade, credits } = req.body;

        if (!name || !grade || credits === undefined) {
            return res.status(400).json({ message: "All course fields are required" });
        }

        const gpa = await GPA.findOne({ user: req.user._id });
        if (!gpa) {
            return res.status(404).json({ message: "GPA record not found" });
        }

        const semester = gpa.semesters.find(s => s.id === parseInt(semesterId));
        if (!semester) {
            return res.status(404).json({ message: "Semester not found" });
        }

        // Add new course
        semester.courses.push({ name, grade, credits });
        await gpa.save();

        res.json({ message: "Course added successfully", gpa });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update an existing course in a semester
const updateCourseInSemester = async (req, res) => {
    try {
        const { semesterId, courseId } = req.params;
        const { name, grade, credits } = req.body;

        const gpa = await GPA.findOne({ user: req.user._id });
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

        // Update course details
        if (name) course.name = name;
        if (grade) course.grade = grade;
        if (credits !== undefined) course.credits = credits;

        await gpa.save();

        res.json({ message: "Course updated successfully", gpa });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Remove a course from a semester
const removeCourseFromSemester = async (req, res) => {
    try {
        const { semesterId, courseId } = req.params;

        const gpa = await GPA.findOne({ user: req.user._id });
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

        // Remove course from the array
        semester.courses.splice(courseIndex, 1);
        await gpa.save();

        res.json({ message: "Course removed successfully", gpa });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Add a new semester to the user's GPA record
const addSemester = async (req, res) => {
    try {
        const gpa = await GPA.findOne({ user: req.user._id });

        if (!gpa) {
            return res.status(404).json({ message: "GPA record not found" });
        }

        // Determine the next semester ID (increment based on the number of existing semesters)
        const nextSemesterId = gpa.semesters.length > 0
            ? Math.max(...gpa.semesters.map(s => s.id)) + 1
            : 1;

        // Add new semester
        gpa.semesters.push({ id: nextSemesterId, courses: [] });
        await gpa.save();

        res.json({ message: "Semester added successfully", semesterId: nextSemesterId, gpa });
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
