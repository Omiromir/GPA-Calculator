import { GPAResult } from "./GPAResult";
import { CourseList } from "./CourseList";
import { useState, useEffect } from "react";
import {addCourse, getSemesters, updateCourse} from "./services/api";

export function CourseForm({ semesterNum, onSemesterChange }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getSemesters();
        const semester = res.data?.semesters.find((s) => s.id === semesterNum);
        if (semester) setCourses(semester.courses);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, [semesterNum]);

  const handleCoursesChange = async (updatedCourses,index) => {
    try {
      if (updatedCourses.length > courses.length) {
        setCourses(updatedCourses);
        const newCourse = {"name": "", "grade": "", "credits": 0}
        await addCourse(semesterNum, newCourse);
      }
      if (updatedCourses.length === courses.length) {
        setCourses(updatedCourses);
        const updatedCourse = updatedCourses[index]
        await updateCourse(semesterNum, index, updatedCourse);
      }
    }catch (err) {
      console.error("Error updating course:", err);
      alert("Failed to update course. Please try again.");
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