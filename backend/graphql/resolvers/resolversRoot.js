const {register, login, isAuthenticated} = require('./auth');
const {timezones} = require('./timezone');
const {addFriend, friends} = require('./friend');

module.exports = {register, login, isAuthenticated, timezones, addFriend, friends};