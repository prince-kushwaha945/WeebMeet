import React from 'react'
import { Link } from 'react-router-dom';

import "./home.css"

function Home() {
  return (
    <div id='home'>
      <div className="main">
        <div className="left">
          <div className="head">
            <h2>Digital<br />Conference World </h2>
            <p>Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, <br /> sed do eiusmod tempor
              incididunt ut.</p>
          </div>
          <div>
            <Link to='/login' className="btn"><div id="dot"></div> <div className='enter'>ENTERE IN DIGITAL ROOM</div> <i class="fa-solid fa-arrow-right"></i></Link>
          </div>
        </div>
        <div className="right">
          <div className="img">
            <img src="./img/home3.png" alt="" style={{ width: "40rem" }} />
          </div>
        </div>
      </div>
    </div>
  )
}


export default Home;