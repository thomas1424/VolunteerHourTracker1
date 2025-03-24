import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [volunteerHours, setVolunteerHours] = useState([]);
  const [filteredHours, setFilteredHours] = useState([]);
  const [filter, setFilter] = useState({ event: '', volunteer: '' });
  const [editForm, setEditForm] = useState({ id: '', event: '', hours: 0, note: '' });

  const fetchVolunteerHours = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('/api/admin/hours', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVolunteerHours(response.data);
      setFilteredHours(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const applyFilter = () => {
    let filtered = volunteerHours;
    if (filter.event) {
      filtered = filtered.filter((hour) => hour.event === filter.event);
    }
    if (filter.volunteer) {
      filtered = filtered.filter((hour) => hour.userId.fullName === filter.volunteer);
    }
    setFilteredHours(filtered);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/api/admin/modify-hours/${editForm.id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchVolunteerHours();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (report) => {
    setEditForm({ id: report._id, event: report.event, hours: report.hours, note: report.note });
  };

  useEffect(() => {
    fetchVolunteerHours();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter]);

  const calculateTotalHours = (userId) => {
    return volunteerHours
      .filter((hour) => hour.userId._id === userId)
      .reduce((total, hour) => total + hour.hours, 0);
  };

  return (
    <div>
      <h3>Admin Dashboard</h3>
      <div>
        <input name="event" type="text" placeholder="Filter by Event" onChange={handleFilterChange} />
        <input name="volunteer" type="text" placeholder="Filter by Volunteer" onChange={handleFilterChange} />
      </div>
      <ul>
        {filteredHours.map((report) => (
          <li key={report._id}>
            Volunteer: {report.userId.fullName}, Event: {report.event}, Hours: {report.hours}, Note: {report.note}
            <button onClick={() => handleEditClick(report)}>Edit</button>
          </li>
        ))}
      </ul>
      <h3>Total Hours by Volunteer</h3>
      <ul>
        {Array.from(new Set(volunteerHours.map((hour) => hour.userId._id))).map((userId) => (
          <li key={userId}>
            Volunteer: {volunteerHours.find((hour) => hour.userId._id === userId).userId.fullName}, Total Hours: {calculateTotalHours(userId)}
          </li>
        ))}
      </ul>
      <h3>Edit Volunteer Hours</h3>
      <form onSubmit={handleEditSubmit}>
        <input name="event" type="text" value={editForm.event} onChange={handleEditChange} />
        <input name="hours" type="number" value={editForm.hours} onChange={handleEditChange} />
        <input name="note" type="text" value={editForm.note} onChange={handleEditChange} />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default AdminDashboard;