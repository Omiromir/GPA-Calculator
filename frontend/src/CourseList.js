// CourseList.js
import { CourseItem } from "./CourseItem";

export function CourseList({ onCoursesChange, courses }) {
  // Use the courses prop directly; no local state here.

  function handleCoursesChange(index, field, value) {
    const updatedCourses = courses.map((course, i) =>
      i === index ? { ...course, [field]: value } : course
    );
    onCoursesChange(updatedCourses, index);
  }

  function addCourse(e) {
    e.preventDefault();
    const newCourse = { name: "", grade: "", credits: 0 }; // Ensure unique ID
    const updatedCourses = [...courses, newCourse];
    console.log(updatedCourses);
    onCoursesChange(updatedCourses);
  }

  function handleDeleteCourse(index) {
    const updatedCourses = courses.filter((_, i) => i !== index);
    onCoursesChange(updatedCourses, index);
  }

  return (
    <ul className="course-list">
      {courses.map((course, index) => (
        <CourseItem
          key={course._id} // Use a unique key if available
          course={course}
          onChange={(field, value) => handleCoursesChange(index, field, value)}
          onDelete={() => handleDeleteCourse(index)}
        />
      ))}
      <div>
        <button className="addBtn" onClick={addCourse}>
          <svg width="20px" height="20px" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 7C12.4142 7 12.75 7.33579 12.75 7.75V11.25H16.25C16.6642 11.25 17 11.5858 17 12C17 12.4142 16.6642 12.75 16.25 12.75H12.75V16.25C12.75 16.6642 12.4142 17 12 17C11.5858 17 11.25 16.6642 11.25 16.25V12.75H7.75C7.33579 12.75 7 12.4142 7 12C7 11.5858 7.33579 11.25 7.75 11.25H11.25V7.75C11.25 7.33579 11.5858 7 12 7Z" fill="currentColor" />
            <path d="M3 6.25C3 4.45507 4.45507 3 6.25 3H17.75C19.5449 3 21 4.45507 21 6.25V17.75C21 19.5449 19.5449 21 17.75 21H6.25C4.45507 21 3 19.5449 3 17.75V6.25ZM6.25 4.5C5.2835 4.5 4.5 5.2835 4.5 6.25V17.75C4.5 18.7165 5.2835 19.5 6.25 19.5H17.75C18.7165 19.5 19.5 18.7165 19.5 17.75V6.25C19.5 5.2835 18.7165 4.5 17.75 4.5H6.25Z" fill="currentColor" />
          </svg>
          Add course
        </button>
      </div>
    </ul>
  );
}
