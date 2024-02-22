import { Schema, model } from 'mongoose';

const facilitiesSchema = new Schema({
	name: {
		type: String,
		required: true
	}, 
	type: {
		type: String,
		required: true
	},
});

const FacilitiesModel = model('facilities', facilitiesSchema);

export default FacilitiesModel;
