const Timezone = require('../../models/Timezone');
const cities = require('cities.json');
const tzLookup = require('tz-lookup');

module.exports.timezones = async () => await Timezone.find({});

module.exports.cityTimezone = async ({country, city}) => {
  let cityRegex = new RegExp(city, "i");
  let countryRegex = new RegExp(country, "i");

  const found = cities.find(city => {
    return city.name.match(cityRegex) && city.country.match(countryRegex)
  });

  if (found) {
    try {
      return tzLookup(found.lat, found.lng)
    } catch (e) {
      console.log(e);
      return "";
    }
  } else {
    return ""
  }
};

