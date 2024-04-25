// Create model for Pistes
import { Schema, model } from 'mongoose';

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
  modifiedAt: { type: Date, default: Date.now },
  weight: {
    type: Number,
    default: 1,
  },
});

const PistesModel = model('pistes', PistesSchema);
export default PistesModel;