import err from "./errorCodes.js";

/**
 * Converts overpass api data to geojson format
 * @param {{elements: Array}} data overpass api data to be converted to geojson
 * @returns {JSON} geojson data
 */
const overpassToGeoJson = (data) => {

  const dataArr = data.elements ?? data;

  if (!dataArr.length > 0 || !dataArr[0].geometry) {
    throw err.geoJson.missingGeometry;
  }

  const filtered = filterData(dataArr);

  const features = filtered.map(way => {
    return {
      type: "Feature",
      properties: way.tags,
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
 * Filters data to only include pistes and lifts
 * @param {Array<overpassRes>} data array of elements to be filtered
 * @returns {Array<overpassRes>} filtered array
 */
const filterData = (data) => {
  return data.filter(element => {
    const isPiste = element.tags["piste:type"] === "downhill";
    const isLift = element.tags["aerialway"]; // Add specific lift types to include or exclude here
    const difficulty = element.tags["piste:difficulty"];
    const ref = element.tags["ref"];
    const name = element.tags["name"];

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

/**
 * @typedef {Object} overpassRes
 * @property {Object} tags - The tags of the element
 */