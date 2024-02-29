import mongoose from 'mongoose';

/**
 * function to create a fake piste for testing
 * @param {string} fakeName - "number or name of the piste"
 * @param {string} fakeDifficulty - "piste difficulty; green, red, blue, black"
 * @param {string} fakeGrooming - "grooming of piste; true or false"
 * @returns piste object
 */
export default function makeFakePiste(fakeName, fakeSkiAreaId) {
  const id = new mongoose.Types.ObjectId();
  return {
    _id: id,
    name: fakeName,
    difficulty: "black",
    grooming: true,
    skiAreaId: fakeSkiAreaId,
  }
}

