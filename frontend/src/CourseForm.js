// CourseForm.js
import { GPAResult } from "./GPAResult";
import { CourseList } from "./CourseList";
import { useState, useEffect } from "react";
import { addCourse, getSemesters, updateCourse, deleteCourse } from "./services/api";

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

  const handleCoursesChange = async (updatedCourses, index) => { 
    try {
      if (updatedCourses.length > courses.length) {
        // Adding a new course:
        setCourses(updatedCourses);
        // Create a new course object for the API (or use the one returned by API, if applicable)
        const newCourse = { name: "", grade: "", credits: 0 };
        await addCourse(semesterNum, newCourse);
      } else if (updatedCourses.length < courses.length) {
        // Deleting a course:
        // Identify which course was removed. Here, we use the index passed.
        const deletedCourse = courses[index];
        // Update UI regardless...
        setCourses(updatedCourses);
        const courseId = deletedCourse.id || deletedCourse._id;
        if (courseId) {
          setCourses(updatedCourses);
          await deleteCourse(semesterNum, courseId);
        } else {
          console.warn("Tried to delete a course without an ID:", deletedCourse);
        }
      } else {
        // Updating an existing course:
        setCourses(updatedCourses);
        const updatedCourse = updatedCourses[index];
        await updateCourse(semesterNum, index, updatedCourse);
      }
    } catch (err) {
      console.error("Error updating course:", err);
      alert("Failed to update course. Please try again.");
    }
  };

  return (
    <form className="course-form">
      <label htmlFor={`semester-${semesterNum}`}>Semester {semesterNum}</label>
      <div className="course_gpa-list">
        <CourseList onCoursesChange={handleCoursesChange} courses={courses} />
        <GPAResult semesterNum={semesterNum} courses={courses} onSemesterChange={onSemesterChange} />
      </div>
    </form>
  );
}
