import { generateWeather, calculatePoints} from '../helpers/dataFiller.js';

export function generateRatings(numEntries) {
  const ratings = [];
  const pisteIDs = ["65d72695810ef4ec15cf9c03", "65d72695810ef4ec15cf9c03", "65d7e95a0f5e14fc13cb9b08", "65d884950b4e04ec1c9faa0d"];

  for (let i = 0; i < numEntries; i++) {
    const year = 2023; // Year is locked to 2023
    const month = Math.floor(Math.random() * 12) + 1; // Random month between 1 and 12
    const day = Math.floor(Math.random() * 28) + 1; // Random day between 1 and 28
    const hours = Math.floor(Math.random() * (16 - 9 + 1)) + 9; // Random hour between 9 and 16
    const minutes = Math.floor(Math.random() * 60); // Random minute between 0 and 59

    const time = new Date(year, month - 1, day, hours, minutes);
    const weather = generateWeather();
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