const {register, login, isAuthenticated} = require('./auth');
const {timezones} = require('./timezone');
const {friend, addFriend, deleteFriend, friends} = require('./friend');

module.exports = {register, login, isAuthenticated, timezones, friend, addFriend, deleteFriend, friends};