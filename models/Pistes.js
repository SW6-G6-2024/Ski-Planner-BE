// Create model for Pistes
import { Schema, model } from 'mongoose';

const PistesSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
  skiAreaId: {
    type: Schema.Types.ObjectId,
    ref: 'ski-areas',
    required: [true, 'Ski Area Id is required'],
  },
	modifiedAt: { type: Date, default: Date.now },
});

const PistesModel = model('pistes', PistesSchema);
export default PistesModel;