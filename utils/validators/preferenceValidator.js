/**
 * Check if all entries in the object are boolean values
 * @param {Object} settings object to be checked
 * @returns {Boolean} true if all entries are booleans, false otherwise
 */
const isPreference = (settings) => {
  for (let key in settings) {
      if (typeof settings[key] !== 'boolean') {
          return false;
      }
  }
  return true;
};

export { isPreference };
