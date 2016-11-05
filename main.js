const request = require('request');
const Promise = require('bluebird');

// helper function to sort elevations from greatest to lowest (descending)
function sortElevationsDescending(elevations) {
  const elevationsDescending = elevations.map(function (data) {
    return data;
  });
  elevationsDescending.sort(function (a, b) {
    return b - a;
  });
  return elevationsDescending;
}

// API key:AIzaSyA3T7NNeL_dZtEo83tVH36zy_jPVvPuL_Q
function getElevationsFrom(coordinates) {
  return new Promise(function (resolve, reject) {
    request('https://maps.googleapis.com/maps/api/elevation/json?locations=' + coordinates + '&key=AIzaSyA3T7NNeL_dZtEo83tVH36zy_jPVvPuL_Q', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const elevations = JSON.parse(body).results.map(function (result) {
          return result.elevation;
        });
        resolve(elevations);
      } else {
        reject(error);
      }
    });
  });
}

/* helper function to convert capitalCities results from API to usable
format for googleAPI call parameters */
function coordsToURLStr(capitalCities) {
  let coordsStr = '';
  capitalCities.forEach(function (city) {
    coordsStr += city.CapitalLatitude + ',' + city.CapitalLongitude + '|';
  });
  // removes the excess '|' from coordsStr
  return coordsStr.slice(0, -1);
}

function getAfricanCaptials() {
  return new Promise(function (resolve, reject) {
    request('https://omaze.s3.amazonaws.com/web/common/assets/json/capital_cities.json', function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const africanCapitals = JSON.parse(body).filter(function (result) {
          return result.ContinentName === 'Africa';
        });
        resolve(africanCapitals);
      } else {
        reject(error);
      }
    });
  });
}


function main() {
  getAfricanCaptials()
    .then(function (capitals) {
      return coordsToURLStr(capitals);
    })
    .then(function (URLStr) {
      return getElevationsFrom(URLStr);
    })
    .then(function (elevations) {
      return sortElevationsDescending(elevations);
    })
    .then(function (sortedElevations) {
      console.log(sortedElevations);
    })
    .catch(function (error) {
      console.log('Error: ', error);
    });
}

main();
