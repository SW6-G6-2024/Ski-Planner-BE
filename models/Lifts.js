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

liftSchema.pre(['save', 'update', 'findOneAndUpdate', 'updateOne'], function (next) {
  this.set({ modifiedAt: Date.now() });
  next();
});

const LiftModel = model('lifts', liftSchema);

export default LiftModel;
