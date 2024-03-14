import { generateRatings } from "./generateData.js";
import saveToFile from "./utils/saveDataToFile.js";

const data = generateRatings(process.argv[2] || 100);
saveToFile(data, 'mockup_data.json');

console.log('Data generation complete');