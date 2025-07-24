
const { MongoClient,ObjectId } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MongoDB_Link);

module.exports = { client,ObjectId };