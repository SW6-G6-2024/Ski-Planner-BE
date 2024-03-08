import { assignWeightForWeatherCodes } from "./weatherCodes.js";
import { getTempAndVisWeight } from "./getTempAndVis.js";

const wsFactor = 2;
const tFactor = 1.25;
const sfFactor = 2;
const dpFactor = 2.5;
const sdFactor = 1.25;
const vFactor = 1.5;

// Function to generate random weather data for ratings
function generateWeather(time) {
  const weatherCodes = [
    0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99
  ];

  const randomIndex = Math.floor(Math.random() * weatherCodes.length);
  const selectedWeatherCode = weatherCodes[randomIndex];

  const weatherWeights = assignWeightForWeatherCodes(selectedWeatherCode);
  const temperatureWeights = getTempAndVisWeight(time, selectedWeatherCode);

  return {
    temperature: (Math.random() * (15 - (-15)) - 15) * temperatureWeights.temp, // Random temperature between -15 and 15 degrees
    weatherCode: selectedWeatherCode, // Random weather code from defined list
    windSpeed: (Math.random() * (50 - 5) + 5) * weatherWeights.wspeed, // Random wind speed between 5 and 50 km/h
    windDirection: Math.floor(Math.random() * 360), // Random wind direction between 0 and 359 degrees
    snowfall: (Math.floor(Math.random() * 10) + 1) * weatherWeights.snowfall, // Random snowfall between 1 and 10 cm
    snowDepth: randn_bm(40, 300, 3), // Random snow depth between 40 and 100 cm
    downpour: (Math.floor(Math.random() * 10) + 1) * weatherWeights.downpour, // Random downpour between 1 and 10 mm
    visibility: (500 + Math.random() * 1500) * temperatureWeights.visibility // Random visibility between 500 and 2000 meters
  }
  
}

// Function that calculates points based on weather and time
function calculatePoints(weather) {
  const points = randn_bm(1, 5, 1)
  console.log("p: ", points)

  console.log(weather.snowDepth / (300 * sdFactor))

  const wSpeedWeight = 1 - (weather.windSpeed / (50 * wsFactor))
  console.log("ws: ", wSpeedWeight)
  const tempWeight = 1 - (Math.abs(weather.temperature / (15 * tFactor))) 
  console.log("t: ", tempWeight)
  const snowfallWeight = 1 - (weather.snowfall / (10 * sfFactor))
  console.log("sf: ",snowfallWeight)
  const downpourWeight = 1 - (weather.downpour / (10 * dpFactor))
  console.log("dp: ",downpourWeight)
  const snowDepthWeight = 1 + (weather.snowDepth / (300 * sdFactor))
  console.log("sd: ",snowDepthWeight)
  const visibilityWeight = 1 + (weather.visibility / (2000 * vFactor))
  console.log("vis: ",visibilityWeight)
  console.log("---------------------")

  const finalPoints = points * wSpeedWeight * tempWeight * snowfallWeight * downpourWeight * snowDepthWeight * visibilityWeight

  return finalPoints;
}

export { generateWeather, calculatePoints };

// Function to generate random numbers with a skew. Inspired by https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randn_bm(min, max, skew) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random()
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
  
  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0) 
    num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
  
  else{
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
  }
  return num
}