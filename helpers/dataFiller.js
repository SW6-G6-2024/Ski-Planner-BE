import weatherCodeWeights from "./weatherCodes.js";
import { getTempAndVisWeight } from "./getTempAndVis.js";

const wsFactor = 2.25;
const tFactor = 1.75;
const sfFactor = 2;
const dpFactor = 2.5;
const sdFactor = 1.5;
const vFactor = 1.75;

// Function to generate random weather data for ratings
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
    temperature: (Math.round((Math.random() * (8 - (-8)) - 8) * 10) / 10) * temperatureWeights.temp, // Random temperature between -8 and 8 degrees
    weatherCode: selectedWeatherCode, // Random weather code from defined list
    windSpeed: randn_bm(8, 25, 4) * weatherWeights.wspeed, // Random wind speed between 5 and 25 km/h
    windDirection: Math.floor(Math.random() * 360), // Random wind direction between 0 and 359 degrees
    snowfall: (Math.ceil(Math.random() * 10) + 1) * weatherWeights.snowfall, // Random snowfall between 1 and 10 cm
    snowDepth: randn_bm(40, 300, 3), // Random snow depth between 40 and 100 cm
    downpour: (Math.ceil(Math.random() * 10) + 1) * weatherWeights.downpour, // Random downpour between 1 and 10 mm
    visibility: (500 + Math.random() * 1500) * temperatureWeights.visibility // Random visibility between 500 and 2000 meters
  };
  
}

// Function that calculates points based on weather and time
function calculatePoints(weather) {
  const points = Math.round(randn_bm(1, 5, 1));
  //console.log("p: ", points)

  const wSpeedWeight = 1 - (weather.windSpeed / (25 * wsFactor));
  //console.log("ws: ", wSpeedWeight)
  const tempWeight = 1 - (Math.abs(weather.temperature / (16 * tFactor))); 
  //console.log("t: ", tempWeight)
  const snowfallWeight = 1 - (weather.snowfall / (10 * sfFactor));
  //console.log("sf: ",snowfallWeight)
  const downpourWeight = 1 - (weather.downpour / (10 * dpFactor));
  //console.log("dp: ",downpourWeight)
  const snowDepthWeight = 1 + (weather.snowDepth / (300 * sdFactor));
  //console.log("sd: ",snowDepthWeight)
  const visibilityWeight = 1 + (weather.visibility / (2000 * vFactor));
  //console.log("vis: ",visibilityWeight)
  //console.log("---------------------")

  const finalPoints = Math.round(points * wSpeedWeight * tempWeight * snowfallWeight * downpourWeight * snowDepthWeight * visibilityWeight);

  // Points can't exceed 5
  if (finalPoints > 5) {
    return 5;
  }
  else {
    return finalPoints;
  }
}

export { generateWeather, calculatePoints };

// Function to generate random numbers with a skew. Heavily inspired by https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randn_bm(min, max, skew) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) 
    num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
  
  else{
    num = Math.pow(num, skew); // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }
  return num;
}