import tzLookup from 'tz-lookup'
import cities from 'cities.json'

export default (city, country) => {
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
      return null;
    }
  } else {
    return null
  }
}