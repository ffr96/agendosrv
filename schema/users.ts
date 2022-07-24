import mongoose from "mongoose";
import { User } from '../@types/User';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 6
  },
  passwordHash: {
    type: String,
    required: true
  },
  token: String
});

userSchema.set('toJSON', {
  transform: (_document, returnedObj) => {
    delete returnedObj.__v;
    delete returnedObj._id;
    delete returnedObj.passwordHash;
  }
});
const mUser = mongoose.model<User>('User', userSchema);
export default mUser;
