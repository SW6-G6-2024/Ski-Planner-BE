const mongoose = require('mongoose');

const facilitiesSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	}, 
	type: {
		type: String,
		required: true
	},
	// Add more fields as needed
});

const FacilitiesModel = mongoose.model('facilities', facilitiesSchema);

module.exports = FacilitiesModel;
