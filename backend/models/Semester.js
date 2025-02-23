// backend/models/Semester.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: { type: String,},  // Course name (e.g., "Mathematics")
    grade: { type: String,}, // Grade (e.g., "A", "B+")
    credits: { type: Number, min: 0 } // Number of credits
});

const semesterSchema = new mongoose.Schema({
    id: { type: Number, required: true}, // Semester id
    displayOrder: { type: Number, required: true }, // Determines UI order
    courses: { type: [courseSchema], default: [] } // Array of courses
});

const GPASchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    semesters: { type: [semesterSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("GPA", GPASchema);