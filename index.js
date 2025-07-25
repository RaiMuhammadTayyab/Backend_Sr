const Express=require('express')
const cors=require('cors')
const Mongodb_client=require('mongodb').MongoClient 
const orderRoutes=require('./router/orderRoutes');  // ✅ Import
const PORT= process.env.PORT || 5038;
const database_Name="expense"
require('dotenv').config();
//const collectionName="Brands"
const url=process.env.MongoDB_Link
const app=Express()
 app.use(cors())
  app.use(Express.json());
 let database
// ========================
// Connect to MongoDB
// ========================  
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

 app.listen(PORT,async()=>{
    try {
    const client= await Mongodb_client.connect(url)
     database= client.db(database_Name)
     console.log(`✅ Connected to MongoDB running of ${PORT}`)

    }
catch(error){
    console.error("❌ MongoDB connection failed:", error.message)

}
 })
 app.get("/api/:collectionName/getData",async(req,res)=>{
const collectionName = req.params.collectionName;

    try{

const result=await database.collection(collectionName).find({}).toArray()
res.json(result)
    }
    catch(error){
  console.error( console.error("Error fetching data:", error.message));
    res.status(500).json({ message: "Failed to fetch data." })
    }

 })
 // ========================
// Inserting a bulk Data 
// ========================  
app.post("/api/:collectionName/addData", async (req,res)=>{
    const collectionName=req.params.collectionName
    const bulkData= req.body
//const rawData = fs.readFileSync('yourfile.json');
//const products = JSON.parse(rawData);

// Clean data: convert Stock, Sr_Price, Outlet_Price to numbers
const cleanedProducts = bulkData.map(item => ({
  ...item,

  Stock: parseInt(item.Stock || "10", 10), // default if missing or string
    Price: parseInt(item.Price || "0", 10),
    Sr_Price: parseInt(item.Sr_Price || "0", 10),
     Outlet_Price: parseInt(item.Sr_Price || "0", 10),
}));





if (!Array.isArray(bulkData)) {
    return res.status(400).json({ message: "Expected an array of data." });
  }

    try{
    const result= await database.collection(collectionName).insertMany(cleanedProducts)
      res.json(result)
      res.status(200).json({message:"bulk data has been inserted", insertedCount: result.insertedCount})

    }
    catch(error){
        console.error("Bulk data is not inserted")
        res.status(500).json({ message: "bulk data has not been inserted.", error:error.message })
    }



})
//=================================
//  Inserting Single Form Entry
//===============================
app.post("/api/:collectionName/adddata", async (req,res)=>{
    
    const formData= req.body
const collectionName=req.params.collectionName
    try{
    const result= await database.collection(collectionName).insertOne(formData)
      res.json(result)
      res.status(200).json({message:"Form data has been inserted", insertedId: result.insertedId})

    }
    catch(error){
        console.error("Form data is not inserted")
        res.status(500).json({ message: "Form data has not been inserted.", error:error.message })
    }



})

//==================
//SENding SMS
//=================

//const orderRoutes = require('./router/orderRoutes');  // ✅ Import

app.use('/api', orderRoutes);  // ✅ Mount under /api
//===========================
//Updating Stock and saving order detail
//ro
//app.post("/:collectionName/Placeorder",orderRoutes)