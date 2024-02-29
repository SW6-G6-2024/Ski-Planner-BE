import PistesModel from "../models/Pistes";
import err from "../utils/errorCodes";
import mongoose from "mongoose";

/**
 * Function that saves pistes from a ski area to the database
 * @param {Object} geoJson - The geoJson object with the pistes/ or other features
 * @returns void
 */
async function savePistesFromArea(obj, skiAreaId) {
  // if skiAreaId is not a mongoose ObjectId, return an error
  if (!mongoose.Types.ObjectId.isValid(skiAreaId)) {
    return err.general.invalidId("skiAreaId").message;
  }

  // if the object is not a valid geoJson object, return an error
  if (obj.type !== "FeatureCollection" && obj.type !== "Feature") {
    return err.geoJson.invalidObject.message;
  }

  for (let i = 0; i < obj.features.length; i++) {
    const pisteData = obj.features[i];
    if (pisteData.properties["piste:type"] === "downhill") {
      try {
        await new PistesModel({
          name: pisteData.properties.name ?? "Unknown",
          skiAreaId: skiAreaId,
        }).save();
      } catch {
        return err.pistes.saveError.message;
      }
    }
  }
};

export default savePistesFromArea;
