/**
 * Check if the object is a valid pisteId (number)
 * @param {*} point object to be checked
 * @returns {boolean} true if the object is a valid pisteId, false otherwise
 */
const isPisteId = (pisteId) => {
  // This regular expression matches a string that contains only digits
  const regex = /^\d+$/;
  return regex.test(pisteId);
};

export { isPisteId };