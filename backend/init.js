const moment = require('moment-timezone');
const mongoose = require('mongoose');

const Timezone = require('./models/Timezone');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/time_for_friends';

(async () => {
  console.log('Connecting to database...');

  mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

  console.log('Cleaning up database...');
  console.log('Removing all users...');
  await User.remove({});
  console.log("Removing old timezones...");
  await Timezone.remove({});
  console.log('Initializing timezones...');
  moment.tz.names().forEach(t => saveTimezone(t));
  Promise.resolve();
})();


const saveTimezone = async name => {
  const timezone = new Timezone({name});
  timezone.save();

  console.log(name + " saved");
};



