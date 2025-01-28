import { useState, useCallback } from "react";
import GPAChart from "./GPAChart";
import { CourseForm } from "./CourseForm";

function App() {
  const [semesters, setSemesters] = useState([1]);
  const [semesterData, setSemesterData] = useState({})

  function addSemesters() {
    setSemesters((semesters) => [...semesters, semesters.length + 1]);
  }

  const handleSemesterChange = useCallback((semesterNum, stats) => {
    setSemesterData((prev) => ({
      ...prev,
      [semesterNum]: stats,
    }));
  }, []);

  const {totalPoints, totalCredits} = Object.values(semesterData).reduce((totals, {totalPoints, totalCredits}) => {
    return {
      totalPoints: totals.totalPoints + totalPoints,
      totalCredits: totals.totalCredits + totalCredits,
    };
  },
  {totalPoints: 0, totalCredits: 0}
);

const cumulativeGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;


  return (
    <div className="App">
      <h2 className="app-title">
        GPA{" "}
        <span style={{ color: "#00A3FF", fontWeight: "500" }}>Calculator</span>
      </h2>
      <Header />
      <main>
        <div className="course-container">
          {semesters.map((semester, index) => (
            <CourseForm key={index} semesterNum={semester} onSemesterChange={(stats) => handleSemesterChange(semester, stats)}/>
          ))}
          <button onClick={addSemesters} className="addSemesterBtn">
            Add New Semester
          </button>
        </div>
        <GPAChart cumulativeGPA={cumulativeGPA} />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header>
      <h1>Calculate Your GPA</h1>
      <div className="header-content">
        <h3>
          Unlock Your Academical Potential With GPA.
          <span style={{ color: "#00A3FF", fontWeight: "500" }}>Connect</span>
        </h3>
        <p>Your Gateway to Educational Success and Career Opportunities</p>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <p>Astana it university's edition </p>
    </footer>
  );
}

export default App;
