import mongoose from "mongoose";

const cartsSchema = mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Products", required: true },
      quantity: { type: Number, default: 1 }
    }
  ],
  createdAt: { type: Date, default: Date.now() },
});

const Cart = mongoose.model("Carts", cartsSchema);

export default Cart;