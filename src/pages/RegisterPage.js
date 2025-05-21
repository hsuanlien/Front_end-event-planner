import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    alert('Registration successful!');
    navigate('/');
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default RegisterPage;
