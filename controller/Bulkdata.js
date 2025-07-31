const { client} = require("../db/mongoclient");

    const Bulkdata= async (req, res) => {
  const collectionName = req.params.collectionName;
  const BulkData = req.body;

  if (!Array.isArray(BulkData)) {
    return res.status(400).json({ message: "Expected an array of data." });
  }

  const cleanedProducts = BulkData.map(item => ({
    ...item,
    Stock: parseInt(item.Stock || "0", 10),
    Price: parseInt(item.Price || "0", 10),
    Sr_Price: parseInt(item.Sr_Price || "0", 10),
    Outlet_Price: parseInt(item.Outlet_Price || "0", 10),
    Cost:parseInt(item.Cost || "0", 10),
  }));

  try {
    const db = client.db("expense");
          const collection = db.collection(collectionName);
    const result = await collection.insertOne(cleanedProducts);
    res.status(200).json({
      message: "✅ Bulk data inserted successfully",
      insertedCount: result.insertedCount,
    });
  } catch (error) {
    console.error("❌ Bulk insert failed:", error.message);
    res.status(500).json({
      message: "❌ Bulk data insertion failed",
      error: error.message,
    });
  }
};
module.exports = Bulkdata;