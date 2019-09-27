const Timezone = require('../../models/Timezone');
const fetch = require("node-fetch");
const cities = require('cities.json');

module.exports.timezones = async () => await Timezone.find({});

module.exports.cityTimezone = async ({country, city}) => {
  let cityRegex = new RegExp(city, "i");
  let countryRegex = new RegExp(country, "i");

  const found = cities.find(city => {
    return city.name.match(cityRegex) && city.country.match(countryRegex)
  });

  if (found) {

    const params = new URLSearchParams({
      lat: found.lat,
      lng: found.lng,
      username: "nawajo"
    });

    const ENDPOINT = `http://api.geonames.org/timezoneJSON?${params.toString()}`;
    try {
      const payload = await fetch(ENDPOINT).then(res => res.json());
      console.log(payload);
      return payload.timezoneId ? payload.timezoneId : "" ;
    } catch (e) {
      console.log(e);
      return "";
    }
  } else {
    return ""
  }
};

