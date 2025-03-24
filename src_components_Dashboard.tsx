import React, { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    event: '',
    hours: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/report-hours', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="event" type="text" placeholder="Event" onChange={handleChange} />
      <input name="hours" type="number" placeholder="Hours" onChange={handleChange} />
      <button type="submit">Report Hours</button>
    </form>
  );
};

export default Dashboard;