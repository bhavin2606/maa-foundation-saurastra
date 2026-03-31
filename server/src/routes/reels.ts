import { Router } from "express";
import { ReelsController } from "../controllers/reels.controller.js";

export const reelsRouter = Router();

reelsRouter.get("/", ReelsController.getAll);
reelsRouter.post("/", ReelsController.create);
reelsRouter.get("/:id", ReelsController.getById);
reelsRouter.put("/:id", ReelsController.update);
reelsRouter.delete("/:id", ReelsController.delete);
