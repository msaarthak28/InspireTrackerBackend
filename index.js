// server/index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Environment variables
const username = process.env.MONGODB_USER;
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const cluster = process.env.MONGODB_CLUSTER;
const dbName = process.env.MONGODB_DB || 'test';

// MongoDB connection string
const mongoUri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority&appName=InspirePDP`;

// Connect to MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Atom Schema and Model
const atomSchema = new mongoose.Schema({
  name: String,
  status: String,
  developedBy: String,
});

const Atom = mongoose.model('Atom', atomSchema);

// Get all atoms
app.get('/atoms', async (req, res) => {
  try {
    const atoms = await Atom.find();
    res.json(atoms);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new atom
app.post('/atoms', async (req, res) => {
  try {
    const newAtom = new Atom(req.body);
    await newAtom.save();
    res.status(201).json(newAtom);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an existing atom
app.put('/atoms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedAtom = await Atom.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedAtom);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
