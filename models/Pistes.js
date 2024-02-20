// Create model for Pistes
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PistesSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	difficulty: {
		type: String,
		required: [true, 'Difficulty is required'],
	},
	grooming: {
		type: String,
		required: [true, 'Grooming is required'],
	},
	ratings: {
		type: mongoose.Mongoose.ObjectId,
		ref: 'Ratings',
	},
	createdAt: { type: Date, default: Date.now }
});

const PistesModel = mongoose.model('pistes', PistesSchema);
module.exports = { PistesModel };