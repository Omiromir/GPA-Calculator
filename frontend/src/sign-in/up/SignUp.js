import React, { useState } from "react";
import facebookIcon from "./facebook.svg";
import instagramIcon from "./instagram.svg";
import googleIcon from "./google.svg";

function SignUp({ onSignUp }) {
  const [state, setState] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!state.username.trim() || state.username.length > 20) newErrors.username = "Username should 1-20 characters long.";
    if (!state.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(state.email))
      newErrors.email = "Email is invalid";
    if (!state.password) newErrors.password = "Password is required";
    else if (state.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setState({ ...state, [name]: value });
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    setIsSubmitting(true);

    if (validate()) {
      onSignUp(state);
      setState({ username: "", email: "", password: "" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit} noValidate>
        <h1>Create Account</h1>
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
        <span>or use your email for registration</span>
        <input
          type="text"
          name="username"
          value={state.username}
          onChange={handleChange}
          placeholder="Name"
        />
        {errors.username && <small className="error">{errors.username}</small>}
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <small className="error">{errors.email}</small>}
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {errors.password && <small className="error">{errors.password}</small>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default SignUp;
