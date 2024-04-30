import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
	pistePreferences: {
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
	createdAt: {
		type: Date,
		default: Date.now,
	},
	modifiedAt: {
		type: Date,
		default: Date.now,
	},
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
