const validator = require('validator');

const Friend = require('../../models/Friend');
const Timezone = require('../../models/Timezone');
const User = require('../../models/User');

const PAGE_SIZE = 10;

module.exports.friend = async ({_id}) => {
  const friend = Friend.findById(_id).populate('timezone');

  if (!friend) {
    const err = new Error("Friend not found");
    err.data = errors;
    err.code = 404;
    throw err;
  }

  return friend;
};

module.exports.addFriend = async ({friendInput}, req) => {
  const user = await checkIfAuthenticated(req);
  validateNewFriend(friendInput);

  const timezone = await getTimezone(friendInput.timezone);
  const friend = await Friend({...friendInput, user: user._id, timezone: timezone._id}).save();
  user.friends.push(friend);
  await user.save();

  return {...friend._doc, _id: friend._id.toString(), timezone: timezone}
};

module.exports.deleteFriend = async ({_id}, req) => {
  const user = await checkIfAuthenticated(req);
  const friend = Friend.findById(_id);

  if (!friend) {
    const err = new Error("Friend not found");
    err.data = errors;
    err.code = 404;
    throw err;
  }

  const index = user.friends.findIndex(f => f.toString() === _id);

  if (index === -1) {
    const err = new Error("Not authenticated");
    err.data = errors;
    err.code = 401;
    throw err;
  }

  user.friends.splice(index, 1);
  await friend.remove();
  await user.save();

  return true;
};

module.exports.friends = async ({friendQuery}, req) => {
  const user = await checkIfAuthenticated(req);
  const query = {
    firstName: new RegExp(friendQuery.firstName, "i"),
    lastName: new RegExp(friendQuery.lastName, "i"),
    user: user._id
  };

  let friends = await Friend.find(query)
    .sort([[friendQuery.sort, 1],
      [(friendQuery.sort === "firstName" ? "country" : "firstName"), 1]])
    .populate('timezone');

  if (friendQuery.from && friendQuery.to) {
    friends = friends.filter(f => (f.timezone.currentTime >= friendQuery.from && f.timezone.currentTime <= friendQuery.to))
  }

  const count = friends.length;
  friends = friends.splice((friendQuery.page - 1) * PAGE_SIZE, PAGE_SIZE);

  return {friends, count};
};

checkIfAuthenticated = async req => {
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

  return user;
};

getTimezone = async name => {
  const timezone = await Timezone.findOne({name: name});
  if (!timezone) {
    const err = new Error('Invalid timezone');
    err.code = 400;
    throw err;
  }
  return timezone;
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