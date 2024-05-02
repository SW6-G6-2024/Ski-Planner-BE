/**
 * Returns the Overpass API query string for fetching downhill pistes and ski lifts within a bounding box
 * @param {Array<Number>} bounds - [minLon, minLat, maxLon, maxLat]
 * @returns {String} Overpass API query string
 */
export default (bounds, settings) => {
  const PISTE_DIFFICULTY_MAPPING = {
    green: 'novice',
    blue: 'easy',
    red: 'intermediate',
    black: ['advanced', 'expert']
  };
  
  const LIFT_TYPE_MAPPING = {
    platter: ['drag_lift', 'platter'],
    tBar: 't-bar',
    gondola: 'gondola',
    chair: 'chair_lift'
  };

  if (settings === undefined) {
    settings = {
      green: true,
      blue: true,
      red: true,
      black: true,
      platter: true,
      tBar: true,
      chair: true,
      gondola: true
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
