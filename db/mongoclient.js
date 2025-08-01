require("dotenv").config();
const { MongoClient,ObjectId } = require("mongodb");
const client = new MongoClient(process.env.MongoDB_Link);
module.exports = { client,ObjectId };