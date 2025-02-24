import { useState, useCallback, useEffect } from "react";
import GPAChart from "./GPAChart";
import { CourseForm } from "./CourseForm";
import Auth from "./sign-in/up/Auth";
import Nav from "./Nav";
import Loader from "./Loader";
import AdminPanel from "./AdminPanel"; // Импортируем новый компонент
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
  const [isLoading, setIsLoading] = useState(true);

  // Logout function
  const handleLogout = () => {
    console.log("Logging out...");
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSemesters([]);
    setSemesterData({});
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setToken(null);
  };

  // Check for token & fetch user data on page load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedToken && storedUser) {
      console.log("Token and user found, staying logged in...");
      setCurrentUser(storedUser);
      setIsAuthenticated(true);
      Promise.all([fetchGPAData()]).finally(() => setIsLoading(false));
    } else if (storedToken) {
      console.log("Token found, fetching user profile...");
      Promise.all([fetchUserProfile(), fetchGPAData()]).finally(() =>
        setIsLoading(false)
      );
    } else {
      console.log("No token found, redirecting to Auth page.");
      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await getUserProfile();
      if (res.data?._id) {
        setCurrentUser(res.data);
        localStorage.setItem("currentUser", JSON.stringify(res.data));
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
        setSemesters(gpaData.semesters.map((s) => s.displayOrder));
        const newSemesterData = {};
        gpaData.semesters.forEach((semester) => {
          const gradeToGPA = {
            "4.0": 4.0,
            "3.67": 3.67,
            "3.33": 3.33,
            "3": 3.0,
            "2.67": 2.67,
            "2.33": 2.33,
            "2": 2.0,
            "1.67": 1.67,
            "1.33": 1.33,
            "1": 1.0,
            "0.5": 0.5,
            "0": 0.0,
          };

          const totalPoints = semester.courses.reduce((sum, c) => {
            const gpaValue = gradeToGPA[c.grade] || 0;
            return sum + gpaValue * parseFloat(c.credits);
          }, 0);
          const totalCredits = semester.courses.reduce(
            (sum, c) => sum + parseFloat(c.credits),
            0
          );
          newSemesterData[semester.displayOrder] = { totalPoints, totalCredits };
        });
        setSemesterData(newSemesterData);
      } else {
        await addGPARecord();
        setSemesters([1]);
      }
    } catch (err) {
      console.error("Error fetching GPA data:", err);
      if (err.response?.status === 401) handleLogout();
    }
  };

  const handleLogin = async ({ email, password }) => {
    setIsLoading(true);
    try {
      console.log("Login request data:", { email, password });
      const res = await loginUser({ email, password });
      if (res.data?.user && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
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
    } finally {
      setIsLoading(false);
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
      setSemesters((prev) => [...prev, res.data.semesterId]);
    } catch (err) {
      console.error("Error adding semester:", err);
      alert("Failed to add semester. Please try again.");
    }
  };

  const handleSemesterChange = useCallback((semesterNum, stats) => {
    if (stats.deleted) {
      setSemesters((prev) => prev.filter((s) => s !== semesterNum));
      setSemesterData((prev) => {
        const newData = { ...prev };
        delete newData[semesterNum];
        return newData;
      });
    } else {
      setSemesterData((prev) => ({
        ...prev,
        [semesterNum]: stats,
      }));
    }
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
      localStorage.setItem("currentUser", JSON.stringify(res.data.user));
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="App">
      {!isAuthenticated ? (
        <Auth onLogin={handleLogin} onSignUp={handleSignUp} />
      ) : currentUser.isAdmin ? (
        <AdminPanel onLogout={handleLogout} />
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
                  key={semester}
                  semesterNum={semester}
                  onSemesterChange={(stats) =>
                    handleSemesterChange(semester, stats)
                  }
                  setSemesters={setSemesters}
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