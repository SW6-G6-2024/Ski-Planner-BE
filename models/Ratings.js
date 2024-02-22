import { Schema, model } from 'mongoose';

const ratingsSchema = new Schema({
	piste: {
		type: Schema.Types.ObjectId,
		ref: 'Pistes',
		required: true
	},
	rating: {
		type: Number,
		required: true
	},
	weather: {
		type: Object,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const RatingsModel = model('ratings', ratingsSchema);

export default RatingsModel;
