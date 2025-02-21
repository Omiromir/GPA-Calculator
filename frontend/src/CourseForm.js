import { GPAResult } from "./GPAResult";
import { CourseList } from "./CourseList";
import { useState, useEffect } from "react";
import axios from "axios";

export function CourseForm({ semesterNum, onSemesterChange }) {
  const [courses, setCourses] = useState([]);

  const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/gpa");
        const semester = res.data?.semesters.find((s) => s.id === semesterNum);
        if (semester) setCourses(semester.courses);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, [semesterNum]);

  const handleCoursesChange = async (updatedCourses) => {
    setCourses(updatedCourses);
    try {
      const lastCourse = updatedCourses[updatedCourses.length - 1];
      await api.post(`/gpa/${semesterNum}/courses`, lastCourse);
    } catch (err) {
      console.error("Error adding course:", err);
      alert("Failed to add course. Please try again.");
    }
  };

  return (
    <form className="course-form">
      <label htmlFor={`semester-${semesterNum}`}>Semester {semesterNum}</label>
      <div className="course_gpa-list">
        <CourseList onCoursesChange={handleCoursesChange} initialCourses={courses} />
        <GPAResult semesterNum={semesterNum} courses={courses} onSemesterChange={onSemesterChange} />
      </div>
    </form>
  );
}