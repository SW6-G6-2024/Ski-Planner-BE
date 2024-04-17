import fs from 'fs';

/**
 * Generate piste ratings and save to file
 * @param {Number} entries number of entries to generate
 */
function saveToFile(data, fileName, test = false) {
    // Write data to JSON file
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));

    /* istanbul ignore next */
    if (test) return;
    /* istanbul ignore next */
    console.log('Data saved to ' + fileName);
}

export default saveToFile;