import axios from "axios";
import errorCodes from "../errorCodes.js";

/**
 * Call the Open-Meteo API to get the current weather
 * @param {*} lat latitude of the location
 * @param {*} lon longitude of the location
 * @returns {Promise<weather>}
 */
async function getCurrentWeather(lat, lon) {
  // Get the current date in the format YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);
  // Create the API URL 
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,rain,snowfall,weather_code,wind_speed_10m,wind_direction_10m&hourly=snow_depth,visibility&start_date=${today}&end_date=${today}`;
  let res;
  try {
    res = await axios.get(apiUrl);
  } catch (error) {
    //console.error('Error getting weather', error);
    throw errorCodes.routeGeneration.weatherError;
  }
  return res.data;
}

export default getCurrentWeather;

/**
 * @typedef {Object} weather
 * @property {Number} latitude The latitude of the location for which the weather is fetched
 * @property {Number} longitude The longitude of the location for which the weather is fetched
 * @property {Number} generationtime_ms The time in milliseconds it took to generate the weather data
 * @property {Number} utc_offset The UTC offset of the location
 * @property {String} timezone The timezone of the location
 * @property {String} timezone_abbreviation The timezone of the location abbreviated
 * @property {Number} elevation The elevation of the location in meters
 * @property {current_units} current_units The units of the current weather data
 * @property {current} current The current weather data
 * @property {hourly_units} hourly_units The units of the hourly weather data
 * @property {hourly} hourly The hourly weather data
 */

/**
 * @typedef {Object} current_units
 * @property {String} time The unit of the time (iso8601)
 * @property {String} interval The unit of the interval (s)
 * @property {String} temperature_2m The unit of the temperature (°C)
 * @property {String} rain The unit of the rain (mm)
 * @property {String} snowfall The unit of the snowfall (cm)
 * @property {String} weather_code The unit of the weather code (wmo code)
 * @property {String} wind_speed_10m The unit of the wind speed (km/h)
 * @property {String} wind_direction_10m The unit of the wind direction (°)
 */

/**
 * @typedef {Object} current
 * @property {Date} time The time of the current weather data
 * @property {Number} interval The interval of the current weather data
 * @property {Number} temperature_2m The temperature at 2m above ground
 * @property {Number} rain The amount of rain
 * @property {Number} snowfall The amount of snowfall
 * @property {Number} weather_code The weather code
 * @property {Number} wind_speed_10m The wind speed at 10m above ground
 * @property {Number} wind_direction_10m The wind direction at 10m above ground
 */

/**
 * @typedef {Object} hourly_units
 * @property {String} time The unit of the time (iso8601)
 * @property {String} snow_depth The unit of the snow depth (m)
 * @property {String} visibility The unit of the visibility (m)
 */

/**
 * @typedef {Object} hourly
 * @property {Date} time The time of the hourly weather data
 * @property {Number} snow_depth The snow depth
 * @property {Number} visibility The visibility
 */