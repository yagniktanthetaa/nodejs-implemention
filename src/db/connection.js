require("dotenv").config();
const mongoose = require("mongoose");

// mongoose.set('debug',true);
mongoose.set("strictQuery", false);

const databaseConnection = () => {
  // Database connection
  mongoose
    .connect(process.env.MONGODB, {
      useNewUrlparser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("DB connection successfully");
    })
    .catch(() => {
      console.log("DB connection is not success");
    });
};

module.exports = databaseConnection();
