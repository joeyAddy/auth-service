const mongoose = require("mongoose");

module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  // cloud connection-Str
  let cloudDB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
  );
  try {
    mongoose.connect(cloudDB, connectionParams);
    console.log("Connected to database successfully");
  } catch (error) {
    console.log(error);
    console.log("Could not connect database!");
  }
};
