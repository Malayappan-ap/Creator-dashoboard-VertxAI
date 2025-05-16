import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '100px' }}>
      <div onClick={() => navigate('/user/login')} style={cardStyle}>User</div>
      <div onClick={() => navigate('/admin/login')} style={cardStyle}>Admin</div>
    </div>
  );
};

const cardStyle = {
  padding: '40px',
  background: '#f0f0f0',
  borderRadius: '12px',
  cursor: 'pointer',
  fontSize: '24px',
  textAlign: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

export default Home;
