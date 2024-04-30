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
	createdAt: { type: Date, default: Date.now },	
	modifiedAt: { type: Date, default: Date.now },
});

liftSchema.pre(['save', 'update', 'findOneAndUpdate', 'updateOne'], function (next) {
  this.set({ modifiedAt: Date.now() });
  next();
});

liftSchema.post(['update', 'findOneAndUpdate', 'updateOne'], function (doc) {
	if (this.getOptions().disablePrint) return;
	console.log(c.magenta('[DB]'), '-', c.cyan('Lift'), 'updated:', c.green(doc._id));
});

const LiftModel = model('lifts', liftSchema);

export default LiftModel;
