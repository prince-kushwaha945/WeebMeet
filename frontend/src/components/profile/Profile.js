import React from 'react'
import './profile.css'
import { Link } from 'react-router-dom'

const Profile = () => {
  return (
    <div id='profile'>
      <div className='pro'>
          <Link to="/"><h4>Logout</h4> </Link>
      </div>
    </div>
  )
}

export default Profile