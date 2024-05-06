import fs from 'fs';

/**
 * Calculates the average points for each piste based on the ratings in the given json file
 * @param {String} jsonFilePath - The path to the json file containing the ratings
 * @returns {Object} An object containing the average points for each piste
 */
function calculateAveragePoints() {
    const jsonFilePath = './mockup_data.json';
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const data = JSON.parse(jsonData);

    const ratingSum = {};
    const ratingCount = {};
    
    data.forEach(rating => {
        const points = rating.points;
        const pisteId = rating.piste._id;

        // Update the sum and count for the corresponding piste
        if (pisteId in ratingSum) {
            ratingSum[pisteId] += points;
            ratingCount[pisteId]++;
        } else {
            ratingSum[pisteId] = points;
            ratingCount[pisteId] = 1;
        }
    });

    // Calculate the average points for each piste
    const averagePoints = {};
    Object.keys(ratingSum).forEach(pisteId => {
        averagePoints[pisteId] = ratingSum[pisteId] / ratingCount[pisteId];
    });

    return averagePoints;
}

const averagePoints = calculateAveragePoints('ratings.json');
console.log(averagePoints);

