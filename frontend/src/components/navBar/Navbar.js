import React from 'react'
// import { Link } from 'react-router-dom';

import "./style.css"
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
      <nav>
        <div className="logo">
          <Link to='/' ><img src="./img/mainLogo.png" alt="" /></Link>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;