import { useState, useCallback, useEffect } from "react";
import GPAChart from "./GPAChart";
import { CourseForm } from "./CourseForm";
import Auth from "./sign-in/up/Auth";
import Nav from "./Nav";
import axios from "axios";

function App() {
  const [semesters, setSemesters] = useState([]);
  const [semesterData, setSemesterData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cumulativeGPA, setCumulativeGPA] = useState(0);

  const api = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: { "Content-Type": "application/json" },
  });

  // Обновляем заголовки для всех запросов, добавляя user-id, если пользователь авторизован
  api.interceptors.request.use((config) => {
    if (currentUser && currentUser._id) {
      config.headers['user-id'] = currentUser._id;
    }
    return config;
  });

  useEffect(() => {
    fetchUserProfile();
    fetchGPAData();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      if (res.data && res.data.user && res.data.user._id) {
        setCurrentUser(res.data.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      if (err.response && err.response.status === 401) {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    }
  };

  const fetchGPAData = async () => {
    try {
      const res = await api.get("/gpa");
      if (res.data) {
        const gpaData = res.data;
        setSemesters(gpaData.semesters.map((s) => s.id));
        const newSemesterData = {};
        gpaData.semesters.forEach((semester) => {
          const totalPoints = semester.courses.reduce(
            (sum, c) => sum + parseFloat(c.grade) * parseFloat(c.credits),
            0
          );
          const totalCredits = semester.courses.reduce(
            (sum, c) => sum + parseFloat(c.credits),
            0
          );
          newSemesterData[semester.id] = { totalPoints, totalCredits };
        });
        setSemesterData(newSemesterData);
      } else {
        await api.post("/gpa");
        setSemesters([1]);
      }
    } catch (err) {
      console.error("Error fetching GPA data:", err);
      if (err.response && err.response.status === 401) {
        setSemesters([]);
        setSemesterData({});
      }
    }
  };

  const handleLogin = async ({ email, password }) => {
    try {
      console.log("Login request data:", { email, password });
      const res = await api.post("/auth/login", { email, password });
      if (res.data && res.data.user && res.data.user._id) {
        setCurrentUser(res.data.user);
        setIsAuthenticated(true);
        await fetchGPAData(); // Обновляем данные GPA после логина
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      console.error("Login error on frontend:", err.response ? err.response.data : err.message);
      alert("Invalid email or password!");
    }
  };

  const handleSignUp = async ({ email, password, name }) => {
    try {
      await api.post("/auth/register", { email, password, username: name });
      alert("Sign-up successful! Please log in.");
    } catch (err) {
      alert("User already exists or invalid data!");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSemesters([]);
    setSemesterData({});
  };

  const addSemester = async () => {
    if (!currentUser || !currentUser._id) {
      alert("Please log in to add a semester.");
      return;
    }
    try {
      const res = await api.post("/gpa/semesters");
      setSemesters((prev) => [...prev, res.data.semesterId]);
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
      const res = await api.put("/users/profile", updatedInfo);
      setCurrentUser(res.data.user);
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
              {semesters.map((semester, index) => (
                <CourseForm
                  key={index}
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