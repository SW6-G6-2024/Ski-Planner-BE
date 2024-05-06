import err from "./errorCodes.js";

/**
 * Converts overpass api data to geojson format
 * @param {OverpassResult} data overpass api data to be converted to geojson
 * @returns {JSON} geojson data
 */
const overpassToGeoJson = (data) => {

  const dataArr = data.elements ?? data;

  if (!dataArr.length > 0 || !dataArr[0].geometry) {
    throw err.geoJson.missingGeometry;
  }

  const filtered = filterData(dataArr);

  const features = filtered.map(way => {
    const tags = filterTags(way.tags);
    return {
      type: "Feature",
      properties: {
        name: way.tags["name"] || way.tags["piste:name"] || way.tags["ref"] || way.tags["piste:ref"],
        ...tags
      },
      id: way.id,
      geometry: {
        type: "LineString",
        coordinates: way.geometry?.map(({ lat, lon }) => [lon, lat])
      }
    };
  });

  return {
    type: "FeatureCollection",
    features: features
  };
};

/**
 * Checks if a key is a name or ref field
 * @param {String} key 
 * @returns {Boolean} true if key is a name or ref field, false otherwise
 */
function isNameRefField(key) {
  return key === "name" || key === "piste:name" || key === "ref" || key === "piste:ref";
}

/**
 * Filters out name and ref fields from tags to avoid duplication/confusion
 * @param {*} tags 
 * @returns {*} tags object without name and ref fields
 */
function filterTags(tags) {
  return Object.keys(tags).reduce((acc, key) => {
    if (!isNameRefField(key)) {
      acc[key] = tags[key];
    }
    return acc;
  }, {});
}

/**
 * Filters data to only include pistes and lifts
 * @param {Array<OverpassFeature>} data array of elements to be filtered
 * @returns {Array<OverpassFeature>} filtered array
 */
const filterData = (data) => {
  return data.filter(element => {
    const isPiste = element.tags["piste:type"] === "downhill";
    const isLift = element.tags["aerialway"]; // Add specific lift types to include or exclude here
    const difficulty = element.tags["piste:difficulty"];
    const ref = element.tags["ref"] || element.tags["piste:ref"];
    const name = element.tags["name"] || element.tags["piste:name"];

    if (isPiste) {
      // Exclude specific difficulties and ensure 'ref' is present for pistes
      return difficulty !== "freeride" && difficulty !== "extreme" && (ref || name);
    } else if (isLift) {
      return isLift;
    }
    return false;
  });
};

export { overpassToGeoJson };