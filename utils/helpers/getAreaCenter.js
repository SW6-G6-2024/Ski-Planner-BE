/**
 * Get the center of the area
 * @param {Array<Number>} bounds The bounds of the area eg. [1, 2, 3, 4]
 * @returns {Object} The center of the area eg { lat: 2, lon: 3}
 */
export default function getAreaCenter(bounds) {
  const center = {
    lat: (bounds[0] + bounds[2]) / 2,
    lon: (bounds[1] + bounds[3]) / 2
  };
  return center;
}