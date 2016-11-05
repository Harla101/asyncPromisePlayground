const request = require('request')
const Promise = require("bluebird");

function getAfricanCaptials() {
  request('https://omaze.s3.amazonaws.com/web/common/assets/json/capital_cities.json', function (error, response, body) {
    if (!error && response.statusCode === 200) {
      const africanCapitals = JSON.parse(body).filter(function (result) {
        return result.ContinentName === 'Africa';
      });
      coordsToURLStr(africanCapitals)
    }
  });
}

// helper function to convert capitalCities results from API to usable format for googleAPI call parameters
function coordsToURLStr(capitalCities) {
  let coordsStr = '';
  capitalCities.forEach(function (city) {
    coordsStr += city.CapitalLatitude + ',' + city.CapitalLongitude + '|';
  });
  // remove the excess '|' from coordsStr
  getElevationsFrom(coordsStr.slice(0, -1))
}

// API key:AIzaSyA3T7NNeL_dZtEo83tVH36zy_jPVvPuL_Q
function getElevationsFrom(coordinates) {
  request('https://maps.googleapis.com/maps/api/elevation/json?locations=' + coordinates + '&key=AIzaSyA3T7NNeL_dZtEo83tVH36zy_jPVvPuL_Q', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const elevations = JSON.parse(body).results.map(function (result) {
        return result.elevation
      })
      sortElevationsDescending(elevations)
    }
  })
}


// helper function to sort elevations from greatest to lowest (descending)
function sortElevationsDescending(elevations) {
  const elevationsDescending = elevations.map(function (data) {
    return data
  });
  elevationsDescending.sort(function (a, b) {
    return b - a
  })
  console.log(elevationsDescending);
  return elevationsDescending;
}

function main() {
  getAfricanCaptials();
}

main();
