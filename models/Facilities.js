import { Schema, model } from 'mongoose';

const facilitiesSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	}, 
	type: {
		type: String,
		required: [true, 'Type is required'],
	},
	createdAt: { type: Date, default: Date.now },
	modifiedAt: { type: Date, default: Date.now },
});

// Update the 'modifiedAt' field before saving or updating the document
facilitiesSchema.pre(['save', 'update', 'findOneAndUpdate', 'updateOne'], function (next) {
  this.set({ modifiedAt: Date.now() });
  next();
});

// Print a message after saving or updating the document
facilitiesSchema.post(['update', 'findOneAndUpdate', 'updateOne'], function (doc) {
	if (this.getOptions().disablePrint) return;
	console.log(c.magenta('[DB]'), '-', c.cyan('Facility'), 'updated:', c.green(doc._id));
});

const FacilitiesModel = model('facilities', facilitiesSchema);

export default FacilitiesModel;
