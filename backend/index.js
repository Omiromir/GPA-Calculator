require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const port = process.env.PORT || 3000

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resourceRoutes = require("./routes/GPARoutes");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/gpa", resourceRoutes);

const createAdmin = async () => {
    try {
        const adminEmail = "admin@gmail.com";
        const adminPassword = "admin"; // Здесь меняешь пароль
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminPassword, salt); // Хэшируем новый пароль
            const admin = new User({
                username: "Admin",
                email: adminEmail,
                password: hashedPassword,
                isAdmin: true,
            });
            await admin.save();
            console.log("Admin created successfully with email:", adminEmail);
        } else{
            console.log("Admin already exists with email:", adminEmail);
        }
    } catch (error) {
        console.error("Error creating admin:", error);
    }
};

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Connected to MongoDB");
        await createAdmin(); // Ensure admin user is created
        app.listen(port, () => console.log("Server running on port "+port));
    })
    .catch((error) => console.error("MongoDB connection error:", error));