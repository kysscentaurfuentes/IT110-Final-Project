const { Worker } = require("bullmq");

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log(`Sending email to ${job.data.email}`);
  },
  { connection: { host: "localhost", port: 6379 } }
);

console.log("Email worker started...");
