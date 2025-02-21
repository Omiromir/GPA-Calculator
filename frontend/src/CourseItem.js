export function CourseItem({ onChange, course }) {
  return (
    <li className="course-item">
      <input type="text" placeholder="Course Name" value={course.name} onChange={(e) => onChange("name", e.target.value)} />
      <select name="grade" id="grade" value={course.grade} onChange={(e) => onChange("grade", e.target.value)}>
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
      <input type="number" placeholder="Credits" value={course.credits} onChange={(e) => onChange("credits", e.target.value)} />
    </li>
  );
}