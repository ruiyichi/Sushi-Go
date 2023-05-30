import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	refreshToken: String,
	profilePicture: {
		type: String,
		default: 'maki.png'
	}
});

export default mongoose.model('User', userSchema);