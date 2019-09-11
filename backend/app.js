const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/time_for_friends';

// Allowing CORS
app.use(cors());

// Body parser for JSON
app.use(bodyParser.json());

// Logging request
app.use(morgan('combined'));

// Starting server
(async () => {
  try {
    await mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
    await app.listen(PORT);
    console.log(`Listening on ${PORT}`);
  } catch (e) {
    console.log(e);
  }
})();

