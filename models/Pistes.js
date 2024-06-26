// Create model for Pistes
import { Schema, model } from 'mongoose';
import printDbUpdate from '../utils/helpers/printDbUpdate.js';

const PistesSchema = new Schema({
  _id: {
    type: Number,
    required: [true, 'Id is required'],
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  skiAreaId: {
    type: Schema.Types.ObjectId,
    ref: 'ski-areas',
    required: [true, 'Ski Area Id is required'],
  },
  direction: {
    type: Number,
    required: [true, 'Direction is required'],
  },
  weight: {
    type: Number,
    default: 1,
  },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now }
});

// Update the 'modifiedAt' field before saving or updating the document
PistesSchema.pre(['save', 'update', 'findOneAndUpdate', 'updateOne'], function (next) {
  this.set({ modifiedAt: Date.now() });
  next();
});

// Print a message after saving or updating the document
PistesSchema.post(['update', 'findOneAndUpdate', 'updateOne'], function (doc) {
  if (this.getOptions().disablePrint) return;
	printDbUpdate('Piste', doc._id);
});

const PistesModel = model('pistes', PistesSchema);
export default PistesModel;