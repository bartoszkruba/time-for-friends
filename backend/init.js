const moment = require('moment-timezone');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Timezone = require('./models/Timezone');
const User = require('./models/User');
const Friend = require('./models/Friend');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/time_for_friends';

const timezones = [
  "Asia/Tokyo",
  "Asia/Magadan",
  "Asia/Vladivostok",
  "Asia/Bangkok",
  "Asia/Rangoon",
  "Asia/Hong_Kong",
  "Asia/Kolkata",
  "Asia/Baghdad",
  "Asia/Tehran",
  "Australia/Sydney",
  "Europe/Moscow",
  "Europe/Helsinki",
  "Europe/Stockholm",
  "Europe/London",
  "Brazil/West",
  "America/New_York",
  "America/Los_Angeles",
  "America/Tijuana",
  "America/Santiago",
  "Pacific/Honolulu"
];

const cities = [
  "Tokyo",
  "Magadan",
  "Vladivostok",
  "Bangkok",
  "Rangoon",
  "Hong Kong",
  "Kolkata",
  "Bagdad",
  "Tehran",
  "Sydney",
  "Moscow",
  "Helsinki",
  "Stockholm",
  "London",
  "Brasilia",
  "New York",
  "Los Angeles",
  "Tijuana",
  "Santiago",
  "Honolulu"
];

const countries = [
  "Japan",
  "Russia",
  "Russia",
  "Thailand",
  "Burma",
  "China",
  "India",
  "Iraq",
  "Iran",
  "Australia",
  "Russia",
  "Finland",
  "Sweden",
  "Great Britain",
  "Brazil",
  "United States",
  "United States",
  "Mexico",
  "Cuba",
  "Hawaii"
];

const persons = [{"firstName": "Carmina", "lastName": "Cossans"},
  {"firstName": "Aviva", "lastName": "Meuse"},
  {"firstName": "Husein", "lastName": "Talloe"},
  {"firstName": "Any", "lastName": "Behnen"},
  {"firstName": "Sutherland", "lastName": "Duigan"},
  {"firstName": "Joaquin", "lastName": "Pennazzi"},
  {"firstName": "Byron", "lastName": "Garth"},
  {"firstName": "Elane", "lastName": "Rahl"},
  {"firstName": "Matteo", "lastName": "Blooman"},
  {"firstName": "Jourdain", "lastName": "Rodda"},
  {"firstName": "Mirilla", "lastName": "Swaysland"},
  {"firstName": "Rasla", "lastName": "Semper"},
  {"firstName": "Patty", "lastName": "Allabarton"},
  {"firstName": "Cash", "lastName": "Grover"},
  {"firstName": "Bradan", "lastName": "Van Der Weedenburg"},
  {"firstName": "Conn", "lastName": "Rosengart"},
  {"firstName": "Julian", "lastName": "Connew"},
  {"firstName": "Spike", "lastName": "Bum"},
  {"firstName": "Zelda", "lastName": "Charlson"},
  {"firstName": "Josey", "lastName": "Rex"}];

(async () => {
  try {
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
    for (name of moment.tz.names()) {
      await saveTimezone(name);
    }

    console.log("Creating test account: email - test@email.com, password: password1234");
    password = await bcrypt.hash("password1234", 12);
    const user = await User({email: "test@email.com", password}).save();

    console.log('Adding mock friends...');
    for (let i = 0; i < 20; i++) {
      const timezone = await Timezone.findOne({name: timezones[i]});
      if (!timezone) {
        console.log(timezones[i])
      }
      const friend = await Friend({
        firstName: persons[i].firstName,
        lastName: persons[i].lastName,
        city: cities[i],
        country: countries[i],
        timezone: timezone._id,
        user: user._id
      }).save();
      user.friends.push(friend._id);
    }
    await user.save();
    console.log('done')
  } catch (e) {
    console.log(e);
  }
})();


const saveTimezone = async name => {
  const timezone = new Timezone({name});
  return timezone.save();
};



