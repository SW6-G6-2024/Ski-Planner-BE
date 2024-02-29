import PistesModel from "../models/Pistes";

/**
 * Function that saves pistes from a ski area to the database
 * @param {Object} geoJson - The geoJson object with the pistes/ or other features
 * @returns void
 */
async function savePistesFromArea(obj, skiAreaId) {
  for (let i = 0; i < obj?.geoJson.features.length; i++) {
    const pisteData = obj?.geoJson.features[i];
    if (pisteData.properties["piste:type"] === "downhill") {
      await new PistesModel({
        name: pisteData.properties.name ?? "Unknown",
        skiAreaId: skiAreaId,
      }).save();
    }
  }
};

export default savePistesFromArea;
