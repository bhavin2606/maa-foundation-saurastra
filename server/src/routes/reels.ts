import { Router } from "express";
import { ReelsController } from "../controllers/reels.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const reelsRouter = Router();

reelsRouter.get("/", ReelsController.getAll);
reelsRouter.post("/", authMiddleware, ReelsController.create);
reelsRouter.get("/:id", ReelsController.getById);
reelsRouter.put("/:id", authMiddleware, ReelsController.update);
reelsRouter.delete("/:id", authMiddleware, ReelsController.delete);
