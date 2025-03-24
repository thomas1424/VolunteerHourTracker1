const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const VolunteerHours = require('./models/VolunteerHours');
const Admin = require('./models/Admin');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/volunteer', { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, dateOfBirth, fullName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, dateOfBirth, fullName });
    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid email or password');
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { passcode } = req.body;
    const admin = await Admin.findOne({ passcode });
    if (!admin) {
      return res.status(400).send('Invalid passcode');
    }
    const token = jwt.sign({ adminId: admin._id, role: 'admin' }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send('Access denied');
  }
  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

app.post('/api/report-hours', authenticate, async (req, res) => {
  try {
    const { event, hours, note } = req.body;
    const volunteerHours = new VolunteerHours({ userId: req.user.userId, event, hours, note });
    await volunteerHours.save();
    res.status(201).send('Hours reported successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/api/volunteer/hours', authenticate, async (req, res) => {
  try {
    const volunteerHours = await VolunteerHours.find({ userId: req.user.userId });
    res.json(volunteerHours);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.get('/api/admin/hours', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }
  try {
    const volunteerHours = await VolunteerHours.find().populate('userId', 'fullName email');
    res.json(volunteerHours);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.put('/api/admin/modify-hours/:id', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Access denied');
  }
  try {
    const { event, hours, note } = req.body;
    const volunteerHours = await VolunteerHours.findById(req.params.id);
    if (!volunteerHours) {
      return res.status(404).send('Volunteer hours not found');
    }
    volunteerHours.event = event;
    volunteerHours.hours = hours;
    volunteerHours.note = note;
    await volunteerHours.save();
    res.status(200).send('Volunteer hours updated successfully');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});