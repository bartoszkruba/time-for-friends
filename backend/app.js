const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');

const graphqlSchema = require('./graphql/schema');
const graphqlRootResolver = require('./graphql/resolvers/resolversRoot');

const app = express();

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/time_for_friends';

// Allowing CORS
app.use(cors());

// Body parser for JSON
app.use(bodyParser.json());

// GraphlQL
app.use('/graphql', graphqlHttp({
  schema: graphqlSchema,
  rootValue: graphqlRootResolver,
  graphiql: true,
  formatError(err) {
    console.log(err);
  }
}));

// Starting server
(async () => {
  try {
    // Connecting to MongoDB
    await mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

    await app.listen(PORT);
    console.log(`Listening on ${PORT}`);
  } catch (e) {
    console.log(e);
  }
})();

