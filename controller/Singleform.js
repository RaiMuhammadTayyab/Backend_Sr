const { client} = require("../db/mongoclient");
    const Form= async (req, res) => {
  const collectionName = req.params.collectionName;
  const formData = req.body;

  try { if (!client.topology?.isConnected()) {
        await client.connect(); // Connect only if not already connected
      }

      const db = client.db("expense");
          const collection = db.collection(collectionName);
    const result = await collection.insertOne(formData);
    res.status(200).json({
      message: "✅ Form data inserted successfully",
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error("❌ Form insert failed:", error.message);
    res.status(500).json({
      message: "❌ Form data insertion failed",
      error: error.message,
    });
  }
};

module.exports=Form;