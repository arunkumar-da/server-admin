// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import OtpInput from 'react-otp-input';
import { useRole } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function App() {
  const { email } = useRole(); // Set email from context
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/send-otp', { email });
      setMessage(response.data.message);
      setOtpSent(true);
    } catch (error) {
      setMessage('Error sending OTP. Please try again.');
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-otp', { email, otp });
      setMessage(response.data.message);
      if (response.data.message === "OTP verified successfully") {
        navigate('/url');
      }
    } catch (error) {
      setMessage('Error verifying OTP. Please check the code and try again.');
    }
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '20px',
    margin:'30px',
    boxSizing: 'border-box',
    marginLeft: '105px',
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  };

  const otpInputContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    margin: '20px 0',
  };

  const otpInputStyle = {
    width: '40px',
    height: '40px',
    textAlign: 'center',
    fontSize: '18px',
    border: '2px solid #007bff',
    borderRadius: '5px',
    outline: 'none',
    margin: '0 5px',
    transition: 'border-color 0.3s',
  };

  const verifyButtonStyle = {
    margin: '20px 0',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.2s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1>OTP Authentication</h1>
        <div style={otpInputContainerStyle}>
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span style={{ margin: '0 5px' }}>-</span>}
            renderInput={(props) => (
              <input
                {...props}
                style={otpInputStyle}
                onFocus={(e) => e.target.style.borderColor = '#0056b3'}
                onBlur={(e) => e.target.style.borderColor = '#007bff'}
              />
            )}
          />
        </div>

        <button
          onClick={verifyOtp}
          style={verifyButtonStyle}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          Verify OTP
        </button>

        <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>
      </div>
    </div>
  );
}

export default App;
