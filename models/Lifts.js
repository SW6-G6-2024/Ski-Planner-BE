import { Schema, model } from 'mongoose';

const liftSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	type: {
		type: String,
		required: [true, 'Type is required']
	},
	modifiedAt: { type: Date, default: Date.now },
});

const LiftModel = model('lifts', liftSchema);

export default LiftModel;
