import request from 'supertest';
import express from 'express';
import router from '../../routes/ratingRoutes.js'; // Adjust the import path to where your ratingRoutes is located
import err from '../../utils/errorCodes.js';
import connectDb from '../fixtures/db.js'; // Assuming this connects to a test database
import mongoose from 'mongoose';
import axios from 'axios';
import { jest } from '@jest/globals';
import weatherData from '../fixtures/weatherData.js';

const app = express();
app.use(express.json());
app.use('/api/rate-piste', router);

const PORT = 5125;
const server = app.listen(PORT);

let db;
beforeAll(async () => {
  db = await connectDb();
});

describe('Rating routes', () => {
  let piste;

  beforeAll(async () => {
    const skiArea = await db.collection('ski-areas').insertOne({
      name: 'Test Ski Area',
      bounds: [1.0, 2.0, 3.0, 4.0],
    });
    
    const insertedPiste = await db.collection('pistes').insertOne({
      name: 'Test Piste',
      _id: 1234,
      skiAreaId: skiArea.insertedId,
    });

    piste = await db.collection('pistes').findOne({ _id: insertedPiste.insertedId });
  });

  test('should successfully rate a piste', async () => {
    axios.post = jest.fn().mockResolvedValue({data: weatherData});

    const response = await request(app)
      .post('/api/rate-piste/' + piste._id)
      .send({ rating: 4 });

    expect(response.statusCode).toBe(202);
    expect(response.text).toEqual("Successfully rated piste");
  });

  test('should return error when piste ID is invalid', async () => {
    const response = await request(app)
      .post('/api/rate-piste/invalid-id')
      .send({ rating: 4 });
    
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(err.pistes.invalidPisteId);
  });

  test('should return error when piste is not found', async () => {
    const response = await request(app)
      .post('/api/rate-piste/123412341234')
      .send({ rating: 4 });
      
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(err.pistes.notFound);
  });

  test('should return error when ski area is not found', async () => {
    // First a brand new piste is created with a fake skiAreaId
    const insertedPiste = await db.collection('pistes').insertOne({
      name: 'Test Piste 2',
      _id: 12345,
      skiAreaId: "not a valid skiAreaId",
    });

    piste = await db.collection('pistes').findOne({ _id: insertedPiste.insertedId });

    const response = await request(app)
      .post('/api/rate-piste/' + piste._id)
      .send({ rating: 4 });
      
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(err.skiArea.notFound);
  });

  test('should return error when rating is not between 1 and 5', async () => {
    const response = await request(app)
      .post('/api/rate-piste/' + piste._id)
      .send({ rating: 6 });
    
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(err.pistes.invalidRatingInterval);
  });

  test('should return error when rating is not a number', async () => {
    const response = await request(app)
      .post('/api/rate-piste/' + piste._id)
      .send({ rating: 'not a number' });
    
    expect(response.statusCode).toBe(400);
    expect(response.body).toMatchObject(err.pistes.invalidRatingInterval);
  });
});

afterAll(async () => {
  await db.collection('pistes').deleteMany({});
  await db.collection('ski-areas').deleteMany({});
  await mongoose.connection.close();
  server.close();
});
