//const { ObjectId } = require("mongodb");
const { client,ObjectId } = require("../db/mongoclient");

const updateStock = async (req, res) => {
  const cartItems = req.body.cart;
  const collectionName = req.params.collectionName;

  try {
    await client.connect();
    const db = client.db("expense");
    const session = client.startSession();

    let orderTotal = 0;
    const orderItems = [];

    await session.withTransaction(async () => {
      for (const item of cartItems) {
        const product = await db.collection(collectionName).findOne(
          { _id: new ObjectId(item.productId) },
          { session }
        );

        if (!product) throw new Error("Product not found");
        if (product.Stock < item.quantity) throw new Error(`${product.Brand} is out of stock`);
console.log("Product ID:", item.productId, "Qty:", item.quantity);
console.log("Stock before update:", product.Stock);
console.log("Looking for product with:", { _id: new ObjectId(item.productId), Stock: { $gte: item.quantity } });
        const updateResult = await db.collection(collectionName).updateOne(
          { _id: new ObjectId(item.productId), Stock: { $gte: item.quantity } },
          { $inc: { Stock: -item.quantity } },
          { session }
        );

        if (updateResult.modifiedCount === 0) {
          throw new Error(`Failed to update stock for ${product.Brand}`);
        }

        orderItems.push({
          productId: product.productId,
          Brand: product.Brand,
          quantity: product.quantity,
          price: product.Sr_Price,
          subtotal: product.Sr_Price * item.quantity,
        });

        orderTotal += product.Sr_Price * item.quantity;
      }

      await db.collection("orders").insertOne(
        {
          items: orderItems,
          totalAmount: orderTotal,
          createdAt: new Date(),
        },
        { session }
      );
    });

    res.status(200).json({ success: true, message: "✅ Order placed successfully." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  } finally {
    await client.close();
  }
};

module.exports = updateStock;
