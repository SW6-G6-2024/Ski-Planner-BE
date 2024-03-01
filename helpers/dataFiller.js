// Function assigns weights to weather codes based on their impact on skiing conditions
function assignWeightForWeatherCodes(weatherCode) {
  switch (weatherCode) {
    case 0:
      return 10; // Clear sky
    case 1:
    case 2:
    case 3:
      return 9; // Mainly clear, partly cloudy, and overcast
    case 45:
    case 48:
      return 8; // Fog and depositing rime fog
    case 51:
    case 53:
    case 55:
      return 7; // Drizzle: Light, moderate, and dense intensity - Adjusted weight
    case 56:
    case 57:
      return 6; // Freezing Drizzle: Light and dense intensity
    case 61:
    case 63:
    case 65:
      return 5; // Rain: Slight, moderate and heavy intensity
    case 66:
    case 67:
      return 4; // Freezing Rain: Light and heavy intensity
    case 71:
    case 73:
    case 75:
      return 3; // Snow fall: Slight, moderate, and heavy intensity
    case 77:
      return 2; // Snow grains
    case 80:
    case 81:
    case 82:
      return 2; // Rain showers: Slight, moderate, and violent
    case 85:
    case 86:
      return 1; // Snow showers: slight and heavy
    case 95:
    case 96:
    case 99:
      return 1; // Thunderstorm: Slight or moderate 
    default:
      return 0; // Unknown weather code
  }
}

// Function to generate random weather data for ratings
function generateWeather() {
  const weatherCodes = [
    0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99
  ];
  const randomIndex = Math.floor(Math.random() * weatherCodes.length);
  const selectedWeatherCode = weatherCodes[randomIndex];

  return {
    temperature: Math.random() * (5 - (-15)) - 15, // Random temperature between -15 and 5
    weatherCode: selectedWeatherCode, // Random weather code from defined list
    windSpeed: Math.random() * (50 - 5) + 5, // Random wind speed between 5 and 50 km/h
    windDirection: Math.floor(Math.random() * 360), // Random wind direction between 0 and 359 degrees
    snowfall: Math.random() * 10, // Random snowfall between 0 and 10 cm
    snowDepth: (Math.random() * 200) / 100, // Random snow depth between 0 and 2 meters
    visibility: Math.random() * 1000 // Random visibility between 0 and 1000 meters
  };
}

// Function that calculates points based on weather and time
function calculatePoints(weather, time) {
  const weatherWeight = assignWeightForWeatherCodes(weather.weatherCode); // Weather is weighted based on weather code
  const temperatureWeight = 2 * (10 - Math.abs(weather.temperature + 10)); // Temperature is weighted with a factor of 2
  const visibilityWeight = 2 * (weather.visibility / 100); // Visibility is weighted with a factor of 2
  const timeWeight = (10 - (Math.abs(time.getHours() - 12) / 3)) * 1.5; // Time is weighted with a factor of 1.5
  const snowDepthWeight = 1.5 * weather.snowDepth; // Snow depth is weighted with a factor of 1.5
  const snowfallWeight = 1.5 * weather.snowfall; // Snowfall is weighted with a factor of 1.5
  const windSpeedWeight = 0.5 * (10 - (weather.windSpeed / 10)); // Wind speed is weighted with a factor of 0.5

  // Calculate total points with adjusted weights
  const totalPoints = (weatherWeight + temperatureWeight + timeWeight + snowDepthWeight + visibilityWeight + snowfallWeight + windSpeedWeight) / 11.5;
  // Normalize points to a scale of 1-5
  const normalizedPoints = Math.min(5, Math.max(1, totalPoints));

  return Math.round(normalizedPoints);
}

export { generateWeather, calculatePoints};