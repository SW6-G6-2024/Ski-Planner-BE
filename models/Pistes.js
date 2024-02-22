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
		type: Boolean,
		required: [true, 'Grooming is required'],
	},
	createdAt: { type: Date, default: Date.now }
});

const PistesModel = model('pistes', PistesSchema);
export default PistesModel;