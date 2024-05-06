import PistesModel from '../models/Pistes.js';
import { generateWeather, calculatePoints } from './helpers/dataFiller.js';
import { daysInMonth, getWinterMonth } from './utils/dates.js';
import getPistes from './utils/getPistes.js';

/**
 * Generates an array of ratings based on generated weather and time
 * @param {Number} numOfInstances number of ratings to generate for each piste
 * @returns {Promise<Array<Rating>>} array of ratings
 */
async function generateRatings(numOfInstances, test = false) {
  let pistes;
  // istanbul ignore if
  if (!test) {
    // istanbul ignore next
    pistes = await getPistes();
  } else {
    pistes = await PistesModel.find({});
  }

  let environment;
  const dataEntry = [];

  for (let i = 0; i < numOfInstances; i++) {
    environment = getInstance();
    for (let j = 0; j < pistes.length; j++) {
      dataEntry.push({
        piste: pistes[j],
        user: null,
        points: calculatePoints(environment.weather, environment.time, pistes[j]),
        date: environment.date,
        weather: environment.weather,
      });
    }
  }
  return dataEntry;
}

export default generateRatings;

/**
 * Generates an instance of weather conditions and time
 */
function getInstance() {
  const year = 2023;
  const month = getWinterMonth();
  const date = {
    year: year,
    month: month,
    day: Math.floor(Math.random() * daysInMonth(month, year)) + 1,
    hours: Math.floor(Math.random() * (17 - 9 + 1)) + 9,
    minutes: Math.floor(Math.random() * 60)
  };
  const time = new Date(date.year, date.month - 1, date.day, date.hours, date.minutes);
  const weather = generateWeather(time);

  return {
    year: year,
    month: month,
    date: date,
    time: time,
    weather: weather
  };
}