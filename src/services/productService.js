import Product from "../schema/productSchema.js";
import mongoose from "mongoose";

const createProduct = async ({
  name,
  description = "",
  stock_quantity = 0,
  low_stock_threshold = 0,
}) => {
  if (!name || typeof name !== "string")
    throw { status: 400, message: "Name is required" };
  if (stock_quantity < 0)
    throw { status: 400, message: "stock_quantity cannot be negative" };
  if (low_stock_threshold < 0)
    throw { status: 400, message: "low_stock_threshold cannot be negative" };

  const product = new Product({
    name,
    description,
    stock_quantity,
    low_stock_threshold,
  });
  return await product.save();
};

const getAllProducts = async () => {
  return await Product.find().sort({ createdAt: -1 }).lean();
};

const getProductById = async (id) => {
  if (!mongoose.isValidObjectId(id))
    throw { status: 400, message: "Invalid product id" };
  const p = await Product.findById(id).lean();
  if (!p) throw { status: 404, message: "Product not found" };
  return p;
};

const updateProduct = async (id, update) => {
  if (!mongoose.isValidObjectId(id))
    throw { status: 400, message: "Invalid product id" };
  if (update.stock_quantity != null && update.stock_quantity < 0) {
    throw { status: 400, message: "stock_quantity cannot be negative" };
  }
  // Use findByIdAndUpdate with { new: true } for updated doc
  const updated = await Product.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
  if (!updated) throw { status: 404, message: "Product not found" };
  return updated;
};

const deleteProduct = async (id) => {
  if (!mongoose.isValidObjectId(id))
    throw { status: 400, message: "Invalid product id" };
  const res = await Product.findByIdAndDelete(id);
  if (!res) throw { status: 404, message: "Product not found" };
  return;
};

const increaseStock = async (id, amount) => {
  if (!mongoose.isValidObjectId(id))
    throw { status: 400, message: "Invalid product id" };
  if (!Number.isInteger(amount) || amount <= 0)
    throw { status: 400, message: "amount must be a positive integer" };

  const updated = await Product.findByIdAndUpdate(
    id,
    { $inc: { stock_quantity: amount } },
    { new: true, runValidators: true }
  );
  if (!updated) throw { status: 404, message: "Product not found" };
  return updated;
};

const decreaseStock = async (id, amount) => {
  if (!mongoose.isValidObjectId(id))
    throw { status: 400, message: "Invalid product id" };
  if (!Number.isInteger(amount) || amount <= 0)
    throw { status: 400, message: "amount must be a positive integer" };

  // Atomic check-and-decrement: only update if enough stock present
  const updated = await Product.findOneAndUpdate(
    { _id: id, stock_quantity: { $gte: amount } },
    { $inc: { stock_quantity: -amount } },
    { new: true, runValidators: true }
  );

  if (!updated) {
    // Could be either product not found, or insufficient stock.
    const exists = await Product.exists({ _id: id });
    if (!exists) throw { status: 404, message: "Product not found" };
    throw { status: 400, message: "Insufficient stock available" };
  }
  return updated;
};

const listLowStockProducts = async () => {
  // return products where stock_quantity < low_stock_threshold
  return await Product.find({
    $expr: { $lt: ["$stock_quantity", "$low_stock_threshold"] },
  }).lean();
};

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  increaseStock,
  decreaseStock,
  listLowStockProducts,
};
