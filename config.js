'use strict';
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost/tipbot',
  TEST_MONGODB_URI:
    process.env.TEST_MONGODB_URI || 'mongodb://localhost/tipbot-test',
  LEAGUE_ID: process.env.LEAGUE_ID,
  SWID: process.env.SWID,
  ESPN_S2: process.env.ESPN_S2, 
  GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY: process.env.PRIVATE_KEY
};
