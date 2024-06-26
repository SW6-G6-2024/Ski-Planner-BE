import mongoose from "mongoose";
import printDbUpdate from "../utils/helpers/printDbUpdate.js";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
	preferences: {
		pisteDifficulties: {
			green: {
				type: Boolean,
				required: true,
				default: true,
			},
			blue: {
				type: Boolean,
				required: true,
				default: true,
			},
			red: {
				type: Boolean,
				required: true,
				default: true,
			},
			black: {
				type: Boolean,
				required: true,
				default: true,
			},
		},
		liftTypes: {
			gondola: {
				type: Boolean,
				required: true,
				default: true,
			},
			chair: {
				type: Boolean,
				required: true,
				default: true,
			},
			tBar: {
				type: Boolean,
				required: true,
				default: true,
			},
			platter: {
				type: Boolean,
				required: true,
				default: true,
			},
		},
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	modifiedAt: {
		type: Date,
		default: Date.now,
	},
});

// Update the 'modifiedAt' field before saving or updating the document
userSchema.pre(['save', 'update', 'findOneAndUpdate', 'updateOne'], function (next) {
	this.set({ modifiedAt: Date.now() });
	next();
});

// Print a message after saving or updating the document
userSchema.post(['update', 'findOneAndUpdate', 'updateOne'], function (doc) {
	if (this.getOptions().disablePrint) return;
	printDbUpdate('User', doc._id);
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
