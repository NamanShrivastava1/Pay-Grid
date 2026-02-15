const mongose = require("mongoose");

const connecToDb = async () => {
  mongose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB");
      process.exit(1);
    });
};

module.exports = connecToDb;
