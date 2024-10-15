import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Input, Form } from 'antd';
import { useRole } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const Client = () => {
  const [data, setData] = useState([]);
  const [form] = Form.useForm();
  const { selectedRole, setSelectedRole } = useRole();
  const { visible, setvisible } = useRole();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isLaptop = useMediaQuery({ minWidth: 1024 });

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetch('https://www.noraasoft.com:5016/client');
      const result = await response.json();
      setData(result);
    };
    fetchClients();
  }, []);

  const handleAdd = async (values) => {
    const { role, email, phoneNumber, skills } = values;
    if (role && email && phoneNumber && skills) {
      const newEntry = { role, email, phoneNumber, skills };
      await fetch('https://www.noraasoft.com:5016/client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
      setData(prevData => [...prevData, { key: Date.now(), ...newEntry }]);
      form.resetFields();
    }
  };

  const handleRemove = async (record) => {
    try {
      const response = await fetch('https://www.noraasoft.com:5016/client', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: record.email }),
      });
      
      if (response.ok) {
        setData(prevData => prevData.filter(entry => entry.email !== record.email));
      } else {
        console.error('Failed to delete client:', response.statusText);
      }
    } catch (error) {
      console.error('Error while deleting client:', error);
    }
  };

  const handleRowClick = (record) => {
    setSelectedRole(record.role);
  };

  const columns = [
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      onCell: (record) => ({
        onClick: () => handleRowClick(record),
      }),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      onCell: (record) => ({
        onClick: () => handleRowClick(record),
      }),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phonenumber',
      key: 'phoneNumber',
      onCell: (record) => ({
        onClick: () => handleRowClick(record),
      }),
    },
    {
      title: 'Skills',
      dataIndex: 'skills',
      key: 'skills',
      onCell: (record) => ({
        onClick: () => handleRowClick(record),
      }),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        visible && (
        <Button onClick={() => handleRemove(record)} type="primary" danger>
          Remove
        </Button>
        )
      ),
    },
    {
      title: 'View Video',
      key: 'viewVideo',
      render: (text, record) => (
        <Link to='/video'>
          <Button onClick={() => handleRowClick(record)} type="primary">
            View Video
          </Button>
        </Link>
      ),
    },
  ];

  const mobileColumns = columns.slice(0, 2);

  return (
    <div style={{ padding: '20px', maxWidth: '100%', margin: '70px auto 0' }}>
      <Card
        title={<h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Clients</h2>}
        style={{ width: '100%' }}
      >
        

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <Table 
            dataSource={data} 
            columns={isMobile ? mobileColumns : columns} 
            pagination={{ pageSize: isMobile ? 5 : (isTablet ? 8 : 10) }}
            style={{ width: '100%' }}
            scroll={{ x: isMobile ? 300 : isTablet ? 600 : 1000 }}
          />
        </div>
      </Card>
    </div>
  );
};

export default Client;
