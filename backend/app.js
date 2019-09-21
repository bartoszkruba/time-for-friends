const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const moment = require('moment-timezone');

const graphqlSchema = require('./graphql/schema');
const graphqlRootResolver = require('./graphql/resolvers/resolversRoot');
const isAuth = require('./middleware/is-auth');
const Timezone = require('./models/Timezone');

const app = express();

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/time_for_friends';
const {GEOCODE_API_KEY} = require('./geocode/geocode');

// Allowing CORS
app.use(cors());

// Body parser for JSON
app.use(bodyParser.json());

// Checking if user is authenticated before passing request to graphql
app.use(isAuth);

// GraphlQL
app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlRootResolver,
  graphiql: true,
  // Handling GraphQL errors
  customFormatErrorFn(err) {
    console.log(err);
    if (!err.originalError) return err;
    const message = err.message || 'An error occurred.';
    const code = err.originalError.code || 500;
    const data = err.originalError.data;
    return {message, status: code, data}
  }
}));

// Starting server
(async () => {
  try {
    if (!GEOCODE_API_KEY) {
      console.log("Cannot start server without geocode api key");
      return
    }

    // Connecting to MongoDB
    await mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

    await app.listen(PORT);

    // Calculating current time for all timezones on 30 sec interval
    setInterval(async () => {
      const timezones = await Timezone.find({});
      timezones.forEach(t => {
        t.currentTime = moment.tz(t.name).format('YYYYMMDDHHmmss');
        t.save();
      });
    }, 1000);

    console.log(`Listening on ${PORT}`);
  } catch (e) {
    console.log(e);
  }
})();

