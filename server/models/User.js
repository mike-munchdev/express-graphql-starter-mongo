const mongoose = require('mongoose');
const { default: validatorF } = require('validator');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    validate: {
      validator: (v) => validatorF.isEmail(v),
      message: 'Email validation failed',
    },
    unique: true,
  },
  password: { type: String, required: false },
  firstName: { type: String, required: false },
  middleName: { type: String, required: false },
  lastName: { type: String, required: false },
  googleId: { type: String },
  googleAuthToken: { type: String },
  // googleAuthTokenExpiry: { type: Date },
  facebookId: { type: String },
  facebookAuthToken: { type: String },
  // facebookAuthTokenExpiry: { type: Date },
  isActive: { type: Boolean, default: false },
  confirmToken: { type: String },
  pushTokens: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// TODO: encrypt password in database;
UserSchema.pre('save', async function () {
  const user = this;
  if (user.isModified('password')) {
    const { hashPassword } = require('../utils/authentication');
    user.password = await hashPassword(user.password);
  }
});

UserSchema.method('transform', function () {
  let obj = this.toObject();
  console.log('UserSchema transform');
  //Rename fields
  obj.id = obj._id;
  delete obj._id;
  delete obj.password;
  return obj;
});

module.exports = mongoose.model('User', UserSchema);
