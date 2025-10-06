import service from "../services/productService.js";

const handle = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    // normalize error
    if (!err) return res.status(500).json({ error: "Unknown error" });
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    return res.status(status).json({ error: message });
  }
};

const create = handle(async (req, res) => {
  const product = await service.createProduct(req.body);
  res.status(201).json(product);
});

const list = handle(async (req, res) => {
  const products = await service.getAllProducts();
  res.json(products);
});

const getOne = handle(async (req, res) => {
  const p = await service.getProductById(req.params.id);
  res.json(p);
});

const update = handle(async (req, res) => {
  const updated = await service.updateProduct(req.params.id, req.body);
  res.json(updated);
});

const remove = handle(async (req, res) => {
  await service.deleteProduct(req.params.id);
  res.status(204).send();
});

const increase = handle(async (req, res) => {
  const { amount } = req.body;
  const updated = await service.increaseStock(
    req.params.id,
    parseInt(amount, 10)
  );
  res.json(updated);
});

const decrease = handle(async (req, res) => {
  const { amount } = req.body;
  const updated = await service.decreaseStock(
    req.params.id,
    parseInt(amount, 10)
  );
  res.json(updated);
});

const lowStock = handle(async (req, res) => {
  const list = await service.listLowStockProducts();
  res.json(list);
});

export { create, list, getOne, update, remove, increase, decrease, lowStock };
