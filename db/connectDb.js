const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    // const mongoUri = "mongodb+srv://rohanguptabc80:rohan0000@cluster0.kpjqdwd.mongodb.net/test";
    const mongoUri =
      "mongodb+srv://aksh2137:aksh2137@cluster0.jpqpxva.mongodb.net";

    const dbOptions = {
      dbName: "TiffinService",
    };
    const connect = await mongoose.connect(mongoUri, dbOptions);
    console.log("Database Connection Successfully");
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = connectDb;
