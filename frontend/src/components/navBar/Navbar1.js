import React, { useState } from 'react';
import "./style.css";
import { Link } from 'react-router-dom';
import Profile from '../profile/Profile';

const Navbar1 = () => {
  const [isProfileVisible, setProfileVisible] = useState(false);

  const toggleProfile = () => {
    setProfileVisible(!isProfileVisible);
  }

  return (
    <div>
       {isProfileVisible && <Profile />}
      <nav>
        <div className="logo">
          <Link><img src="./img/mainLogo.png" alt="" /></Link>
        </div>
        <div className='profile'>
          <img className='btn' onClick={toggleProfile} src="./img/profile1.png" alt="" style={{ width: "80px", cursor: "pointer" }} />
        </div>
      </nav>

    </div>
  )
}

export default Navbar1;