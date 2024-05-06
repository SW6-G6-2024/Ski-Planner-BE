import generateRatings from "./generateData.js";
import saveToFile from "./utils/saveDataToFile.js";

const data = await generateRatings(process.argv[2] || 100);
saveToFile(data, 'mockup_data.json');

let counts = {
	1: 0,
	2: 0,
	3: 0,
	4: 0,
	5: 0,
};

for (let pts in Object.keys(counts))  {
	counts[Number(pts) + 1] = data.filter((rating) => rating.points === Number(pts) + 1).length;
}

console.log(counts);