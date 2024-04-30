import { Schema, model } from 'mongoose';
import c from 'ansi-colors';

const ratingsSchema = new Schema({
	piste: {
		type: Number,
		ref: 'Pistes',
		required: [true, 'Piste is required'],
	},
	skiAreaId: {
    type: Schema.Types.ObjectId,
    ref: 'ski-areas',
    required: [true, 'Ski Area Id is required'],
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

ratingsSchema.pre(['save', 'update', 'findOneAndUpdate', 'updateOne'], function (next) {
  this.set({ modifiedAt: Date.now() });
  next();
});

ratingsSchema.post(['update', 'findOneAndUpdate', 'updateOne'], function (doc) {
	if (this.getOptions().disablePrint) return;
	console.log(c.magenta('[DB]'), '-', c.cyan('Rating'), 'updated:', c.green(doc._id));
});

const RatingsModel = model('ratings', ratingsSchema);

export default RatingsModel;
