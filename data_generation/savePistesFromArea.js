import PistesModel from "../models/Pistes.js";
import err from "../utils/errorCodes.js";
import mongoose from "mongoose";

/**
 * Function that saves or updates pistes from a ski area in the database.
 * @param {Object} geoJson - The geoJson object with the pistes/ or other features.
 * @param {String} skiAreaId - The id of the ski area.
 * @returns void
 */
async function savePistesFromArea(obj, skiAreaId) {
  // if skiAreaId is not a mongoose ObjectId, return an error
  if (!mongoose.Types.ObjectId.isValid(skiAreaId)) {
    throw err.general.invalidId(skiAreaId);
  }

  // if the object is not a valid geoJson object, return an error
  if (obj.type !== "FeatureCollection" && obj.type !== "Feature") {
    throw err.geoJson.invalidObject;
  }

  for (let i = 0; i < obj.features.length; i++) {
    const pisteData = obj.features[i];
    if (pisteData.properties["piste:type"] === "downhill") {
      const name = pisteData.properties.name ?? pisteData.properties.ref ?? "Unknown";
      const now = new Date();

      try {
        await PistesModel.findOneAndUpdate(
          { _id: pisteData.id },
          {
            $setOnInsert: { _id: pisteData.id, skiAreaId: skiAreaId, createdAt: now },
            $set: { name: name, modifiedAt: now }
          },
          { upsert: true, new: true }
        );
      } catch (error) {
        throw err.pistes.saveError;
      }
    }
  }
}

export default savePistesFromArea;
