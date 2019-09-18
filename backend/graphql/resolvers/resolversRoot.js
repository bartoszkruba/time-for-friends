const {register, login, isAuthenticated} = require('./auth');
const {timezones} = require('./timezone');
const {addFriend, friends, deleteFriend} = require('./friend');

module.exports = {register, login, isAuthenticated, timezones, addFriend, deleteFriend, friends};