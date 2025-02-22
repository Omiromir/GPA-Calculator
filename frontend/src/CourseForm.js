import { GPAResult } from "./GPAResult";
import { CourseList } from "./CourseList";
import { useState, useEffect } from "react";
import { addCourse, getSemesters, updateCourse, deleteCourse, deleteSemester } from "./services/api";
import trashCan from "./trash.svg";

export function CourseForm({ semesterNum, onSemesterChange }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getSemesters();
        const semester = res.data?.semesters.find((s) => s.id === semesterNum);
        if (semester) setCourses(semester.courses);
        else setCourses([]);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, [semesterNum]);

  const handleCoursesChange = async (updatedCourses, index) => { 
    try {
      if (updatedCourses.length > courses.length) {
        setCourses(updatedCourses);
        const newCourse = { name: "", grade: "", credits: 0 };
        await addCourse(semesterNum, newCourse);
      } else if (updatedCourses.length < courses.length) {
        const deletedCourse = courses[index];
        setCourses(updatedCourses);
        const courseId = deletedCourse.id || deletedCourse._id;
        if (courseId) {
          await deleteCourse(semesterNum, courseId);
        } else {
          console.warn("Tried to delete a course without an ID:", deletedCourse);
        }
      } else {
        setCourses(updatedCourses);
        const updatedCourse = updatedCourses[index];
        await updateCourse(semesterNum, index, updatedCourse);
      }
    } catch (err) {
      console.error("Error updating course:", err);
      alert("Failed to update course. Please try again.");
    }
  };

  const handleDeleteSemester = async () => {
    try {
      await deleteSemester(semesterNum);
      setCourses([]);
      onSemesterChange({ deleted: true, semesterNum });
    } catch (err) {
      console.error("Error deleting semester:", err);
      alert("Failed to delete semester. Please try again.");
    }
  };

  return (
    <form className="course-form">
      <div className="semester-header">
        <label htmlFor={`semester-${semesterNum}`}>Semester {semesterNum}</label>
        <button 
          type="button" 
          onClick={handleDeleteSemester} 
          className="delete-semester-btn"
        >
          <img src={trashCan} alt="Delete Semester" />
          Delete Semester
        </button>
      </div>
      <div className="course_gpa-list">
        <CourseList onCoursesChange={handleCoursesChange} courses={courses} />
        <GPAResult semesterNum={semesterNum} courses={courses} onSemesterChange={onSemesterChange} />
      </div>
    </form>
  );
}