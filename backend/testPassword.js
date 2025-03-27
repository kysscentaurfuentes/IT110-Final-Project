const bcrypt = require("bcrypt");

const inputPassword = "yourpassword"; // Replace with your actual input
const hashedPassword =
  "$2b$10$KjDht7tqR3YFQGpVIaMmsO7ypHpJCTZzz5tMwVWuYGRBrX5L/XK1W"; // Get this from your database

bcrypt.compare(inputPassword, hashedPassword, (err, result) => {
  if (err) {
    console.error("Error comparing passwords:", err);
  } else {
    console.log("Password Match:", result); // true or false
  }
});
