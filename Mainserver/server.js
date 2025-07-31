//const app = require("../index");
const { client } = require("../db/mongoclient");
require("dotenv").config();

//const PORT = process.env.PORT || 5038;
//const database_Name = "expense";
let database;

async function startServer(app,PORT,database_Name) {
  try {
    await client.connect();
    database = client.db(database_Name); // Now accessible in controllers
    console.log(`✅ Connected to MongoDB`);

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
}

module.exports=startServer

