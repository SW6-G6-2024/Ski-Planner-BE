// Create model for Pistes
import { Schema, model, Types } from 'mongoose';

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
		type: Types.ObjectId,
		ref: 'Ratings',
	},
	createdAt: { type: Date, default: Date.now }
});

const PistesModel = model('pistes', PistesSchema);
export default { PistesModel };