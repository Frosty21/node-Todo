const environment = process.env.NODE_ENV || 'development';
const config = require('../knexfile')[environment];

// invoke the knex file with the config file of the knexfile active connection to the database
module.exports = require('knex')(config);