var config = {};

config.mongoUri =  process.env.MONGOLAB_URI || 'mongodb://localhost:27017/tori';
config.cookieMaxAge = 30 * 24 * 3600 * 1000;

module.exports = config;