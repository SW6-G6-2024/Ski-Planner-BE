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
	modifiedAt: { type: Date, default: Date.now },
});

facilitiesSchema.pre(['save', 'update', 'findOneAndUpdate', 'updateOne'], function (next) {
  this.set({ modifiedAt: Date.now() });
  next();
});

const FacilitiesModel = model('facilities', facilitiesSchema);

export default FacilitiesModel;
