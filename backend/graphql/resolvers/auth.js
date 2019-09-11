const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

module.exports.register = async ({userInput}, req) => {
  const {email, password} = userInput;

  // todo validate input
  // Checking if user already exists
  if (await User.findOne({email})) throw new Error("User already exists");

  // Creating new user in database
  return await User({email, password: await bcrypt.hash(password, 12)}).save();
};