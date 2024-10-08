import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Card, Row, Col } from 'antd';
import { useRole } from '../context/AuthContext';
const QnsCard = () => {
  const [data, setData] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const { visible, setvisible } = useRole();
  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch('http://localhost:5019/questions');
      const result = await response.json();
      setData(result);
    };
    fetchQuestions();
  }, []);

  const handleAdd = async () => {
    if (newRole && newQuestion) {
      const newEntry = { role: newRole, qns: newQuestion };
      await fetch('http://localhost:5019/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      });
      setData([...data, { key: Date.now(), ...newEntry }]);
      setNewRole('');
      setNewQuestion('');
    }
  };

  const handleRemove = async (record) => {
    await fetch(`http://localhost:5019/questions`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: record.role, question: record.qns }),
    });
    setData(data.filter(entry => !(entry.role === record.role && entry.qns === record.qns)));
  };

  const columns = [
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: '30%',
    },
    {
      title: 'Question',
      dataIndex: 'qns',
      key: 'qns',
      width: '55%',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      render: (_, record) => (
      
        <Button type="link" onClick={() => handleRemove(record)}>Remove</Button>
      
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '50px auto' }}>
      <Card
        title={<h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Role and Questions</h2>}
        style={{ width: '100%' }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <Table 
            dataSource={data} 
            columns={columns} 
            pagination={false}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Add New Entry</h3>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Input
                placeholder="Role"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                style={{ marginBottom: '16px' }}
              />
            </Col>
            <Col xs={24} sm={12}>
              <Input
                placeholder="Question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                style={{ marginBottom: '16px' }}
              />
            </Col>
          </Row>
          <Button type="primary" onClick={handleAdd} style={{ width: '100%' }}>Add</Button>
        </div>
      </Card>
    </div>
  );
};

export default QnsCard;
