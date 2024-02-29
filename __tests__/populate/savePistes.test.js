import express from 'express';
import mongoose from 'mongoose';
import connectDb from '../fixtures/db.js';
import makeFakeSkiArea from '../fixtures/fakeSkiArea.js';
import savePistesFromArea from '../../population/savePistesFromArea.js';
import pisteResponse from '../fixtures/pisteGeoJsonExample.js';
import err from '../../utils/errorCodes.js';

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

  it('Saves all pistes by geoJson and sky area id', async () => {
    await savePistesFromArea(pisteResponse, fakeArea._id);

    // Check if all the pistes, and only the pistes are saved from the example response
    expect(await db.collection('pistes').countDocuments()).toBe(3);

    // Check if the pistes are saved with the correct skiAreaId, and if the name is defined
    let totalPistes = await db.collection('pistes').find({}).toArray();
    for (let i = 0; i < totalPistes.length; i++) {
      expect(totalPistes[i].name).toBeDefined();
      expect(totalPistes[i].skiAreaId).toEqual(fakeArea._id);
    }
  });

  it('Returns an error if skiAreaId is invalid', async () => {
    const result = await savePistesFromArea(pisteResponse, "invalidId");
    expect(result).toEqual(new Error(err.general.invalidId("skiAreaId")));
  });

  it('Returns an error if the geoJson object is invalid', async () => {
    const result = await savePistesFromArea({}, fakeArea._id);
    expect(result).toEqual(new Error(err.geoJson.invalidObject));
  });
});
