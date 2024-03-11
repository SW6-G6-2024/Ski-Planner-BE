// Define the weight data structure
const weightData = [
  { hours: 10, cloudy: false, temp: 0.5, visibility: 0.9 },
  { hours: 10, cloudy: true, temp: 0.8, visibility: 0.7 },
  { hours: 12, cloudy: false, temp: 0.75, visibility: 1 },
  { hours: 12, cloudy: true, temp: 0.9, visibility: 0.8 },
  { hours: 14, cloudy: false, temp: 1, visibility: 1 },
  { hours: 14, cloudy: true, temp: 1, visibility: 0.9 },
  { hours: 16, cloudy: false, temp: 0.9, visibility: 0.9 },
  { hours: 16, cloudy: true, temp: 0.8, visibility: 0.8 },
  { hours: Infinity, cloudy: false, temp: 0.7, visibility: 0.8 },
  { hours: Infinity, cloudy: true, temp: 0.7, visibility: 0.7 }
];

// Function that returns a weight based 
export function getTempAndVisWeight(time, weatherCode) {
  const hours = time.getHours();
  const cloudy = weatherCode < 2;

  // Find the appropriate weight based on the time and weather conditions
  const weight = weightData.find(data => hours < data.hours && cloudy === data.cloudy);

  // Return the found weight
  return {
    temp: weight.temp,
    visibility: weight.visibility
  };
}