import { Router } from "express";
import { ContactController } from "../controllers/contact.controller.js";

export const contactRouter = Router();

contactRouter.get("/", ContactController.getAll);
contactRouter.post("/", ContactController.create);
contactRouter.get("/:id", ContactController.getById);
contactRouter.delete("/:id", ContactController.delete);
