const moment = require('moment-timezone');
const mongoose = require('mongoose');

const Timezone = require('./models/Timezone');
const User = require('./models/User');
const Friend = require('./models/Friend');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/time_for_friends';

(async () => {
  console.log('Connecting to database...');

  await mongoose.connect(MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

  console.log('Cleaning up database...');
  console.log("Removing all friends...");
  await Friend.deleteMany({});
  console.log('Removing all users...');
  await User.deleteMany({});
  console.log("Removing all timezones...");
  await Timezone.deleteMany({});
  console.log('Initializing timezones...');
  for(name of moment.tz.names()){
    await saveTimezone(name);
  }
  console.log('done')
})();


const saveTimezone = async name => {
  const timezone = new Timezone({name});
  return timezone.save();
};



