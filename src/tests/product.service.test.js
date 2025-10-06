import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Product from "../src/schema/productSchema.js";
import service from "../src/services/productService.js";
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await Product.deleteMany({});
});

test("increaseStock increases stock by amount", async () => {
  const p = await Product.create({ name: "Item A", stock_quantity: 5 });
  const updated = await service.increaseStock(p._id.toString(), 3);
  expect(updated.stock_quantity).toBe(8);
});

test("decreaseStock decreases stock by amount", async () => {
  const p = await Product.create({ name: "Item B", stock_quantity: 10 });
  const updated = await service.decreaseStock(p._id.toString(), 4);
  expect(updated.stock_quantity).toBe(6);
});

test("decreaseStock throws when insufficient stock", async () => {
  const p = await Product.create({ name: "Item C", stock_quantity: 2 });
  await expect(
    service.decreaseStock(p._id.toString(), 5)
  ).rejects.toMatchObject({
    status: 400,
    message: "Insufficient stock available",
  });
});

test("increaseStock throws for invalid amount", async () => {
  const p = await Product.create({ name: "Item D", stock_quantity: 5 });
  await expect(
    service.increaseStock(p._id.toString(), -3)
  ).rejects.toMatchObject({ status: 400 });
});
test("decreaseStock throws for invalid amount", async () => {
  const p = await Product.create({ name: "Item E", stock_quantity: 5 });
  await expect(
    service.decreaseStock(p._id.toString(), 0)
  ).rejects.toMatchObject({ status: 400 });
});

test("increaseStock throws for invalid product id", async () => {
  await expect(service.increaseStock("invalid-id", 3)).rejects.toMatchObject({
    status: 400,
  });
});
