const validator = require('validator');

const Friend = require('../../models/Friend');
const Timezone = require('../../models/Timezone');
const User = require('../../models/User');

const PAGE_SIZE = 10;

module.exports.addFriend = async ({friendInput}, req) => {
  const user = await checkIfAuthenticated(req);
  validateNewFriend(friendInput);

  const timezone = await getTimezone(friendInput.name);
  const friend = await Friend({...friendInput, user: user._id, timezone: timezone._id}).save();
  user.friends.push(friend);
  await user.save();

  return {...savedFriend._doc, _id: savedFriend._id.toString(), timezone: timezone}
};

module.exports.friends = async ({friendQuery}, req) => {
  const user = await checkIfAuthenticated(req);

  const query = {
    firstName: new RegExp(friendQuery.firstName, "i"),
    lastName: new RegExp(friendQuery.lastName, "i"),
    user: user._id
  };

  let friends = await Friend.find(query).populate('timezone')
    .sort(friendQuery.sort)
    .sort(friendQuery.sort === "firstName" ? "country" : "firstName")
    .skip((friendQuery.page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE);

  if (friendQuery.from && friendQuery.to) {
    friends = friends.filter(f => (f.timezone.currentTime >= friendQuery.from && f.timezone.currentTime <= friendQuery.to))
  }

  const count = await Friend.countDocuments();

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
  const timezone = await Timezone.findOne({name: friendInput.timezone});
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