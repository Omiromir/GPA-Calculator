import React, { useState } from "react";
import SignInForm from "./SignIn";
import SignUpForm from "./SignUp";
import "./Auth.css";

export default function Auth({ onLogin, onSignUp }) {
  const [type, setType] = useState("signIn");
  const [errorMessage, setErrorMessage] = useState("");

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
      setErrorMessage(""); 
    }
  };

  const handleSignIn = ({ email, password }) => {
    if (!email || !password) {
      setErrorMessage("Please enter a valid email and password.");
      return;
    }

    onLogin({ email, password }); 
  };

  const handleSignUp = ({ email, password }) => {
    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    onSignUp({ email, password }); 
    setType("signIn");
    setErrorMessage("");
  };

  return (
    <div className="auth-container">
      <div className={`container ${type === "signUp" ? "right-panel-active" : ""}`}>
        <SignUpForm onSignUp={handleSignUp} />
        <SignInForm onSignIn={handleSignIn} />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us, please login with your personal info</p>
              <button className="ghost" onClick={() => handleOnClick("signIn")}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" onClick={() => handleOnClick("signUp")}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}
