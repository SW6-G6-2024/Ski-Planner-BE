import { Schema, model } from 'mongoose';
import printDbUpdate from '../utils/helpers/printDbUpdate.js';

const liftSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	type: {
		type: String,
		required: [true, 'Type is required']
	},
	createdAt: { type: Date, default: Date.now },	
	modifiedAt: { type: Date, default: Date.now },
});

// Update the 'modifiedAt' field before saving or updating the document
liftSchema.pre(['save', 'update', 'findOneAndUpdate', 'updateOne'], function (next) {
  this.set({ modifiedAt: Date.now() });
  next();
});

// Print a message after saving or updating the document
liftSchema.post(['update', 'findOneAndUpdate', 'updateOne'], function (doc) {
	if (this.getOptions().disablePrint) return;
	printDbUpdate('Lift', doc._id);
});

const LiftModel = model('lifts', liftSchema);

export default LiftModel;
