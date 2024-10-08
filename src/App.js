import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from'./component/login/login'; // Adjust the path as per your actual file structure
import './App.css';
import Url from './url/url';
import Qns from './component/qns/qns'
import Otp from './component/otp/otp'
import Client  from './component/client/client';
import VideoComponent from './component/videos/videos';
import { RoleProvider } from './component/context/AuthContext'; 
import Admin from './component/admin/admin'
const App = () => {
  return (
    <div className="App">
          <RoleProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/admin" element={<Admin/>} />
        <Route path='/otp' element={<Otp/>} />
        <Route path="/url" element={<Url/>} />
        <Route path="/qns" element={<Qns/>} />
        <Route path="/client" element={<Client/>} />
        <Route path="/video" element={<VideoComponent/>} />
      </Routes>
    </Router>
    </RoleProvider>
    </div>
  );
};

export default App;
