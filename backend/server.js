// initialize the server
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// import firebase and cloudinary configs
const firebase = require('./config/firebase');
const cloudinary = require('./config/cloudinary');

const app = express();

// middleware
app.use(cors()); // allow cross-origin requests
app.use(express.json()); // parse json bodies

// routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});