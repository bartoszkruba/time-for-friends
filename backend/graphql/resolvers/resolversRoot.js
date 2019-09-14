const {register, login} = require('./auth');
const {timezones} = require('./timezone');
const {addFriend, friends} = require('./friend');

module.exports = {register, login, timezones, addFriend, friends};