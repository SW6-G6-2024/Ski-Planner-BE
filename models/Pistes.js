// Create model for Pistes
import { Schema, model } from 'mongoose';

const PistesSchema = new Schema({
  id: {
    type: Number,
    required: [true, 'Id is required'],
    unique: true,
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
    type: String,
    required: [true, 'Direction is required'],
  },
  modifiedAt: { type: Date, default: Date.now },
}, { _id: false });

const PistesModel = model('pistes', PistesSchema);
export default PistesModel;