import React, { useState } from "react";
import facebookIcon from "./facebook.svg";
import instagramIcon from "./instagram.svg";
import googleIcon from "./google.svg";

function SignIn({ onSignIn }) {
  const [state, setState] = useState({ email: "", password: "" });

  const handleChange = (evt) => {
    setState((prevState) => ({
      ...prevState,
      [evt.target.name]: evt.target.value,
    }));
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    const { email, password } = state;
    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.");
      return;
    }
    onSignIn({ email: email.trim(), password: password.trim() });
    setState({ email: "", password: "" });
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
        <div className="social-container">
          <a href="#" className="social">
            <img src={facebookIcon} className="fab fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <img src={googleIcon} className="fab fa-google-plus-g" />
          </a>
          <a href="#" className="social">
            <img src={instagramIcon} className="fab fa-instagram-in" />
          </a>
        </div>
        <span>or use your account</span>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <a href="#">Forgot your password?</a>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;