
/**
 * Returns the Overpass API query string for fetching downhill pistes and ski lifts within a bounding box
 * @param {Array} bounds - [minLon, minLat, maxLon, maxLat]
 * @returns {String} Overpass API query string
 */
export default (bounds) => (
	`
[out:json];
(
  // Fetch downhill pistes within the bounding box
  way["piste:type"="downhill"](${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]});
  // Fetch all ski lifts within the bounding box
  way["aerialway"](${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]});
);
out geom;
	`
);