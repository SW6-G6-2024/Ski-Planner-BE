const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SkiAreaSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	country: {
		type: String,
		required: [true, 'Country is required'],
	},
	region: {
		type: String,
		required: [true, 'Region is required'],
	},
	website: {
		type: String,
		validate: {
			validator: function(v) {
				return /https?:\/\/(www\.)?[a-zA-Z0-9]+\.[a-zA-Z0-9]+/.test(v);
			},
			message: '{VALUE} is not a valid website URL'
		},
		required: false
	},
	bounds: [
		{
			type: Number,
			length: 4,
			required: [true, 'Bounds are required']
		}
	],
	pistes: [{
		type: Schema.Types.ObjectId,
		ref: 'Pistes'
	}],
	lifts: [{
		type: Schema.Types.ObjectId,
		ref: 'Lifts'
	}],
	facilities: [{
		type: Schema.Types.ObjectId,
		ref: 'Facilities'
	}],
	createdAt: { type: Date, default: Date.now }
});

const SkiAreaModel = mongoose.model('ski-area', SkiAreaSchema);
module.exports = { SkiAreaModel };