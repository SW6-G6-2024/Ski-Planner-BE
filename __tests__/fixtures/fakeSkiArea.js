import mongoose from "mongoose";


/**
 * function to create a fake ski area for testing
 * @param {Object} fakePistes - "none or more pistes to add to the ski area."
 * @returns ski area object
 */
export default function makeFakeSkiArea() {
  const id = new mongoose.Types.ObjectId();
  return {
    _id: id,
    name: 'Trysil',
    country: 'Norway',
    region: 'Hedmark',
    website: 'https://www.trysil.com',
    bounds: [61.2, 12.2, 61.2, 12.2],
    lifts: [],
    facilities: [],
  }
};

/*
pistes
Array (empty)

lifts
Array (empty)

facilities
Array (empty)
createdAt
2024-02-20T13:32:11.119+00:00
*/