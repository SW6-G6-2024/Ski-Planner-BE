/**
 * Check if the object is a valid pisteId (number)
 * @param {String} pisteId - The id of the piste
 * @returns {Boolean} True if the pisteId is valid, false otherwise
 */
const isPisteId = (pisteId) => {
  // This regular expression matches a string that contains only digits
  const regex = /^\d+$/;
  return regex.test(pisteId);
};

export { isPisteId };