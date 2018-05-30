// import mongoose from 'mongoose';

export default (mongoose) => {
  const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    bio: String,
    image: String,
    hash: String,
    salt: String
  }, {timestamps: true});

  return mongoose.model('User', UserSchema);
};