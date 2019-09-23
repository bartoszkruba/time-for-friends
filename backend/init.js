const moment = require('moment-timezone');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const NodeGeocoder = require('node-geocoder');

const Timezone = require('./models/Timezone');
const User = require('./models/User');
const Friend = require('./models/Friend');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/time_for_friends';
const GEOCODE_KEY = process.env.GEOCODE_API_KEY || null;

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
  "Pacific/Honolulu",
  "Africa/Johannesburg",
  "Africa/Cairo",
  "Africa/Lagos",
  "Africa/Kinshasa",
  "Africa/Casablanca",
  "America/Argentina/Buenos_Aires",
  "America/Argentina/San_Juan",
  "America/Lima",
  "America/Caracas",
  "America/Detroit",
  "America/Havana",
  "Australia/Perth",
  "Pacific/Chatham",
  "Singapore",
  "Asia/Dubai",
  "Poland",
  "Europe/Paris",
  "Europe/Rome",
  "Iceland",
  "Asia/Jakarta"
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
  "Honolulu",
  "Cape Town",
  "Cairo",
  "Abuja",
  "Kinshasa",
  "Casablanca",
  "Buenos Aires",
  "San Juan",
  "Cercado de Lima",
  "Caracas",
  "Detroit",
  "Havana",
  "Perth",
  "Chatham Island",
  "Singapore",
  "Dubai",
  "Warsaw",
  "Paris",
  "Rome",
  "Reykjavik",
  "Jakarta"
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
  "Hawaii",
  "South Africa",
  "Egypt",
  "Nigeria",
  "Congo, The Democratic Republic of the",
  "Morocco",
  "Argentina",
  "Argentina",
  "Peru",
  "Venezuela",
  "America",
  "Cuba",
  "Australia",
  "New Zealand",
  "Singapore",
  "United Arab Emirates",
  "Poland",
  "France",
  "Italy",
  "Iceland",
  "Indonesia"
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
  {"firstName": "Cash", "lastName": "Van Der Weedenburg"},
  {"firstName": "Conn", "lastName": "Rosengart"},
  {"firstName": "Julian", "lastName": "Connew"},
  {"firstName": "Spike", "lastName": "Bum"},
  {"firstName": "Zelda", "lastName": "Charlson"},
  {"firstName": "Cash", "lastName": "Rex"},
  {"firstName": "Cleveland", "lastName": "Whitwam"},
  {"firstName": "Nichole", "lastName": "Gooley"},
  {"firstName": "Othelia", "lastName": "Antonich"},
  {"firstName": "Barty", "lastName": "Hedworth"},
  {"firstName": "Euphemia", "lastName": "Bedder"},
  {"firstName": "Nicolis", "lastName": "Abilowitz"},
  {"firstName": "Dolorita", "lastName": "Berth"},
  {"firstName": "Emmi", "lastName": "Jinkinson"},
  {"firstName": "Roseann", "lastName": "Mahady"},
  {"firstName": "Jarvis", "lastName": "Bister"},
  {"firstName": "Lynnet", "lastName": "Janny"},
  {"firstName": "Sharlene", "lastName": "Degue"},
  {"firstName": "Wilt", "lastName": "Scranedge"},
  {"firstName": "Duffy", "lastName": "Walework"},
  {"firstName": "Griffie", "lastName": "Tripp"},
  {"firstName": "Nelle", "lastName": "Vanelli"},
  {"firstName": "Luciana", "lastName": "Bignell"},
  {"firstName": "Faulkner", "lastName": "Souness"},
  {"firstName": "Carline", "lastName": "Abramsky"},
  {"firstName": "Montgomery", "lastName": "Di Giacomettino"}];

(async () => {
  if (!GEOCODE_KEY) {
    console.log('Cannot initialize data without geocode api key');
    return;
  }

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
    for (let i = 0; i < 1; i++) {
      await addMockFriends(user);
    }
    await user.save();
    console.log('done');
    return;
  } catch (e) {
    console.log(e);
  }
})();


const addMockFriends = async user => {
  try {
    let options = {
      provider: "google",
      apiKey: GEOCODE_KEY,
    };

    let geocoder = NodeGeocoder(options);

    for (let i = 0; i < countries.length; i++) {
      const timezone = await Timezone.findOne({name: timezones[i]});
      if (!timezone) {
        console.log(timezones[i])
      }

      const geocodeResponse = await geocoder.geocode(cities[i] + " " + countries[i]);

      const friend = await Friend({
        firstName: persons[i].firstName,
        lastName: persons[i].lastName,
        city: cities[i],
        country: countries[i],
        lat: geocodeResponse[0].latitude,
        lng: geocodeResponse[0].longitude,
        timezone: timezone._id,
        user: user._id,
        workMarks: {
          from: 420,
          to: 960
        },
        sleepMarks: {
          from: 1320,
          to: 360
        }
      }).save();
      user.friends.push(friend._id);
    }
  } catch (e) {
    console.log(e);
  }
};

const saveTimezone = async name => {
  const timezone = new Timezone({name});
  return timezone.save();
};



