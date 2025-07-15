import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./LoginPage.css";

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const LoginPage = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); 

  const validateFields = () => {
    if (!username || !password || (!isLogin && !email)) {
      setMessage("All fields are required.");
      setMessageType("error");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;

    try {
      const response = await fetch("http://localhost:8080/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `Error: ${response.status}`);
      }

      setMessage("User registered successfully!");
      setMessageType("success");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage("Failed to register user.");
      setMessageType("error");
    }
  };

  const handleLogin = async () => {
    if (!validateFields()) return;

    try {
      const response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      setMessage("Login successful! Redirecting...");
      setMessageType("success");

      setTimeout(() => {
        navigate("/home"); 
      }, 1000);
    } catch (error) {
      console.error("Login failed:", error);
      setMessage("Invalid username or password.");
      setMessageType("error");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="main">{isLogin ? "Login" : "Sign Up"}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        <div className="input">
          <img src={user_icon} alt="user icon" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {!isLogin && (
          <div className="input">
            <img src={email_icon} alt="email icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}

        <div className="input" style={{ position: "relative" }}>
          <img src={password_icon} alt="password icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <i
            className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#888",
            }}
          ></i>
        </div>
      </div>

      {isLogin && (
        <div className="forgot-password">
          Forgot Password?{" "}
          <span
            onClick={() => navigate("/forgot-password")}
            style={{ cursor: "pointer", color: "white" }}
          >
            Click Here
          </span>
        </div>
      )}

      {message && (
        <div
          className={`message ${messageType}`}
          style={{
            color: messageType === "error" ? "red" : "green",
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          {message}
        </div>
      )}

      <div className="submit-container">
        <div className="button" onClick={isLogin ? handleLogin : handleSignUp}>
          <span>{isLogin ? "Login" : "Sign Up"}</span>
        </div>
        <div
          className="toggle-mode"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
            setUsername("");
            setPassword("");
            setEmail("");
          }}
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Login"}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;