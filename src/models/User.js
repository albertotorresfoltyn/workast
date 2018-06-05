// import mongoose from 'mongoose';

export default (mongoose) => {
  const UserSchema = mongoose.Schema({
    name: String,
    avatar: String,
    hash: String,
    salt: String
  }, {timestamps: true});

  return mongoose.model('User', UserSchema);
};