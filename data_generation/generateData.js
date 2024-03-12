import { generateWeather, calculatePoints} from './helpers/dataFiller.js';
import { daysInMonth } from './utils/dates.js';

/**
 * Generates an array of ratings based on generated weather and time
 * @param {number} numEntries 
 * @returns array of ratings
 */
export function generateRatings(numEntries) {
  const ratings = [];
  const pisteIDs = ["65d72695810ef4ec15cf9c03", "65d72695810ef4ec15cf9c03", "65d7e95a0f5e14fc13cb9b08", "65d884950b4e04ec1c9faa0d"];

  for (let i = 0; i < numEntries; i++) {
    const year = 2023; // Year is locked to 2023
    const month = Math.floor(Math.random() * 12) + 1; // Random month between 1 and 12
    const day = Math.floor(Math.random() * daysInMonth(month, year)) + 1; // Random day between 1 and length of month
    const hours = Math.floor(Math.random() * (17 - 9 + 1)) + 9; // Random hour between 9 and 17
    const minutes = Math.floor(Math.random() * 60); // Random minute between 0 and 59

    const time = new Date(year, month - 1, day, hours, minutes);
    const weather = generateWeather(time);
    const piste = pisteIDs[Math.floor(Math.random() * pisteIDs.length)];

    const points = calculatePoints(weather, time);

    const rating = {
      piste: piste,
      user: null,
      points: points,
      time: time,
      weather: weather
    };

    ratings.push(rating);
  }

  return ratings;
}