import { Schema, model } from 'mongoose';

const ratingsSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	skiResort: {
		type: Schema.Types.ObjectId,
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

const RatingsModel = model('ratings', ratingsSchema);

export default RatingsModel;
