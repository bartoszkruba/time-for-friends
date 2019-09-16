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

  const user = await User.findById(req.userId);

  if (!user) {
    const err = new Error("Invalid user.");
    err.data = errors;
    err.code = 401;
    throw err;
  }

  const timezone = await Timezone.findOne({name: friendInput.timezone});

  if (!timezone) {
    const err = new Error('Invalid timezone');
    err.code = 400;
    throw err;
  }
  validateNewFriend(friendInput);


  const friend = new Friend({...friendInput, user: user._id});
  friend.timezone = timezone._id;

  savedFriend = await friend.save();
  user.friends.push(savedFriend);
  await user.save();

  return {...savedFriend._doc, _id: savedFriend._id.toString(), timezone: timezone}
};

module.exports.friends = async ({friendQuery}, req) => {
  if (!req.isAuth) {
    const err = new Error('Not authenticated!');
    err.code = 401;
    throw err;
  }

  const user = await User.findById(req.userId);

  if (!user) {
    const err = new Error("Invalid user.");
    err.code = 401;
    throw err;
  }

  const query = {
    firstName: new RegExp(friendQuery.firstName, "i"),
    lastName: new RegExp(friendQuery.lastName, "i"),
    user: user._id
  };


  let friends = await Friend.find(query).populate('timezone').sort('firstName');

  if (friendQuery.from && friendQuery.to) {
    friends = friends.filter(f => f.timezone.currentTime >= friendQuery.from && f.timezone.currentTime <= friendQuery.to)
  }

  return friends;
};

validateNewFriend = (newFriend) => {
  const errors = [];

  newFriend.firstName = newFriend.firstName.trim();
  newFriend.lastName = newFriend.lastName.trim();
  newFriend.city = newFriend.city.trim();
  newFriend.country = newFriend.country.trim();

  if (validator.isEmpty(newFriend.firstName)) errors.push("Invalid First Name");
  if (validator.isEmpty(newFriend.lastName)) errors.push("Invalid Last Name");
  if (validator.isEmpty(newFriend.city)) errors.push("Invalid City");
  if (validator.isEmpty(newFriend.country)) errors.push("Invalid Country");

  if (newFriend.emails) {
    for (email of newFriend.emails) {
      if (!validator.isEmail(email)) {
        errors.push("Invalid Email");
        break;
      }
    }
  }

  if (newFriend.phoneNumbers) {
    for (number in newFriend.phoneNumbers) {
      if (validator.isEmpty(number)) {
        errors.push("Invalid Number");
        break;
      }
    }
  }

  if (errors.length !== 0) {
    const err = new Error("Invalid Data.");
    err.data = errors;
    err.code = 400;
    throw err;
  }
};