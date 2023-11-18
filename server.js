const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = 3000;

async function run() {
  try {
    const DB_URI = process.env["DB_URI"];
    await mongoose.connect(DB_URI);
    console.log("Database connection successful.");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(1);
  }
}

run()
  .then(() => {
    app.listen(PORT, function () {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`)
  );
