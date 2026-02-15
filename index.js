const dotenv = require("dotenv");
dotenv.config();
const app = require("./src/app");
const connectToDb = require("./src/config/db");

connectToDb();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
