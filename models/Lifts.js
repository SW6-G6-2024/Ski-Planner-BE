import { Schema, model } from 'mongoose';

const liftSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
});

const LiftModel = model('lifts', liftSchema);

export default LiftModel;
