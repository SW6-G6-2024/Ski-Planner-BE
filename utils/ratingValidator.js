/**
 * Check if the object is a valid point (latitude and longitude)
 * @param {*} point object to be checked
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