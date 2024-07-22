import React, { useEffect, useState } from 'react';
import Navbar from '../navBar/Navbar';
import { Link, useNavigate, useParams } from 'react-router-dom';

const ForgetPass = () => {
    const { id, token } = useParams();
    const history = useNavigate();
    const [password, setPassword] = useState("");

    const userValid = async () => {
        const res = await fetch(`/forget-pass/${id}/${token}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (data.status === 201) {
            console.log("user valid");
        } else {
            history("*");
        }
    }

    useEffect(() => {
        userValid();
    }, []);

    const setVail = (e) => {
        setPassword(e.target.value);
    }

    const sendpassword = async (e) => {
        e.preventDefault();

        const res = await fetch(`/${id}/${token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ password })
        });

        const data = await res.json();

        if (data.status === 201) {
            setPassword(""); // Clear the password input
            alert("Password Succefully updated")
        } else {
            alert("Token Expired, generate a new Link");
        }
    }
    return (
        <div id='login'>
            <Navbar />
            <div id='login-page' style={{paddingLeft: '20rem'}}>
                <div className='login-left forget-page' style={{ marginTop: "9rem" }}>
                    <div className='head'>Forgot Password</div>

                    <div className='user-input forget-input'>
                        <i className='fa-solid fa-lock'></i>
                        <input
                            type='password'
                            placeholder='New Password'
                            value={password}
                            onChange={setVail}
                        />
                    </div>
                    {/* <div className='user-input forget-input'>
                        <i className='fa-solid fa-lock'></i>
                        <input
                            type='password'
                            placeholder='Confirm Password'

                        />
                    </div> */}

                    <div className='login-btn forget-btn'>
                        <button onClick={sendpassword}>Send</button>
                    </div>
                    <div className='dont'>
                        <p className='sin' style={{ cursor: 'pointer' }}>

                            <Link to='/login' className='sin'>
                                Don't forget password ? Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgetPass;
