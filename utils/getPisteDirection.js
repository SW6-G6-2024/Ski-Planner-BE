/**
 * Returns the angle of the piste in degrees based on the start and end points
 * @param {Array<Array<Number>>} coordinates Array of coordinates of the piste path
 * @returns {Number} The angle of the piste in degrees (0-360)
 */
export default function getPisteDirection(coordinates) {
  // Get the first and last points of the piste
  const firstPoint = coordinates[0];
  const lastPoint = coordinates[coordinates.length - 1];
  let pisteAngle;

  if (typeof firstPoint === Array || typeof lastPoint === Array) {
    pisteAngle = angle(firstPoint[0], firstPoint[1], lastPoint[0], lastPoint[1]);
  } else {
    pisteAngle = angle(firstPoint.lat, firstPoint.lon, lastPoint.lat, lastPoint.lon);
  }

  return pisteAngle;
}

/**
 * Calcutates the angle between two points given their coordinates
 * @param {Number} sx x-coordinate of the start point
 * @param {Number} sy y-coordinate of the start point
 * @param {Number} ex x-coordinate of the end point
 * @param {Number} ey y-coordinate of the end point
 * @returns {Number} The angle between the two points in degrees (0-360)
 */
export function angle(sx, sy, ex, ey) {
  var dy = ey - sy;
  var dx = ex - sx;
  var theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  theta = (theta + 360) % 360; // range [0, 360)
  if (theta < 0) theta = 360 + theta; // range [0, 360)
  return theta;
}