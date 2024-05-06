import axios from "axios";
import getPisteDirection from "./getPisteDirection.js";
import env from '../../config/keys.js';
import getLatestArrayElement from "./getLatestArrayElement.js";
import errorCodes from "../errorCodes.js";

async function getPredictedRatings(body, weather) {
  if(!body.elements || !weather) {
    console.error('Invalid data for predicted ratings');
  }

  const req = {
    'pisteList':
      body.elements.map((element) => {
        return {
          'id': element.id,
          'direction': getPisteDirection(element.geometry)
        };
      }),
    'weather': {
      'temperature': weather.current.temperature_2m,
      'weatherCode': weather.current.weather_code,
      'windSpeed': weather.current.wind_speed_10m,
      'windDirection': weather.current.wind_direction_10m,
      'snowfall': weather.current.snowfall,
      'snowDepth': getLatestArrayElement(weather.hourly.snow_depth),
      'rain': weather.current.rain,
      'visibility': getLatestArrayElement(weather.hourly.visibility)
    },
    'date': {
      'year': new Date().getFullYear(),
      'month': new Date().getMonth() + 1,
      'day': new Date().getDate(),
      'hour': new Date().getHours(),
    }
  };
  try {
    const response = await axios.post(env.ratingPredictionUrl + '/ratings/predict', req);
    return response.data;
  } catch (error) {
    //console.error('Error getting predicted ratings', error);
    throw errorCodes.routeGeneration.predictionError;
  }
}


function consolidateRatingInGeoJSON(ratings, geoJson) {
  ratings.forEach(pisteInstance => {
    geoJson.elements.forEach(piste => {
      if (piste.id === pisteInstance.piste) {
        piste['rating'] = pisteInstance.rating;
      }
    });
  });
  return geoJson;
}

export { consolidateRatingInGeoJSON, getPredictedRatings };
