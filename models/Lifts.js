const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const liftSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
});

const LiftModel = mongoose.model('lifts', liftSchema);

module.exports = LiftModel;
