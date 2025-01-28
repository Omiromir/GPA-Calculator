import { GPAResult } from "./GPAResult";
import { CourseList } from "./CourseList";
import { useState } from "react";

export function CourseForm({ semesterNum, onSemesterChange }) {
  const [courses, setCourses] = useState([])


  return (
    <form className="course-form">
      <label htmlFor={`semester-${semesterNum}`}>Semester {semesterNum}</label>
      <div className="course_gpa-list">
        <CourseList onCoursesChange={setCourses}/>
        <GPAResult semesterNum={semesterNum} courses={courses} onSemesterChange={onSemesterChange}/>
      </div>
    </form>
  );
}
