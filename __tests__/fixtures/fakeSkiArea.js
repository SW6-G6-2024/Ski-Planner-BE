import mongoose from "mongoose";


/**
 * function to create a fake ski area for testing
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
    bounds: [
      61.29560770030594,
      12.127237063661534,
      61.33240275253347,
      12.266869460358693],
    lifts: [],
    facilities: [],
  }
};