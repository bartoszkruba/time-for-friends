const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "secretsdfiifdsijdsfijfdsijfdsjfdsjfdsi";

module.exports.JWT_SECRET = JWT_SECRET;

const User = require('../../models/User');

module.exports.register = async ({userInput}) => {
  const {email, password} = userInput;

  // Validating data
  await validateRegister(email, password);

  // Creating new user in database
  return await User({email, password: await bcrypt.hash(password, 12)}).save();
};

module.exports.login = async ({email, password}) => {
  const user = await User.findOne({email});
  if (!user) {
    const err = new Error('User not found.');
    err.code = 401;
    throw err;
  }

  const isEqual = await bcrypt.compare(password, user.password);
  if (!isEqual) {
    const err = new Error("Password is incorrect.");
    err.code = 401;
    throw err;
  }

  const token = jwt.sign({
      userId: user._id.toString(),
      email: user.email
    }, JWT_SECRET,
    {expiresIn: '1 year'});

  return {token, userId: user._id.toString()}
};

module.exports.isAuthenticated = (props, req) => req.isAuth;

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