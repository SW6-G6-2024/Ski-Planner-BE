/**
 * Check if the object is a valid rating (number between 1 and 5 inclusive)
 * @param {*} rating object to be checked
 * @returns {boolean} true if the object is a valid rating, false otherwise
 */
const isRating = (rating) => {
  return typeof rating === 'number' && rating >= 1 && rating <= 5;
};

export { isRating };