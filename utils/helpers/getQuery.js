/**
 * Returns the Overpass API query string for fetching downhill pistes and ski lifts within a bounding box
 * @param {Array<Number>} bounds - [minLon, minLat, maxLon, maxLat]
 * @returns {String} Overpass API query string
 */
export default (bounds, settings) => {
  const PISTE_DIFFICULTY_MAPPING = {
    'Very easy piste': 'novice',
    'Easy piste': 'easy',
    'Medium piste': 'intermediate',
    'Expert piste': ['advanced', 'expert']
  };
  
  const LIFT_TYPE_MAPPING = {
    'Button lift': ['drag_lift', 'platter'],
    'Chair lift': 'chair_lift',
    'Gondola lift': 'gondola',
    'Lift': 't-bar'
  };

  if (settings === undefined) {
    settings = {
      'Very easy piste': true,
      'Easy piste': true,
      'Medium piste': true,
      'Expert piste': true,
      'Button lift': true,
      'Chair lift': true,
      'Gondola lift': true,
      'Lift': true
    };
  }
  
  let query = `
  [out:json];
  (
    `;
    
    // Add pistes based on settings
    Object.entries(PISTE_DIFFICULTY_MAPPING).forEach(([key, value]) => {
      if (settings[key]) {
        if (Array.isArray(value)) {
          value.forEach(val => {
            query += `way["piste:type"="downhill"]["piste:difficulty"="${val}"](${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]});\n`;
          });
        } else {
          query += `way["piste:type"="downhill"]["piste:difficulty"="${value}"](${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]});\n`;
        }
      }
    });

    // Add lifts based on settings
    Object.entries(LIFT_TYPE_MAPPING).forEach(([key, value]) => {
      if (settings[key]) {
        if (Array.isArray(value)) {
          value.forEach(val => {
            query += `way["aerialway"="${val}"](${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]});\n`;
          });
        } else {
          query += `way["aerialway"="${value}"](${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]});\n`;
        }
      }
    });

    query += `
  );
  out geom;
  `;
  return query;
};
