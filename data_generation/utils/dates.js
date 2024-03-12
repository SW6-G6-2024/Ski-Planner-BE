/**
 * Finds the number of days in a given month and year
 * @param {number} month The month to get the days for (e.g. 2 for February)
 * @param {number} year The year of the month to get the days for (e.g. 2023)
 * @returns number of days in the given month and year
 */
function daysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

export { daysInMonth };