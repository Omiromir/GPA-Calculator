import { useState } from "react";
import trashCan from "./trash.svg";

export function CourseItem({ onChange, course, onDelete }) {
  // Local state to control deletion animation
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    // Wait for the animation to complete before calling onDelete
    setTimeout(() => {
      onDelete();
    }, 600);
  };

  return (
    <li className={`course-item ${isDeleting ? "deleting" : ""}`}>
      <input
        type="text"
        placeholder="Course Name"
        value={course.name??""}
        onChange={(e) => onChange("name", e.target.value)}
      />
      <select
        name="grade"
        id="grade"
        value={course.grade??""}
        onChange={(e) => onChange("grade", e.target.value)}
      >
        <option value="">Grade</option>
        <option value="4.0">A</option>
        <option value="3.67">A-</option>
        <option value="3.33">B+</option>
        <option value="3">B</option>
        <option value="2.67">B-</option>
        <option value="2.33">C+</option>
        <option value="2">C</option>
        <option value="1.67">C-</option>
        <option value="1.33">D+</option>
        <option value="1">D</option>
        <option value="0.5">D-</option>
        <option value="0">F</option>
      </select>
        <input
            type="number"
            placeholder="Credits"
            value={course.credits ?? 0}
            min="0" // Prevents negative values in browsers that support it
            onChange={(e) => {
                const value = Math.max(0, Number(e.target.value)); // Ensures value is never negative
                onChange("credits", value);
            }}
            onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") e.preventDefault(); // Prevents typing "-" or "e"
            }}
        />
      <button type="button" className="delete-btn" onClick={handleDelete}>
        <img src={trashCan} alt="Delete" />
      </button>
    </li>
  );
}
