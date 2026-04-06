import { Router } from "express";
import { DonationsController } from "../controllers/donations.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const donationsRouter = Router();

donationsRouter.get("/", authMiddleware, DonationsController.getAll);
donationsRouter.post("/", DonationsController.create);
donationsRouter.post("/create-order", DonationsController.createOrder);
donationsRouter.post("/verify-payment", DonationsController.verifyPayment);
donationsRouter.get("/:id", authMiddleware, DonationsController.getById);
donationsRouter.delete("/:id", authMiddleware, DonationsController.delete);
