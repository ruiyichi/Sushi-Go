import * as dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '', {
      useUnifiedTopology: true,
      useNewUrlParser: true
    } as ConnectOptions);
  } catch (err) {
    console.log(err);
  }
}