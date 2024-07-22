import React, { useState } from 'react';
import Navbar1 from '../../components/navBar/Navbar1';
import './create.css';
import { useNavigate } from 'react-router-dom';

const Create = () => {
  
  const [value, setValue] = useState();

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/room/${value}`)
  }

  const handleNewMeetingClick = () => {
    const eightDigitValue = Math.floor(Math.random() * 100000000);
    navigate(`/room/${eightDigitValue}`)
  };


  return (
    <div id="create">
      <div>
        <Navbar1 />
      </div>
      <div className="c_main">
        <div className="c_left">
          <div className="c_head">
            <h2>Create Your<br />Digital Room!</h2>
            <p>Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, <br /> sed do eiusmod tempor
              incididunt ut.</p>
          </div>
          <div className='c_t-btn'>
            <button onClick={handleNewMeetingClick} className="btn dot1 new-meeting">
              <div id="dot"></div> <div>New Meeting</div>
            </button>
            <input type="text" placeholder="Enter a code or link" className="input-btn enter-code" name='id'
              onChange={(e) => setValue(e.target.value)} />

            <i className='join' onClick={handleClick}>join</i>
          </div>
        </div>
        <div className="c_right">
          <div className="c_img">
            <img src="./img/room.png" alt="" style={{ width: "40rem" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
