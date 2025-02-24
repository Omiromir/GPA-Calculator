const User = require("../models/User");
const GPA = require("../models/Semester");
const bcrypt = require("bcryptjs");

// @desc   Get logged-in user's profile
// @route  GET /users/profile
// @access Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Update logged-in user's profile
// @route  PUT /users/profile
// @access Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Delete user's account and gpa record
// @route  DELETE users/profile
// @access Private
const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ _id: req.user.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const gpa = await GPA.findOneAndDelete({ user: user._id });

    res.json({ message: "Profile deleted successfully", user, gpa });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Change user password
// @route  PUT /users/change-password
// @access Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc   Get all users with their GPA
// @route  GET /users/all
// @access Private (Admin only)
const getAllUsersWithGPA = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const usersWithGPA = await Promise.all(
      users.map(async (user) => {
        const gpa = await GPA.findOne({ user: user._id });
        let cumulativeGPA = 0;
        if (gpa && gpa.semesters.length > 0) {
          const gradeToGPA = {
            "4.0": 4.0,
            "3.67": 3.67,
            "3.33": 3.33,
            "3": 3.0,
            "2.67": 2.67,
            "2.33": 2.33,
            "2": 2.0,
            "1.67": 1.67,
            "1.33": 1.33,
            "1": 1.0,
            "0.5": 0.5,
            "0": 0.0,
          };
          const totalPoints = gpa.semesters.reduce((sum, semester) => {
            return (
              sum +
              semester.courses.reduce((courseSum, course) => {
                const gpaValue = gradeToGPA[course.grade] || 0;
                return courseSum + gpaValue * parseFloat(course.credits);
              }, 0)
            );
          }, 0);
          const totalCredits = gpa.semesters.reduce((sum, semester) => {
            return (
              sum +
              semester.courses.reduce((courseSum, course) => courseSum + parseFloat(course.credits), 0)
            );
          }, 0);
          cumulativeGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
        }
        return { ...user.toObject(), cumulativeGPA };
      })
    );
    res.json(usersWithGPA);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUser,
  getAllUsersWithGPA,
};