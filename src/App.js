import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import './App.css';
import Home1 from './pages/home1/Home1';
import Create from './pages/createMeeting/Create';
import Login from './components/loginSinup/Login';
import SignUp from './components/loginSinup/SignUp';
import ForgetPass from './components/loginSinup/ForgetPass';
import Room from './components/Room/Room';
import SendMail from './components/loginSinup/SendMail';

function App() {
  
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home1 />} />
          <Route path="/create" element={<Create />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forget" element={<SendMail />} />
          <Route path="/forget-pass/:id/:token" element={<ForgetPass />} />
          
          <Route path='/room/:roomid' element={<Room />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
