/**
 * Get the element for the current hour from an array of elements from Open-Meteo API with elements for each hour of the day
 * @param {Array} array an array of elements from Open-Meteo API with elements for each hour of the day
 * @returns the element for the current hour
 */
export default function getElementForCurrentTime(array) {
  const date = new Date();
  const hour = date.getHours();
  const minute = date.getMinutes();

  if (minute >= 30) {
    return array[hour + 1];
  }

  return array[hour];
}