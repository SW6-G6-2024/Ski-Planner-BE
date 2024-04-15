/**
 * Finds the number of days in a given month and year
 * @param {Number} month The month to get the days for (e.g. 2 for February)
 * @param {Number} year The year of the month to get the days for (e.g. 2023)
 * @returns {Number} number of days in the given month and year
 */
function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

/**
 * Gets a random winter month based on weights, where january and february have occur more often
 * @returns the number of the chosen winter mont
 */
function getWinterMonth() {
  // Define an array containing winter months (November to March)
  const winterMonths = [11, 12, 1, 2, 3];

  // Define weights for each month (higher weight for January and February)
  const weights = [1, 1, 2, 2, 1];

  // Calculate total weight
  const totalWeight = weights.reduce((acc, val) => acc + val, 0);

  // Generate a random number between 0 and totalWeight
  const randomNum = Math.random() * totalWeight;

  // Choose a month based on the random number and weights
  let weightSum = 0;
  for (let i = 0; i < winterMonths.length; i++) {
    weightSum += weights[i];
    if (randomNum < weightSum) {
      return winterMonths[i];
    }
  }
}


export { daysInMonth, getWinterMonth };