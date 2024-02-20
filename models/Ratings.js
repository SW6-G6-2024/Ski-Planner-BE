const mongoose = require('mongoose');

const ratingsSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	skiResort: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'SkiResort',
		required: true
	},
	rating: {
		type: Number,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const RatingsModel = mongoose.model('ratings', ratingsSchema);

module.exports = RatingsModel;
