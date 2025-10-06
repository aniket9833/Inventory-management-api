import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
app.use(express.json());
app.use("/products", productRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Something went wrong!" });
});
