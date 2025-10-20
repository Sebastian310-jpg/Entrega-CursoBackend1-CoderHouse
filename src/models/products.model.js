import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, index: "text" },
  thumbnail: { type: String, default: "" },
  code: { type: String, unique: true, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, default: true },
  category: { type: String, index: true, required: true },
  createdAt: { type: Date, default: Date.now() },
});

productSchema.plugin(paginate);

const Product = mongoose.model("Products", productSchema);

export default Product;