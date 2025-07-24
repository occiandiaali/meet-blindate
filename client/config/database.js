const mongoose = require("mongoose");

exports.connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "sample_meet_db",
    });
    console.log("MongoDB connection is established..");
  } catch (error) {
    console.error(error.message);
  }
};
