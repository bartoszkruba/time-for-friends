const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

module.exports.register = async ({userInput}, req) => {
  const {email, password} = userInput;

  // Validating data
  await validateRegister(email, password);

  // Creating new user in database
  return await User({email, password: await bcrypt.hash(password, 12)}).save();
};

const validateRegister = async (email, password) => {
  const errors = [];

  if (await User.findOne({email})) errors.push("Email already exists");

  if (!validator.isEmail(email)) errors.push("Invalid email");

  if (validator.isEmpty(password) || !validator.isLength(password, {min: 5} || !validator.isAlphanumeric(password))) {
    errors.push("Password need to be at least 5 characters long and contain only letters and digits");
  }

  if (errors.length !== 0) {
    const err = new Error("invalid Data.");
    err.data = errors;
    err.code = 400;
    throw err;
  }
};