import express from 'express';
import mongoose from 'mongoose';
import connectDb from '../fixtures/db.js';
import makeFakeSkiArea from '../fixtures/fakeSkiArea.js';
import savePistesFromArea from '../../population/savePistesFromArea.js';

const app = express();
// Connect to the database
app.use(express.json());
let db;

beforeAll(async () => {
  db = await connectDb();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('savePistes', () => {
  const fakeArea = makeFakeSkiArea();

  beforeEach(async () => {
    await db.collection('ski-areas').insertOne(fakeArea);
  });

  afterEach(async () => {
    await db.collection('ski-areas').deleteMany({});
  });

  it('should save pistes', async () => {
    await savePistesFromArea(fakeArea._id);
    expect(await db.collection('pistes').countDocuments()).toBe(127);
    let totalPistes = await db.collection('pistes').find({}).toArray();
    for (let i = 0; i < totalPistes.length; i++) {
      expect(totalPistes[i].name).toBeDefined();
      expect(totalPistes[i].skiAreaId).toEqual(fakeArea._id);
    }
  });
});
