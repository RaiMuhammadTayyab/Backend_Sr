const { client, ObjectId } = require("../db/mongoclient");

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
        // ✅ Fetch product based on productId in cart
        const product = await db.collection(collectionName).findOne(
          { _id: new ObjectId(item.productId) },
          { session }
        );

        // ✅ If product doesn't exist or not enough stock, throw
        if (!product) throw new Error("Product not found");
        if (product.Stock < item.quantity) throw new Error(`${product.Brand} is out of stock`);

        // ✅ Useful debug logs
        console.log("Product ID:", item.productId, "Qty:", item.quantity);
        console.log("Stock before update:", product.Stock);
        console.log("Looking for product with:", { _id: new ObjectId(item.productId), Stock: { $gte: item.quantity } });

        // ✅ Update stock atomically
        const updateResult = await db.collection(collectionName).updateOne(
          { _id: new ObjectId(item.productId), Stock: { $gte: item.quantity } },
          { $inc: { Stock: -item.quantity } },
          { session }
        );

        // ✅ If update fails (e.g., stock condition fails), abort transaction
        if (updateResult.modifiedCount === 0) {
          throw new Error(`❌ Failed to update stock for ${product.Brand}`);
        }

        // ✅ Use item values (not product) for order record
        orderItems.push({
          productId: item.productId,           // ✅ Fixed: use `item.productId`
          Brand: product.Brand,
          quantity: item.quantity,             // ✅ Fixed: use `item.quantity`
          price: product.Sr_Price,
          subtotal: product.Sr_Price * item.quantity,
        });

        orderTotal += product.Sr_Price * item.quantity;
      }

      // ✅ Insert the order
      await db.collection("orders").insertOne(
        {
          items: orderItems,
          totalAmount: orderTotal,
          createdAt: new Date(),
        },
        { session }
      );
    });

    // ✅ Return success response
    return res.status(200).json({ success: true, message: "✅ Order placed successfully." });

  } catch (error) {
    // ✅ Log error
    console.error("❌ Error placing order:", error.message);

    // ✅ Only send error response if headers not already sent
    if (!res.headersSent) {
      return res.status(400).json({ success: false, message: error.message });
    }
  } finally {
    // ✅ Always close session and client
    await client.close();
  }
};

module.exports = updateStock;
