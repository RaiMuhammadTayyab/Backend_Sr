const { client} = require("../db/mongoclient");
   
const alldata= async (req, res) => {
  const collectionName = req.params.collectionName;
 console.log("📥 API HIT: Fetching data from collection:", collectionName);

  try { 
    if (!client.topology?.isConnected()) {
      await client.connect(); // Connect only if not already connected
    }

    const db = client.db("expense");
    const collection = db.collection(collectionName);
    
    const result = await collection.find({}).toArray();
    res.json(result);
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
    res.status(500).json({ message: "Failed to fetch data." });
  }
};
module.exports=alldata