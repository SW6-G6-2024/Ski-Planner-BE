import PistesModel from '../models/Pistes.js';
import { generateWeather, calculatePoints } from './helpers/dataFiller.js';
import { daysInMonth, getWinterMonth } from './utils/dates.js';
import getPistes from './utils/getPistes.js';

/**
 * Generates an array of ratings based on generated weather and time
 * @param {Number} numEntries number of ratings to generate for each piste
 * @returns {Promise<Array<Rating>>} array of ratings
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
 * @param {Piste} piste object containing specific information for a single piste instance
 * @returns {Rating} rating object
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