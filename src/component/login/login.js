import React, { useState } from 'react';
import { Card, Input, Button, Row, Col, Progress, Modal } from 'antd';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRole } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

const CustomCard = ({ title }) => {
  const { email, setEmail } = useRole();
  const [password, setPassword] = useState('');
  const [isNameEntered, setIsNameEntered] = useState(false);
  const [isPasswordEntered, setIsPasswordEntered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setIsNameEntered(!!event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setIsPasswordEntered(!!event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setProgress(0);

    try {
      // Send login request
      setProgress(25);
      const loginResponse = await axios.post('http://localhost:3007/login', { email, password });

      if (loginResponse.data.success) {
        setProgress(50);
        // If login is successful, send OTP
        await axios.post('http://localhost:5000/send-otp', { email });
        setProgress(100);
        
        setTimeout(() => {
          setLoading(false);
          navigate('/otp'); // Navigate to the desired URL after successful login and OTP request
        }, 500);
      } else {
        setLoading(false);
        alert('Wrong password');
      }
    } catch (error) {
      setLoading(false);
      console.error('There was an error logging in!', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div>
      <div className="card">
        <Row justify="center">
          <form onSubmit={handleSubmit} className="form-container">
            <Input
              className="textfield"
              value={email}
              onChange={handleEmailChange}
              placeholder={isNameEntered ? '' : 'Enter your email'}
              style={{
                borderRadius: isNameEntered ? '30px' : '0px',
                backgroundColor: isNameEntered ? 'transparent' : 'aliceblue',
              }}
            />
            
            <Input.Password
              className="textfield"
              value={password}
              onChange={handlePasswordChange}
              placeholder={isPasswordEntered ? '' : 'Enter your password'}
              style={{
                borderRadius: isPasswordEntered ? '30px' : '0px',
                backgroundColor: isPasswordEntered ? 'transparent' : 'aliceblue',
                textAlign: 'center',
              }}
            />
            
            <Button type="primary" htmlType="submit" className="login-button">
              Submit
            </Button>
            
            <Link to={'/admin'}>
              <Button type="primary" htmlType="submit" className="login-button" style={{marginLeft:'40px'}}>
                login as admin
              </Button>
            </Link>
          </form>
        </Row>
      </div>

      <Modal
        visible={loading}
        closable={false}
        footer={null}
        centered
      >
        <Progress percent={progress} status="active" />
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          {progress < 50 ? 'Logging in...' : 'Sending OTP...'}
        </p>
      </Modal>
    </div>
  );
};

export default CustomCard;