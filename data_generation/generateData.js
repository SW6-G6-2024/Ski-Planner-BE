import PistesModel from '../models/Pistes.js';
import { generateWeather, calculatePoints } from './helpers/dataFiller.js';
import { daysInMonth, getWinterMonth } from './utils/dates.js';
import getPistes from './utils/getPistes.js';

/**
 * Generates an array of ratings based on generated weather and time
 * @param {Number} numEntries number of ratings to generate for each piste
 * @returns {Array<rating>} array of ratings
 */
async function generateRatings(numEntries, test = false) {
  const ratings = [];
  let pistes;
  if (!test) {
    pistes = await getPistes();
  } else {
    pistes = await PistesModel.find({});
  }

  for (let i = 0; i < pistes.length; i++) {
    for (let j = 0; j < numEntries; j++) {
      ratings.push(getRating(pistes[i]));
    }
  }

  return ratings;
}

export default generateRatings;

/**
 * Generates a rating for a single piste instance based on generated weather and time
 * @param {piste} piste object containing specific information for a single piste instance
 * @returns {rating} rating object
 */
function getRating(piste) {
  const year = 2023; // Year is locked to 2023
  const month = getWinterMonth(); // Random month between nov and mar
  const day = Math.floor(Math.random() * daysInMonth(month, year)) + 1; // Random day between 1 and length of month
  const hours = Math.floor(Math.random() * (17 - 9 + 1)) + 9; // Random hour between 9 and 17
  const minutes = Math.floor(Math.random() * 60); // Random minute between 0 and 59
  const time = new Date(year, month - 1, day, hours, minutes);
  const weather = generateWeather(time);
  const points = calculatePoints(weather, time, piste);

  const rating = {
    piste: piste,
    user: null,
    points: points,
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    day: time.getDate(),
    hours: time.getHours(),
    minutes: time.getMinutes(),
    weather: weather
  };

  return rating;
}





/**
 * @typedef {object} rating
 * @property {piste} piste piste object
 * @property {string} user user id
 * @property {Number} points points for the rating
 * @property {Number} year year of the rating
 * @property {Number} month month of the rating
 * @property {Number} day day of the rating
 * @property {Number} hours hours of the rating
 * @property {Number} minutes minutes of the rating
 * @property {weather} weather weather object
 */

/**
 * @typedef {object} weather
 * @property {Number} code weather code
 * @property {Number} temperature temperature in celsius
 * @property {Number} visibility visibility in meters
 * @property {Number} windDirection wind direction in degrees
 * @property {Number} windSpeed wind speed (km/h)
 * @property {Number} snowfall snowfall in cm
 * @property {Number} snowDepth snow depth in cm
 * @property {Number} downpour downpour in mm
 */

/**
 * @typedef {object} piste
 * @property {string} name name of the piste
 * @property {string} direction direction of the piste
 * @property {Number} id id of the piste
 * @property {string} skiArea id for ski area of the piste
 */