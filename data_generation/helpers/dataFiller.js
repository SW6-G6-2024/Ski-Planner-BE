import calculateWindEffect from "./calcWindEffect.js";
import { getTempAndVisWeight } from "./getTempAndVis.js";
import fs from "fs";

const weatherCodeWeights = JSON.parse(fs.readFileSync("data_generation/helpers/weatherCodes.json", "utf8"));

// Factors to be used when calculating points
const wsFactor = 1;
const tFactor = 2;
const sfFactor = 1;
const dpFactor = 1;
const sdFactor = 1.5;
const vFactor = 1.5;
const timeFactor = 0.15;

/**
 * Calculates the time factor for a given date object
 * @param {Date} time The time to calculate the factor for
 * @returns {Number} the time factor for the given time
 */
function getTimeFactor(time) {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const minSince9 = totalMinutes - 9 * 60;
  const factor = 1 - (minSince9 / (8 * 60)) * timeFactor;
  return factor;
}

/**
 * Generates a random weather object based on the given time
 * @param {Date} time The time to generate the weather for
 * @returns {import("../generateData.js").weather} a weather object with random values
 */ 
function generateWeather(time) {
  const weatherCodes = [
    { code: 0, weight: 14 }, // Clear
    { code: 1, weight: 9 }, // Mainly clear
    { code: 2, weight: 13}, // Partly cloudy
    { code: 3, weight: 12 }, // Overcast
    { code: 45, weight: 6 }, // Fog
    { code: 48, weight: 0.6 }, // Depositin rime fog
    { code: 51, weight: 1.4 }, // Drizzle: Light
    { code: 53, weight: 1 }, // Drizzle: Moderate
    { code: 55, weight: 0.2 }, // Drizzle: Dense intensity
    { code: 56, weight: 1 }, // Freezing Drizzle: Light intensity
    { code: 57, weight: 0.7 }, // Freezing Drizzle: Moderate intensity
    { code: 61, weight: 0.8 }, // Rain: Light
    { code: 63, weight: 0.3 }, // Rain: Moderate
    { code: 65, weight: 0.1 }, // Rain: Heavy
    { code: 66, weight: 0.3 }, // Freezing Rain: Light
    { code: 67, weight: 0.1 }, // Freezing Rain: Moderate
    { code: 71, weight: 9 }, // Snow fall: Light
    { code: 73, weight: 10 }, // Snow fall: Moderate
    { code: 75, weight: 5 }, // Snow fall: Heavy
    { code: 77, weight: 0.7 }, // Snow grains
    { code: 80, weight: 1.3 }, // Rain showers: Slight
    { code: 81, weight: 0.4 }, // Rain showers: Moderate
    { code: 82, weight: 0.1 }, // Rain showers: Violent
    { code: 85, weight: 8 }, // Snow showers: Slight
    { code: 86, weight: 5 }, // Snow showers: Heavy
    { code: 95, weight: 0 }, // Thunderstorm: Slight or moderate
    { code: 96, weight: 0 }, // Thunderstorm with slight hail
    { code: 99, weight: 0 } // Thunderstorm with heavy hail
  ];
  
  const totalWeight = weatherCodes.reduce((sum, { weight }) => sum + weight, 0);

  // Generate a random number between 0 and the total weight
  let randomWeight = Math.random() * totalWeight;

  // Iterate through the weatherCodes array to find the selected weather code based on weights
  let selectedWeatherCode;
  for (const { code, weight } of weatherCodes) {
    if (randomWeight < weight) {
      selectedWeatherCode = code;
      break;
    }
    randomWeight -= weight;
  }

  const weatherWeights = weatherCodeWeights[selectedWeatherCode.toString()];
  const temperatureWeights = getTempAndVisWeight(time, selectedWeatherCode);

  return {
    temperature: randn_bm(-30, 20, 1.15) * temperatureWeights.temp, // Random temperature between -8 and 8 degrees
    weatherCode: selectedWeatherCode, // Random weather code from defined list
    windSpeed: randn_bm(0, 70, 3.5) * weatherWeights.wspeed, // Random wind speed between 0 and 70 km/h
    windDirection: Math.floor(Math.random() * 360), // Random wind direction between 0 and 359 degrees
    snowfall: randn_bm(0, 10, 4) * weatherWeights.snowfall, // Random snowfall between 1 and 10 cm
    snowDepth: randn_bm(0, 1, 0.85), // Random snow depth between 0 and 1 meters
    rain: randn_bm(0, 5, 4.5) * weatherWeights.rain, // Random rain between 0 and 5 mm
    visibility: randn_bm(0, 25000, 0.25) * temperatureWeights.visibility // Random visibility between 0 and 25000 meters
  };
  
}

/**
 * Calculates the points for a given set of weather conditions
 * @param {import("../generateData.js").weather} weather The weather conditions to calculate the points for
 * @param {import("../generateData.js").piste} piste The piste to calculate the points for
 * @returns {Number} the points for the given weather conditions
 */
function calculatePoints(weather, time, piste) {
  // Generate a random number of points between 1 and 5 based on a normal distribution
  const points = Math.round(randn_bm(1, 5, 1));

  const wSpeedWeight = 1 - (weather.windSpeed * calculateWindEffect(weather.windDirection, piste.direction) / (25 * wsFactor));
  // Calculate the wind effect on the skiing conditions and multyiply it with the wind speed weight
  const windWeight = wSpeedWeight;
  const tempWeight = 1 - (Math.abs(weather.temperature / (30 * tFactor))); 
  const snowfallWeight = 1 - (weather.snowfall / (10 * sfFactor));
  const rainWeight = 1 - (weather.rain / (1 * dpFactor));
  const snowDepthWeight = 1 + (weather.snowDepth / (100 * sdFactor));
  const visibilityWeight = 1 + (weather.visibility / (25000 * vFactor));
  
  const timeWeight = getTimeFactor(time);
  

  const finalPoints = Math.round((points * windWeight * tempWeight * snowfallWeight * rainWeight * snowDepthWeight * visibilityWeight * timeWeight) * piste.weight);

  // Points can't exceed 5 or go below 1
  return Math.min(Math.max(1, finalPoints), 5);
}

/**
 * // Generates random numbers between bounds with a skew. Taken from: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
 * @param {Number} min Minimum bound
 * @param {Number} max Maximum bound
 * @param {Number} skew Skews the distribution. 1 is a normal distribution, lower than 1 is a right-skewed distribution, higher than 1 is a left-skewed distribution
 * @returns {Number} a random number between min and max with a skew
 */
function randn_bm(min, max, skew) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  /* istanbul ignore next */
  if (num > 1 || num < 0) 
    num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
  
  else{
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }
  return num;
}

export { generateWeather, calculatePoints, randn_bm };