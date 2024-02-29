import express from 'express';
import mongoose from 'mongoose';
import connectDb from '../fixtures/db.js';
import makeFakeSkiArea from '../fixtures/fakeSkiArea.js';
import makeFakePiste from '../fixtures/fakePiste.js';
import SkiAreaModel from '../../models/SkiAreas.js';

const app = express();
// Connect to the database
app.use(express.json());

describe('savePistes', () => {
  let db;
  beforeAll(async () => {
    db = await connectDb();
  });

  beforeEach(async () => {
    let fakeArea = makeFakeSkiArea();
    let fakePiste1 = makeFakePiste("1337", fakeArea._id); 
    let fakePiste2 = makeFakePiste("69", fakeArea._id);
    let fakePiste3 = makeFakePiste("420", fakeArea._id);
    await db.collection('skiareas').insertOne(fakeArea);
    await db.collection('pistes').insertOne(fakePiste1);
    await db.collection('pistes').insertOne(fakePiste2);
    await db.collection('pistes').insertOne(fakePiste3)
  });

  afterEach(async () => {
    await db.collection('skiareas').deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });



  it('should save pistes', async () => {
    const id = "65d4a9dbecaa09d942314101";
    const skiArea = await SkiAreaModel.findById(id);
  });
});
