import React, { useState, useEffect } from 'react';
import './url.css';
import { Card, FloatButton, Tooltip, Modal, Form, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../component/context/AuthContext';
const Url = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [options, setOptions] = useState([]); // State to hold roles
  const additionalText = 'http://69.164.221.175/form?role=';
  const navigate = useNavigate(); // Initialize the navigate function
  const { visible, setvisible } = useRole();
  // Fetch roles when the component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:5015/api/roles');
        const data = await response.json();
        const roles = data.map(role => role.role); // Extract the role from the response
        setOptions(roles);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleCopy = () => {
    const textToCopy = additionalText + selectedOption;
    navigator.clipboard.writeText(textToCopy);
  };

  const handleClick = () => {
    // Navigate to the desired route
    navigate('/qns'); // Replace with your target route
  };
  const clientClick = () => {
    // Navigate to the desired route
    navigate('/client'); // Replace with your target route
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5015/api/recruiter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Recruiter added:', result);
        handleOk();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add recruiter');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Card className="card">
        <div className="select-wrapper">
          <select
            className='select'
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="" disabled>Select a role</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <h1 className='text'>{selectedOption}</h1>
        <button type='submit' onClick={handleCopy} className="button">
          Click to Copy The Url
        </button>
      </Card>

      <FloatButton.Group
        shape="circle"
        style={{
          insetInlineEnd: 24,
        }}
      >
        {visible && (
        <Tooltip title="Add Recruiters">
          <FloatButton
            icon={<PlusOutlined />}
            shape="circle"
            style={{
              backgroundColor: '#4CAF50',
              color: '#fff',
              border: 'none',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              insetInlineEnd: 94,
            }}
            onClick={showModal}
          />
        </Tooltip>
         )}
        <Tooltip title="Questions">
        <FloatButton onClick={handleClick} />
    </Tooltip>
    <Tooltip title="Clients">
        <FloatButton.BackTop visibilityHeight={0}   onClick={clientClick}  />
        </Tooltip>
      </FloatButton.Group>

      <Modal
        title="Add Recruiter"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form onFinish={onFinish}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[{ required: true, message: 'Please confirm your password!' }]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Save
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Url;
