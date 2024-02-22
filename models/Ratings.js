import { Schema, model } from 'mongoose';

const ratingsSchema = new Schema({
	piste: {
		type: Schema.Types.ObjectId,
		ref: 'Pistes',
		required: [true, 'Piste is required'],
	},
	rating: {
		type: Number,
		required: [true, 'Rating is required'],
	},
	weather: {
		type: Object,
		required: [true, 'Weather is required'],
	},
	modifiedAt: {
		type: Date,
		default: Date.now
	}
});

const RatingsModel = model('ratings', ratingsSchema);

export default RatingsModel;
