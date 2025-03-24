import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    dateOfBirth: '',
    fullName: '',
    // other personal details
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/signup', formData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <input name="dateOfBirth" type="date" placeholder="Date of Birth" onChange={handleChange} />
      <input name="fullName" type="text" placeholder="Full Name" onChange={handleChange} />
      {/* other personal details */}
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;