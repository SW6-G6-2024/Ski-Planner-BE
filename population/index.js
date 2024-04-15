import axios from 'axios';
import { connectToDb } from '../db/index.js';
import env from '../config/keys.js';
import getQuery from '../utils/getQuery.js';
import { overpassToGeoJson } from '../utils/dataFormatter.js';
import savePistesFromArea from './savePistesFromArea.js';

const query = getQuery([
  61.29560770030594,
  12.127237063661534,
  61.33240275253347,
  12.266869460358693
]);

const overpass = await axios.post('https://overpass-api.de/api/interpreter', query);
const geoJson = overpassToGeoJson(overpass.data);

console.log('Checking for duplicates...');
for (let i = 0; i < geoJson.features.length; i++) {
  for (let j = 0; j < geoJson.features.length; j++) {
    if (geoJson.features[i].id === geoJson.features[j].id && i !== j) {
      console.log(geoJson.features[i].properties.name, geoJson.features[j].properties.name);
    }
  }
}
console.log('Duplicates checked!');
const db = connectToDb(env.mongoURI, {});

console.log('Saving pistes...');
await savePistesFromArea(geoJson, "65d4a9dbecaa09d942314101");

console.log('Pistes saved!');
db.close();