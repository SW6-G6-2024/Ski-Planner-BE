async function getCurrentWeather(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,rain,snowfall,weather_code,wind_speed_10m,wind_direction_10m&hourly=snow_depth,visibility&start_date=2024-03-21&end_date=2024-03-21`;
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