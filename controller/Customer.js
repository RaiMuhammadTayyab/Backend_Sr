const { client} = require("../db/mongoclient");

const customer= async (req, res) => {
  const collectionName = req.params.collectionName;
  const CustomerData = req.body;

  try {
     await client.connect();
     const db = client.db("expense");
      const collection = db.collection(collectionName);

    const result = await collection.insertOne(CustomerData);
    res.status(200).json({
      message: "✅ Customer data inserted successfully",
      insertedCount: result.insertedId,
    });
  } catch (error) {
    console.error("❌ Customer data insert failed:", error.message);
    res.status(500).json({
      message: "❌ customer data insertion failed",
      error: error.message,
    });
  }
};
module.exports = customer;