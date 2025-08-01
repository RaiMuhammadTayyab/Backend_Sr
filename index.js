const express = require('express');
const cors = require('cors');
const orderRoutes = require('./router/orderRoutes.js');
const startServer = require("./Mainserver/server");

let database;
const allowedOrigins = [
  "http://localhost:3000",      // for local development
  "https://sairai.surge.sh"     // for production (deployed frontend)
];

const app = express();
// ==========================
// Middleware
// ==========================
app.use(express.json()); 
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: false,
}));
// ✅ Body parser

// ==========================
// Basic Route (Health Check)
// ==========================
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
}) 
//Use external orderRoutes (handles orders, SMS, etc.)
app.use('/api', orderRoutes);


startServer(app, PORT, database_Name);


//module.exports = app
// ==========================
// Connect to MongoDB and Start Server
// ==========================
/*app.listen(PORT, async () => {
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    database = client.db(database_Name);
    console.log(`✅ Connected to MongoDB, backend running on port ${PORT}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
});
*/
// Use external orderRoutes (handles orders, SMS, etc.)







// ==========================
// Routes
// ==========================

//Get All Data from a Collection
app.get("/api/:collectionName/getdata", async (req, res) => {
  const collectionName = req.params.collectionName;

  try {
    const result = await database.collection(collectionName).find({}).toArray();
    res.json(result);
  } catch (error) {
    console.error("❌ Error fetching data:", error.message);
    res.status(500).json({ message: "Failed to fetch data." });
  }
});

/*
 Insert Bulk Data into a Collection
app.post("/api/:collectionName/addData", async (req, res) => {
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
    const result = await database.collection(collectionName).insertOne(cleanedProducts);
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
});

// Insert Single Form Entry
app.post("/api/:collectionName/adddata", async (req, res) => {
  const collectionName = req.params.collectionName;
  const formData = req.body;

  try {
    const result = await database.collection(collectionName).insertOne(formData);
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
});
*/



