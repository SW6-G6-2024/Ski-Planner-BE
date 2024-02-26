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