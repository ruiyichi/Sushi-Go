import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	roles: {
		type: {
			User: {
				type: Number,
				default: 2001
			},
			Editor: Number,
			Admin: Number
			},
		default: {
			User: 2001,
		},
	},
	password: {
		type: String,
		required: true,
	},
	refreshToken: String
});

export default mongoose.model('User', userSchema);