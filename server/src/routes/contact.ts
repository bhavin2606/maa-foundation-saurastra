import { Router } from "express";
import { ContactController } from "../controllers/contact.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const contactRouter = Router();

contactRouter.get("/", authMiddleware, ContactController.getAll);
contactRouter.post("/", ContactController.create);
contactRouter.get("/:id", authMiddleware, ContactController.getById);
contactRouter.patch("/:id/status", authMiddleware, ContactController.updateStatus);
contactRouter.delete("/:id", authMiddleware, ContactController.delete);
