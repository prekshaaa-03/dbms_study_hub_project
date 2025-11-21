import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './Auth.css';

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login-bg');

    return () => {
      document.body.classList.remove('login-bg');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
  
    const endpoint = isLogin ? "/login" : "/signup";
  
    try {
      const res = await axios.post(`http://localhost:8000/api/auth${endpoint}`, {
        email,
        password,
      });
  
      if (res.data.status === "success") {
        localStorage.setItem("token", res.data.token);
        if (isLogin) {
          navigate("/dashboard");
        } else {
          toast.success("Account created successfully!");
          setIsLogin(true);
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error: ", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  
  return (
    <>
      <div className="header-banner">
        <span className="typing-text">Welcome to Lock In.</span>
      </div>

      <div className="login-container">
        <div className="login-form">
          <h1>{isLogin ? "Login" : "Sign Up"}</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            )}
            <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
          </form>
          <p className="toggle-option">
            {isLogin ? "New user? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default Auth;
