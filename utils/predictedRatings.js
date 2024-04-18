import axios from "axios";
import getPisteDirection from "./getPisteDirection.js"
import env from '../config/keys.js';
import getLatestArrayElement from "./getLatestArrayElement.js";

const client = axios.create({
  baseURL: env.ratingPredictionUrl,
  timeout: 2000,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function getPredictedRatings(body, weather) {
  try {
    const req = {
      'pisteList':
        body.elements.map((element) => {
          return {
            'id': element.id,
            'direction': getPisteDirection(element.geometry)
          }
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
    const response = await client.post('ratings/predict', req);
    if (response.status !== 200) {
      throw new Error('Failed to get predicted ratings');
    }
    return response.data;
  } catch (error) {
    console.error('Error getting predicted ratings', error);
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
