import mongoose from "mongoose";

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
			chairlift: {
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

userSchema.pre(['update', 'findOneAndUpdate', 'updateOne'], function (next) {
	this.set({ modifiedAt: Date.now() });
	next();
});

userSchema.post(['update', 'findOneAndUpdate', 'updateOne'], function (doc) {
	console.log('User updated:', doc._id);
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
