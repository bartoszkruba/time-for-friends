const Timezone = require('../../models/Timezone');

module.exports.timezones = async () => await Timezone.find({});

