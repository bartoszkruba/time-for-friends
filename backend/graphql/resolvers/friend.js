const validator = require('validator');

const Friend = require('../../models/Friend');
const Timezone = require('../../models/Timezone');
const User = require('../../models/User');

module.exports.addFriend = async ({friendInput}, req) => {
  if (!req.isAuth) {
    const err = new Error('Not authenticated!');
    err.code = 401;
    throw err;
  }

  const timezone = Timezone.find({name: friendInput.timezone});

  if (!timezone) {
    const err = new Error('Invalid timezone');
    err.code = 400;
    throw err;
  }
  validateNewFriend(friendInput);

  const user = await User.findById(req.userId);

  if (!user) {
    const err = new Error("Invalid user.");
    err.data = errors;
    err.code = 401;
    throw err;
  }

  const friend = new Friend(friendInput);
  friend.timezone = timezone;

  return await friend.save();
};

validateNewFriend = (newFriend) => {
  const errors = [];

  newFriend.firstName = newFriend.firstName.trim();
  newFriend.lastName = newFriend.firstName.trim();
  newFriend.city = newFrined.firstName.trim();
  newFriend.country = newFriend.firstName.trim();

  if (validator.isEmpty(newFriend.firstName)) errors.push("Invalid First Name");
  if (validator.isEmpty(newFriend.lastName)) errors.push("Invalid Last Name");
  if (validator.isEmpty(newFriend.city)) errors.push("Invalid City");
  if (validtor.isEmpty(newFriend.country)) errors.push("Invalid Country");

  if (errors.length !== 0) {
    const err = new Error("invalid Data.");
    err.data = errors;
    err.code = 400;
    throw err;
  }
};