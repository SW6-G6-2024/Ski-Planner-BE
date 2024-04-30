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
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
