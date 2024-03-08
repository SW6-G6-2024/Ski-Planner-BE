// Function assigns weights to weather codes based on their impact on skiing conditions
export function assignWeightForWeatherCodes(weatherCode) {
  switch (weatherCode) {
    case 0: // Clear sky
      return {
        weight: 1,
        wspeed: 0.8,
        snowfall: 0,
        downpour: 0,
      };
    case 1: // Mainly clear
      return {
        weight: 0.9,
        wspeed: 0.9,
        snowfall: 0,
        downpour: 0,
      };
    case 2: // Partly cloudy
      return {
        weight: 0.9,
        wspeed: 1,
        snowfall: 0,
        downpour: 0,
      };
    case 3: // Overcast
      return {
        weight: 0 - 9,
        wspeed: 1.1,
        snowfall: 0,
        downpour: 0,
      };
    case 45:
    case 48: // Fog and depositing rime fog
      return {
        weight: 0.8,
        wspeed: 0.4,
        snowfall: 0,
        downpour: 0,
      };
    case 51: // Drizzle: Light
      return {
        weight: 0.7,
        wspeed: 0.7,
        snowfall: 0,
        downpour: 0.3,
      }
    case 53: // Drizzle: Moderate
      return {
        weight: 0.7,
        wspeed: 0.7,
        snowfall: 0,
        downpour: 0.5,
      }
    case 55: // Drizzle: Dense intensity
      return {
        weight: 0.7,
        wspeed: 0.7,
        snowfall: 0.7,
      }
    case 56: // Freezing Drizzle: Light intensity
      return {
        weight: 0.6,
        wspeed: 0.7,
        snowfall: 0,
        downpour: 0.3,
      }
    case 57: // Freezing Drizzle: Heavy intensity
      return {
        weight: 0.6,
        wspeed: 0.7,
        snowfall: 0,
        downpour: 0.7,
      }
    case 61: // Rain: Slight
      return {
        weight: 0.5,
        wspeed: 0.6,
        snowfall: 0.9,
      }
    case 63: // Rain: Moderate
      return {
        weight: 0.5,
        wspeed: 0.6,
        snowfall: 0,
        downpour: 1,
      }
    case 65: // Rain: Heavy
      return {
        weight: 0.5,
        wspeed: 0.6,
        snowfall: 0,
        downpour: 1.1,
      }
    case 66: // Freezing Rain: Light
      return {
        weight: 0.4,
        wspeed: 0.6,
        snowfall: 0,
        downpour: 0.9,
      }
    case 67: // Freezing Rain: Heavy
      return {
        weight: 0.4,
        wspeed: 0.6,
        snowfall: 0,
        downpour: 1.1,
      }
    case 71: // Snow fall: Slight
      return {
        weight: 0.8,
        wspeed: 0.5,
        snowfall: 1,
        downpour: 0,
      }
    case 73: // Snow fall: Moderate
      return {
        weight: 0.8,
        wspeed: 0.7,
        snowfall: 1,
        downpour: 0,
      }
    case 75: // Snow fall: Heavy
      return {
        weight: 0.6,
        wspeed: 0.7,
        snowfall: 1,
        downpour: 0,
      }
    case 77: // Snow grains
      return {
        weight: 0.2,
        wspeed: 0.7,
        snowfall: 1,
        downpour: 0,
      }
    case 80: // Rain showers: Slight
      return {
        weight: 0.2,
        wspeed: 0.6,
        snowfall: 0,
        downpour: 1.3,
      }
    case 81: // Rain showers: Moderate
      return {
        weight: 0.2,
        wspeed: 0.6,
        snowfall: 0,
        downpour: 1.5,
      }
    case 82: // Rain showers: Violent
      return {
        weight: 0.1,
        wspeed: 0.6,
        snowfall: 0,
        downpour: 1.7,
      }
    case 85: // Snow showers: Slight
      return {
        weight: 0.4,
        wspeed: 0.7,
        snowfall: 1,
        downpour: 0,
      }
    case 86: // Snow showers: Heavy
      return {
        weight: 0.2,
        wspeed: 0.7,
        snowfall: 1,
        downpour: 0,
      }
    case 95: // Thunderstorm: Slight or moderate
      return {
        weight: 0.2,
        wspeed: 0.6,
        snowfall: 0,
        downpour: 0,
      }
    case 96: // Thunderstorm with slight hail
      return {
        weight: 0.1,
        wspeed: 0.6,
        snowfall: 0,
        downpour: 0.7,
      }
    case 99: // Thunderstorm with heavy hail
      return {
        weight: 0.1,
        wspeed: 0.6,
        snowfall: 0,
        downpour: 0.9,
      }
    default:
      return 0; // Unkown weather code
  }
}
