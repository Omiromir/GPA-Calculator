import { useState, useCallback } from "react";
import GPAChart from "./GPAChart";
import { CourseForm } from "./CourseForm";
import Auth from "./sign-in/up/Auth";

function App() {
  const [semesters, setSemesters] = useState([1]);
  const [semesterData, setSemesterData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState([
    { email: "omir@gmail.com", password: "password123" }, 
  ]);

  const handleLogin = ({ email, password }) => {
    const userExists = users.some((user) => user.email === email && user.password === password);

    if (userExists) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid email or password!");
    }
  };

  const handleSignUp = ({ email, password }) => {
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      alert("User already exists! Try logging in.");
    } else {
      setUsers((prevUsers) => [...prevUsers, { email, password }]);
      alert("Sign-up successful! Please log in.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  function addSemesters() {
    setSemesters((prevSemesters) => [...prevSemesters, prevSemesters.length + 1]);
  }

  const handleSemesterChange = useCallback((semesterNum, stats) => {
    setSemesterData((prev) => ({
      ...prev,
      [semesterNum]: stats,
    }));
  }, []);

  const { totalPoints, totalCredits } = Object.values(semesterData).reduce(
    (totals, { totalPoints, totalCredits }) => ({
      totalPoints: totals.totalPoints + totalPoints,
      totalCredits: totals.totalCredits + totalCredits,
    }),
    { totalPoints: 0, totalCredits: 0 }
  );

  const cumulativeGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Auth onLogin={handleLogin} onSignUp={handleSignUp} />
      ) : (
        <>
          <h2 className="app-title">
              GPA <span style={{ color: "#00A3FF", fontWeight: "500" }}>Calculator</span>
            </h2>
          <Header />
          <main>
            <div className="course-container">
              {semesters.map((semester, index) => (
                <CourseForm
                  key={index}
                  semesterNum={semester}
                  onSemesterChange={(stats) => handleSemesterChange(semester, stats)}
                />
              ))}
              <button onClick={addSemesters} className="addSemesterBtn">Add New Semester</button>
            </div>
            <GPAChart cumulativeGPA={cumulativeGPA} />
          </main>
          <div className="logout__container"><button onClick={handleLogout} className="logoutBtn">Logout</button></div>
          <Footer />
        </>
      )}
    </div>
  );
}

function Header() {
  return (
    <header>
      <h1 className="header-title">Calculate Your GPA</h1>
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
      <p>Astana IT University's Edition</p>
    </footer>
  );
}

export default App;
