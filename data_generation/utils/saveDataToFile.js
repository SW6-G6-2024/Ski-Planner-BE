import fs from 'fs';

/**
 * Generate piste ratings and save to file
 * @param {number} entries number of entries to generate
 */
function saveToFile(data, fileName) {
    // Write data to JSON file
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));

    console.log('Data saved to ' + fileName);
}

export default saveToFile;