import React, { useState } from 'react';
import Navbar from '../navBar/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        conformPass: '',
    });

    const [errors, setErrors] = useState({
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value,
        });

        // Field-level validation for email
        if (name === 'email') {
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
            if (!gmailRegex.test(value)) {
                setErrors({
                    ...errors,
                    email: 'Invalid Gmail address',
                });
            } else {
                setErrors({
                    ...errors,
                    email: '', // Clear the error message
                });
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            register();
        }
    };

    const register = () => {
        const { name, email, password, conformPass } = user;
        if (name && email && password && password === conformPass && !errors.email) {
            axios.post('http://localhost:9002/register', user).then((res) => {
                alert(res.data.message);
                if (res.data.message === 'Successfully registered. Please login now.') {
                    navigate('/login');
                }
            });
        } else {
            alert('Invalid input');
        }
    };

    return (
        <div id="signUp">
            <Navbar />
            <div id="signUp-page">
                <div className="signUp-left">
                    <div className="head">Sign Up</div>
                    <div className="user-input">
                        <i className="fa-regular fa-circle-user"></i>
                        <input type="text" placeholder="Username" name="name" value={user.name} onChange={handleChange} onKeyPress={handleKeyPress} />
                    </div>
                    {/* Display the error message for email */}
                    <div className="user-input">
                        <i className="fa-regular fa-envelope"></i>
                        <input type="email" placeholder="Email" name="email" value={user.email} onChange={handleChange} onKeyPress={handleKeyPress} />
                    </div>
                    <div className="user-input">
                        <i className="fa-solid fa-lock"></i>
                        <input type="password" placeholder="Password" name="password" value={user.password} onChange={handleChange} onKeyPress={handleKeyPress} />
                    </div>
                    <div className="user-input">
                        <i className="fa-solid fa-lock"></i>
                        <input type="password" placeholder="Confirm Password" name="conformPass" value={user.conformPass} onChange={handleChange} onKeyPress={handleKeyPress} />
                    </div>
                    {/* <div className="pass">
                        <div className="r-pass">
                            <input type="checkbox" name="remember" id="check" />
                            <label htmlFor="check">Remember Password</label>
                        </div>
                    </div> */}

                    <div className="signUp-btn">
                        <button onClick={register}>Sign Up</button>
                    </div>
                    <div className="dont">
                        <p className="sin" style={{ cursor: 'pointer' }}>
                            {' '}
                            <Link to="/login" className="sin">
                                Already Have an Account? Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="signUp-right">
                    <div className="signUp-img">
                        <img src="./img/3d-man.png" alt="" width={700} height={600} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
