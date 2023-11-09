import React, { useState } from 'react';
import Navbar from '../navBar/Navbar';
import { Link } from 'react-router-dom';


const SendMail = () => {
    const [email, setEmail] = useState("");

    const setVal = (e) =>{
        setEmail(e.target.value);
    }

    const setLink = async(e) =>{
        e.preventDefault();
        
        const res = await fetch("/sendpasswordlink", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"

            },
            body: JSON.stringify({email})
        });

        const data = await res.json();

        if(data.status === 201){
            setEmail("");
            alert("password reset link send Succefully in your Email ")
        }else {
            // toast.error("Invalid User")
            alert("User is not registered")
        }

    }

    return (
        <div id='login'>
            <Navbar />
            <div id='login-page' >
                <div className='login-left forget-page' style={{marginTop: "11rem"}}>
                    <div className='head'>Enter your Email </div>

                    <div className='user-input forget-input'>
                        <i className='fa-regular fa-envelope'></i>
                        <input
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={setVal}
                        />
                    </div>
                    
                    <div className='login-btn forget-btn'>
                        <button onClick={setLink} >Send</button>
                    </div>
                    <div className='dont'>
                    <p className='sin' style={{ cursor: 'pointer' }}>
                            <Link to='/login' className='sin'>
                                Don't forget password ? Login
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="signUp-right">
                    <div className="signUp-img">
                        <img src="./img/3d-man.png" alt="" width={700} height={600}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default  SendMail;

