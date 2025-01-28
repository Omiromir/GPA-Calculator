import React, { useEffect } from "react";

export function GPAResult({ semesterNum, courses, onSemesterChange }) {
  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach(({ grade, credits }) => {
    const gradeValue = parseFloat(grade);
    const creditValue = parseFloat(credits);

    if (!isNaN(gradeValue) && !isNaN(creditValue)) {
      totalPoints += gradeValue * creditValue;
      totalCredits += creditValue;
    }
  });

  const semesterGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  useEffect(() => {
    onSemesterChange({totalPoints, totalCredits });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses])

  return (
    <div className="Gpa-result">
      Semester {semesterNum} GPA: <span>{semesterGPA}</span>
    </div>
  );
}

