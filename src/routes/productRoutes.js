import express from "express";
import ctrl from "../controllers/productController.js";

const router = express.Router();

// CRUD
router.post("/", ctrl.create);
router.get("/", ctrl.list);
router.get("/low-stock", ctrl.lowStock);
router.get("/:id", ctrl.getOne);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

// stock management
router.post("/:id/increase", ctrl.increase);
router.post("/:id/decrease", ctrl.decrease);

export default router;
