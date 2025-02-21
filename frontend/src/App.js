import { useState, useCallback, useEffect } from "react";
import GPAChart from "./GPAChart";
import { CourseForm } from "./CourseForm";
import Auth from "./sign-in/up/Auth";
import Nav from "./Nav";
import {
  addGPARecord,
  addNewSemester,
  getSemesters,
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from "./services/api";

function App() {
  const [semesters, setSemesters] = useState([]);
  const [semesterData, setSemesterData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );
  const [cumulativeGPA, setCumulativeGPA] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Logout function
  const handleLogout = () => {
    console.log("Logging out...");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSemesters([]);
    setSemesterData({});
    localStorage.removeItem("token"); // Remove token from local storage
    localStorage.removeItem("currentUser"); // Remove currentUser from local storage
    setToken(null); // Clear token from state
  };

  // Check for token & fetch user data on page load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));

    if (storedToken && storedUser) {
      // If token and user exist, stay logged in
      console.log("Token and user found, staying logged in...");
      setCurrentUser(storedUser);
      setIsAuthenticated(true);
      fetchGPAData(); // Fetch GPA data for the authenticated user
    } else if (storedToken) {
      // If token exists but user is not in localStorage, fetch user profile
      console.log("Token found, fetching user profile...");
      fetchUserProfile();
      fetchGPAData();
    } else {
      // No token found, redirect to Auth page
      console.log("No token found, redirecting to Auth page.");
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await getUserProfile();
      if (res.data?.user?._id) {
        setCurrentUser(res.data.user);
        localStorage.setItem("currentUser", JSON.stringify(res.data.user)); // Store user in localStorage
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      if (err.response?.status === 401) handleLogout();
    }
  };

  const fetchGPAData = async () => {
    try {
      const res = await getSemesters();
      if (res.data) {
        const gpaData = res.data;
        setSemesters(gpaData.semesters.map((s) => s.id));
        const newSemesterData = {};
        gpaData.semesters.forEach((semester) => {
          const gradeToGPA = {
            A: 4.0,
            "A-": 3.67,
            "B+": 3.33,
            B: 3.0,
            "B-": 2.67,
            "C+": 2.33,
            C: 2.0,
            "C-": 1.67,
            "D+": 1.33,
            D: 1.0,
            "D-": 0.5,
            F: 0.0,
          };

          const totalPoints = semester.courses.reduce((sum, c) => {
            const gpaValue = gradeToGPA[c.grade] || 0;
            return sum + gpaValue * parseFloat(c.credits);
          }, 0);
          const totalCredits = semester.courses.reduce(
            (sum, c) => sum + parseFloat(c.credits),
            0
          );
          newSemesterData[semester.id] = { totalPoints, totalCredits };
        });
        setSemesterData(newSemesterData);
      } else {
        await addGPARecord();
        setSemesters([1]);
        // Re-fetch semesters to get the new semester ID
      }
    } catch (err) {
      console.error("Error fetching GPA data:", err);
      if (err.response?.status === 401) handleLogout();
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      console.log("Login request data:", { email, password });
      const res = await loginUser({ email, password });

      if (res.data?.user && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("currentUser", JSON.stringify(res.data.user)); // Store user in localStorage
        setToken(res.data.token);
        setCurrentUser(res.data.user);
        setIsAuthenticated(true);
        await fetchGPAData();
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid email or password!");
    }
  };

  const handleSignUp = async ({ email, password, name }) => {
    try {
      await registerUser({ email, password, username: name });
      alert("Sign-up successful! Please log in.");
    } catch (err) {
      alert("User already exists or invalid data!");
    }
  };

  const addSemester = async () => {
    if (!currentUser?._id) {
      alert("Please log in to add a semester.");
      return;
    }
    try {
      const res = await addNewSemester();
      setSemesters((prev) => [...prev, res.data.semesterId]); // Use the correct property (e.g., res.data.id)
    } catch (err) {
      console.error("Error adding semester:", err);
      alert("Failed to add semester. Please try again.");
    }
  };

  const handleSemesterChange = useCallback((semesterNum, stats) => {
    setSemesterData((prev) => ({
      ...prev,
      [semesterNum]: stats,
    }));
  }, []);

  useEffect(() => {
    const { totalPoints, totalCredits } = Object.values(semesterData).reduce(
      (totals, { totalPoints, totalCredits }) => ({
        totalPoints: totals.totalPoints + totalPoints,
        totalCredits: totals.totalCredits + totalCredits,
      }),
      { totalPoints: 0, totalCredits: 0 }
    );
    setCumulativeGPA(
      totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0
    );
  }, [semesterData]);

  const handleUserUpdate = async (updatedInfo) => {
    try {
      const res = await updateUserProfile(updatedInfo);
      setCurrentUser(res.data.user);
      localStorage.setItem("currentUser", JSON.stringify(res.data.user)); // Update user in localStorage
    } catch (err) {
      console.error(err);
    }
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
              {semesters.map((semester) => (
                <CourseForm
                  key={semester} // Use semester ID as the key
                  semesterNum={semester}
                  onSemesterChange={(stats) =>
                    handleSemesterChange(semester, stats)
                  }
                />
              ))}
              <button onClick={addSemester} className="addSemesterBtn">
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

//TODO: Добавить удаление