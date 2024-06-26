import request from 'supertest';
import express from 'express';
import router from '../../routes/skiAreaRoutes.js';
import err from '../../utils/errorCodes.js';
import connectDb from '../fixtures/db.js';
import mongoose from 'mongoose';
import axios from 'axios';
import { jest } from '@jest/globals';
import overpassExampleData from '../fixtures/overpassExampleData.js';

const app = express();
app.use(express.json());
app.use('/api/ski-areas', router);

const PORT = 5124;
const server = app.listen(PORT);

let db;
beforeAll(async () => {
  db = await connectDb();
});

describe('ski area routes', () => {
  let skiArea = {
    name: 'Test Ski Area',
    country: 'Test Country',
    region: 'Test Region',
    bounds: [1, 2, 3, 4],
    pistes: [],
    lifts: [],
    facilities: []
  };

  let id;

  beforeAll(async () => {
    axios.post = jest.fn().mockResolvedValue({data: overpassExampleData});
    await db.collection('ski-areas').insertOne(skiArea);
    const skiAreaInstance = await db.collection('ski-areas').findOne({ name: 'Test Ski Area' });
    id = skiAreaInstance._id;
  });

  test('should return a ski area by ID', async () => {

    const response = await request(app)
      .get('/api/ski-areas/' + id);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      skiArea: {
        name: skiArea.name,
        country: skiArea.country,
        region: skiArea.region,
        bounds: skiArea.bounds,
        pistes: skiArea.pistes,
        lifts: skiArea.lifts,
        facilities: skiArea.facilities
      },
      geoJson: { type: 'FeatureCollection' }
    });
  });

  test('should return error when id is invalid', async () => {
    const response = await request(app)
      .get('/api/ski-areas/123');
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(err.general.invalidId('ski area id'));
  });

  test('should return error when ski area is not found', async () => {
    const response = await request(app)
      .get('/api/ski-areas/5f9f6c3f9d5c1c2a3c3e3c3d');
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(err.skiArea.notFound);
  });

  test('should return 500 when overpass api fails', async () => {
    axios.post = jest.fn().mockResolvedValue({data: null});
    const response = await request(app)
      .get('/api/ski-areas/' + id);
    expect(response.statusCode).toBe(500);
    expect(response.body).toMatchObject(err.routeGeneration.overpassApiError);
  });
});

afterAll(async () => {
  // You´re my wonderwall
  await db.collection('ski-areas').deleteMany({});
  await db.collection('pistes').deleteMany({});
  await mongoose.connection.close();
  server.close();
});