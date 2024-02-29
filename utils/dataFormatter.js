import err from "./errorCodes";

const overpassToGeoJson = (data) => {

	const dataArr = data.elements ?? data;

	if (!dataArr.length > 0 || !dataArr[0].geometry) {
		throw new Error(err.geoJson.missingGeometry);
	}

	const filtered = filterData(dataArr);

	const features = filtered.map(way => {
    return {
      type: "Feature",
      properties: way.tags,
      geometry: {
        type: "LineString",
        coordinates: way.geometry?.map(({lat, lon}) => [lon, lat])
      }
    };
  });

  return {
    type: "FeatureCollection",
    features: features
  };
};

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