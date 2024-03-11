import { generateRatings } from './generateData.js';

import fs from 'fs';

// Function to generate ratings for pistes based on various factors
function generatePisteRatings(entries) {
    const mockupData = generateRatings(entries);

    // Write data to JSON file
    fs.writeFileSync('mockup_data.json', JSON.stringify(mockupData, null, 2));

    console.log('Mock-up data saved to mockup_data.json');
}

generatePisteRatings(1000);