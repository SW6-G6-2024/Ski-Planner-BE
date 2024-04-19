import SkiArea from '../models/SkiAreas.js';

/**
 * This function finds the ski area with the given ID
 * @param {string} id The ID of the ski area
 * @returns The ski area with the given ID
 */
async function findSkiArea(id) {
	const skiArea = await SkiArea.findById(id);
	if (!skiArea)
		throw new Error('Ski area not found');
	return skiArea;
}

export { findSkiArea };