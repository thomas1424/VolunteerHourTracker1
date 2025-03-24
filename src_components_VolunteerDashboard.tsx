import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VolunteerDashboard = () => {
  const [formData, setFormData] = useState({
    event: '',
    hours: 0,
    note: ''
  });
  const [reportedHours, setReportedHours] = useState([]);

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
      fetchReportedHours();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchReportedHours = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/volunteer/hours', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportedHours(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReportedHours();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="event" type="text" placeholder="Event" onChange={handleChange} />
        <input name="hours" type="number" placeholder="Hours" onChange={handleChange} />
        <input name="note" type="text" placeholder="Note (optional)" onChange={handleChange} />
        <button type="submit">Report Hours</button>
      </form>
      <h3>Reported Hours</h3>
      <ul>
        {reportedHours.map((report) => (
          <li key={report._id}>
            Event: {report.event}, Hours: {report.hours}, Note: {report.note}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VolunteerDashboard;