const { Queue } = require("bullmq");
const redisOptions = { connection: { host: "localhost", port: 6379 } };

const emailQueue = new Queue("emailQueue", redisOptions);

module.exports = emailQueue;
