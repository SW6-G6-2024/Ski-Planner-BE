const toGeoJson = (data) => {
	const features = data.elements?.filter(el => el.type === "way" && el.geometry).map(way => {
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
}

export { toGeoJson }