//Dependencies
const express = require("express");
require('dotenv').config({ path: './config/config.env'});
require('./utils/mongodb')
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

//variables default
const PORT = process.env.POST || 5000;

//Instantiate app
const app = express();

//use json
app.use(express.json());
//use cookie
app.use(cookieParser());
//use cors
app.use(cors());

//app use routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

//listen server on port
app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
