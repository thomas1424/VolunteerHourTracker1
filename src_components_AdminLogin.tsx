import React, { useState } from 'react';
import axios from 'axios';

const AdminLogin = () => {
  const [passcode, setPasscode] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasscode(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admin/login', { passcode });
      localStorage.setItem('adminToken', response.data.token);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="passcode" type="password" placeholder="Passcode" onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );
};

export default AdminLogin;