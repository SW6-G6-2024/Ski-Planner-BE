// Replace these with the actual latitude and longitude of your location
const latitude = '61.31400485';
const longitude = '12.1970495';

// Construct the API URL
const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,rain,snowfall,weather_code,wind_speed_10m,wind_direction_10m&hourly=snow_depth,visibility&start_date=2024-03-21&end_date=2024-03-21`;

// Function to fetch and display the current weather
async function getCurrentWeather() {
    return await fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        return data;
    })
    .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
    });
}

export default getCurrentWeather;