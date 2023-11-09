import React, { useState } from 'react';
import './login.css';
import Navbar from '../navBar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleLogin = () => {
    try {
      axios.post('http://localhost:9002/login', user).then((res) => {
        alert(res.data.message);
        if (res.data.message === 'Login Successful') {
          navigate('/create');
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin(); // Call the login function when Enter key is pressed
    }
  };

  return (
    <div id="login">
      <div className="color"></div>
      <Navbar />
      <div id="login-page">
        <div className="login-left">
          <div className="head">Welcome Back</div>
          <div className="user-input">
            <i className="fa-regular fa-circle-user"></i>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress} // Trigger login on Enter key press
            />
          </div>
          <div className="user-input">
            <i className="fa-solid fa-lock"></i>
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress} // Trigger login on Enter key press
            />
          </div>
          <div className="pass">
            <div className="f-pass">
              <Link to="/forget" className="p1" style={{ cursor: 'pointer' }}>
                Forget Password
              </Link>
            </div>
          </div>
          <div className="login-btn">
            <button onClick={handleLogin}>Login</button>
          </div>
          <div className="dont">
            <p className="sin" style={{ cursor: 'pointer' }}>
              <Link to="/signup" className="sin">
                Don't Have an Account? Sign Up
              </Link>
            </p>
          </div>
        </div>
        <div className="login-right">
          <div className="login-img">
            <img src="./img/login.png" alt="" width={700} height={600} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
