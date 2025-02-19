import { useState, useCallback } from "react";
import GPAChart from "./GPAChart";
import { CourseForm } from "./CourseForm";
import Auth from "./sign-in/up/Auth";
import Nav from "./Nav"; // make sure Nav is imported

function App() {
  const [semesters, setSemesters] = useState([1]);
  const [semesterData, setSemesterData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([
    {
      email: "omir@gmail.com",
      password: "password123",
      name: "Omir",
      status: "Student",
      avatar: require("./avatar-placeholder.png"),
    },
  ]);

  const handleLogin = ({ email, password }) => {
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user); // store the full user object
    } else {
      alert("Invalid email or password!");
    }
  };

  const handleSignUp = ({ email, password, name }) => {
    const userExists = users.some((user) => user.email === email);

    if (userExists) {
      alert("User already exists! Try logging in.");
    } else {
      // New user with default status
      const newUser = { email, password, name, status: "Student", avatar: require("./avatar-placeholder.png") };
      setUsers((prevUsers) => [...prevUsers, newUser]);
      alert("Sign-up successful! Please log in.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  function addSemesters() {
    setSemesters((prevSemesters) => [
      ...prevSemesters,
      prevSemesters.length + 1,
    ]);
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

  const cumulativeGPA =
    totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

  // Callback to update user info from ProfileModal
  const handleUserUpdate = (updatedInfo) => {
    setCurrentUser((prevUser) => ({ ...prevUser, ...updatedInfo }));
    // Optionally, also update in the users array if needed.
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Auth onLogin={handleLogin} onSignUp={handleSignUp} />
      ) : (
        <>
          <Nav
            onLogOut={handleLogout}
            user={currentUser}
            cumulativeGPA={cumulativeGPA}
            onUserUpdate={handleUserUpdate}
          />
          <Header />
          <main>
            <div className="course-container">
              {semesters.map((semester, index) => (
                <CourseForm
                  key={index}
                  semesterNum={semester}
                  onSemesterChange={(stats) =>
                    handleSemesterChange(semester, stats)
                  }
                />
              ))}
              <button onClick={addSemesters} className="addSemesterBtn">
                Add New Semester
              </button>
            </div>
            <GPAChart cumulativeGPA={cumulativeGPA} />
          </main>
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
          <span style={{ color: "#00A3FF", fontWeight: "500" }}>
            Connect
          </span>
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
