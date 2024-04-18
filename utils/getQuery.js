/**
 * Returns the Overpass API query string for fetching downhill pistes and ski lifts within a bounding box
 * @param {Array<Number>} bounds - [minLon, minLat, maxLon, maxLat]
 * @returns {String} Overpass API query string
 */
export default (bounds) => (
	`
[out:json];
(
  way["piste:type"="downhill"]["piste:difficulty"!="freeride"]["piste:difficulty"]["ref"](${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]}); 
  way["piste:type"="downhill"]["piste:difficulty"!="freeride"]["piste:difficulty"]["name"](${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]});
  way["piste:type"="downhill"]["piste:difficulty"!="freeride"]["piste:difficulty"]["piste:ref"](${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]}); 
  way["piste:type"="downhill"]["piste:difficulty"!="freeride"]["piste:difficulty"]["piste:name"](${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]});
  // Fetch downhill pistes within the bounding box
  way["piste:type"="downhill"](${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]});
  // Fetch all ski lifts within the bounding box
  way["aerialway"](${bounds[0]},${bounds[1]},${bounds[2]},${bounds[3]});
);
out geom;
	`
);