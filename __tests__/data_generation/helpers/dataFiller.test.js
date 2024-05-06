import { generateWeather, calculatePoints } from "../../../data_generation/helpers/dataFiller";


describe('generateWeather function', () => {
  test('should generate weather conditions between the correct bounds', () => {
    const weather = generateWeather(new Date());
    expect(weather).toMatchObject({
      temperature: expect.any(Number),
      windSpeed: expect.any(Number),
      snowfall: expect.any(Number),
      rain: expect.any(Number),
      snowDepth: expect.any(Number),
      visibility: expect.any(Number),
      windDirection: expect.any(Number)
    });
  });
});

describe('calculatePoints function', () => {
  test('should return a number between 1 and 5', () => {
    const weather = {
      temperature: 0,
      windSpeed: 10,
      snowfall: 5,
      rain: 5,
      snowDepth: 150,
      visibility: 1000,
      windDirection: 180
    };
    const time = new Date(2023, 1, 1, 12, 0, 0);
    const piste = {
      id: 1,
      direction: 0,
      weight: 1
    };
    const points = calculatePoints(weather, time, piste);
    expect(points).toBeGreaterThanOrEqual(1);
    expect(points).toBeLessThanOrEqual(5);
  });
});