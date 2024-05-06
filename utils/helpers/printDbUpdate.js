import c from 'ansi-colors';

/**
 * Print a message to the console when a document is updated in the database
 * @param {String} collectionName the name of the database collection
 * @param {*} id the id of the document that was updated
 */
function printDbUpdate(collectionName, id) {
	const date = new Date();
	console.log(c.magenta('[DB]'), c.red(date.toISOString()), '-', c.cyan(collectionName), 'updated:', c.green(id));
}

export default printDbUpdate;