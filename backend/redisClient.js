const Redis = require("ioredis");
const redis = new Redis(); // Connect to Redis server

module.exports = redis;
