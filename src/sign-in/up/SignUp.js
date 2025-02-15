import React, { useState } from "react";

function SignUpForm({ onSignUp }) {
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!state.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!state.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!state.password) {
      newErrors.password = "Password is required";
    } else if (state.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

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
      alert(`Signed up with Name: ${state.name}, Email: ${state.email}`);
      if (onSignUp) {
        onSignUp(state); 
      }
      setState({ name: "", email: "", password: "" });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit} noValidate>
        <h1>Create Account</h1>
        <div className="social-container">
          <a href="#" className="social"><i className="fab fa-facebook-f" /></a>
          <a href="#" className="social"><i className="fab fa-google-plus-g" /></a>
          <a href="#" className="social"><i className="fab fa-linkedin-in" /></a>
        </div>
        <span>or use your email for registration</span>

        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
        />
        {errors.name && <small className="error">{errors.name}</small>}

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

export default SignUpForm;
