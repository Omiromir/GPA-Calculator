import { GPAResult } from "./GPAResult";
import { CourseList } from "./CourseList";
import Loader from "./Loader";
import { useState, useEffect } from "react";
import { addCourse, getSemesters, updateCourse, deleteCourse, deleteSemester } from "./services/api";

export function CourseForm({ semesterNum, onSemesterChange, setSemesters }) {
  const [courses, setCourses] = useState([]);
  const [semesterId, setSemesterId] = useState(null); // Store the actual semester ID
  const [loading, setLoading] = useState(true); // Loader state

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await getSemesters();
        const semester = res.data?.semesters.find((s) => s.displayOrder === semesterNum);
        if (semester) {
          setCourses(semester.courses);
          setSemesterId(semester.id); // Store the real ID
        } else {
          setCourses([]);
          setSemesterId(null);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [semesterNum]);

  const handleCoursesChange = async (updatedCourses, index) => {
    if (!semesterId) {
      console.error("Semester ID is missing!");
      return;
    }

    try {
      if (updatedCourses.length > courses.length) {
        let newCourse = { name: "", grade: "", credits: 0 };
        const res = await addCourse(semesterId, newCourse); // Use the real semester ID
        newCourse['_id'] = res.data.course._id;
        updatedCourses[updatedCourses.length - 1] = newCourse;
        setCourses(updatedCourses);
      } else if (updatedCourses.length < courses.length) {
        const deletedCourse = courses[index];
        setCourses(updatedCourses);
        const courseId = deletedCourse._id;
        if (courseId) {
          await deleteCourse(semesterId, courseId); // Use semesterId instead of semesterNum
        } else {
          console.warn("Tried to delete a course without an ID:", deletedCourse);
        }
      } else {
        setCourses(updatedCourses);
        const updatedCourse = updatedCourses[index];
        await updateCourse(semesterId, index, updatedCourse); // Use the real semester ID
      }
    } catch (err) {
      console.error("Error updating course:", err);
      alert("Failed to update course. Please try again.");
    }
  };

  const handleDeleteSemester = async () => {
    // Prevent deletion of semester 1
    if (semesterNum === 1) {
      alert("Semester 1 cannot be deleted!");
      return;
    }
    if (!semesterId) {
      alert("Semester ID is missing!");
      return;
    }

    try {
      await deleteSemester(semesterId); // Use the correct semester ID
      setCourses([]);
      onSemesterChange({ deleted: true, semesterNum });

      // Refresh semesters
      const updatedRes = await getSemesters();
      setSemesters(updatedRes.data.semesters.map((s) => s.displayOrder));
    } catch (err) {
      console.error("Error deleting semester:", err);
      alert("Failed to delete semester. Please try again.");
    }
  };

  return (
    <form className="course-form">
      <div className="semester-header">
        <label htmlFor={`semester-${semesterNum}`}>Semester {semesterNum}</label>
        {/* Conditionally render the delete button only if semesterNum is not 1 */}
        {semesterNum !== 1 && (
          <button
            type="button"
            onClick={handleDeleteSemester}
            className="delete-semester-btn"
          >
            &times;
          </button>
        )}
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="course_gpa-list">
          <CourseList onCoursesChange={handleCoursesChange} courses={courses} />
          <GPAResult
            semesterNum={semesterNum}
            courses={courses}
            onSemesterChange={onSemesterChange}
          />
        </div>
      )}
    </form>
  );
}
