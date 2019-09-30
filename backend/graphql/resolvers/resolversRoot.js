const {register, login, isAuthenticated} = require('./auth');
const {timezones, cityTimezone} = require('./timezone');
const {friend, addFriend, deleteFriend, friends, allFriends} = require('./friend');

module.exports = {
  register,
  login,
  isAuthenticated,
  cityTimezone,
  timezones,
  friend,
  addFriend,
  deleteFriend,
  friends,
  allFriends
};