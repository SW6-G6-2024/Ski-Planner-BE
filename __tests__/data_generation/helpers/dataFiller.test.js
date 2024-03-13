import { generateWeather, calculatePoints } from "../../../data_generation/helpers/dataFiller";


describe('generateWeather function', () => {
  test('should generate weather conditions between the correct bounds', () => {
    const weather = generateWeather(new Date());
    expect(weather.temperature).toBeGreaterThanOrEqual(-8);
    expect(weather.temperature).toBeLessThanOrEqual(8);
    expect(weather.weatherCode).toBeDefined();
    expect(weather.windSpeed).toBeGreaterThanOrEqual(5);
    expect(weather.windSpeed).toBeLessThanOrEqual(25);
    expect(weather.windDirection).toBeGreaterThanOrEqual(0);
    expect(weather.windDirection).toBeLessThanOrEqual(359);
    expect(weather.snowfall).toBeGreaterThanOrEqual(0);
    expect(weather.snowfall).toBeLessThanOrEqual(10);
    expect(weather.snowDepth).toBeGreaterThanOrEqual(40);
    expect(weather.snowDepth).toBeLessThanOrEqual(300);
    expect(weather.downpour).toBeGreaterThanOrEqual(0);
    expect(weather.downpour).toBeLessThanOrEqual(10);
    expect(weather.visibility).toBeGreaterThanOrEqual(500);
    expect(weather.visibility).toBeLessThanOrEqual(2000);
  });
});

describe('calculatePoints function', () => {
  test('should return a number between 1 and 5', () => {
    const weather = {
      temperature: 0,
      windSpeed: 10,
      snowfall: 5,
      downpour: 5,
      snowDepth: 150,
      visibility: 1000,
    };
    const points = calculatePoints(weather);
    expect(points).toBeGreaterThanOrEqual(1);
    expect(points).toBeLessThanOrEqual(5);
  });
});