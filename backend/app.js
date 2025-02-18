require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");


const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resourceRoutes = require("./routes/GPARoutes");

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

mongoose.connect(process.env.MONGO_URI)
    .then(() => app.listen(3000, () => console.log("Server running on port 3000")))
    .catch(err => console.error(err));
