/**
 * Check if the object is a valid rating (number between 1 and 5 inclusive)
 * @param {*} rating object to be checked
 * @returns 
 */
const isRating = (rating) => {
	if (typeof rating === 'number') {
		return true;
	} else if (rating >= 1 && rating <= 5) {
    return true;
  }
	return false;
};

export { isRating };