const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY || null;
const NodeGeocoder = require('node-geocoder');

let geocode;

getGeocode = () => {
  if (!geocode) {
    let options = {
      provider: "google",
      apiKey: GEOCODE_API_KEY,
    };
    geocode = NodeGeocoder(options);
  }

  return geocode;
};

module.exports.getCoordinatesForName = async name => {
  const geocodeResponse = await getGeocode().geocode(name);

  return {
    lat: geocodeResponse[0].latitude,
    lng: geocodeResponse[0].longitude,
  }
};

module.exports.GEOCODE_API_KEY = GEOCODE_API_KEY;