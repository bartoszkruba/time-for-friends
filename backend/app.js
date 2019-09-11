const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 8080;

// Allowing CORS
app.use(cors());

// Body parser for JSON
app.use(bodyParser.json());

// Logging request
app.use(morgan('combined'));

// Starting server
(async () => {
  try {
    await mongoose.connect('mongodb://localhost/time_for_friends', {useNewUrlParser: true, useUnifiedTopology: true});
    await app.listen(PORT);
    console.log(`Listening on ${PORT}`);
  } catch (e) {
    console.log(e);
  }
})();

