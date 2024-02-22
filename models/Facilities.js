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

const FacilitiesModel = model('facilities', facilitiesSchema);

export default FacilitiesModel;
