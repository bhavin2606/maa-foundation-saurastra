import { Router } from "express";
import { DonationsController } from "../controllers/donations.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

import { upload } from "../middleware/upload.middleware.js";

export const donationsRouter = Router();

donationsRouter.get("/", authMiddleware, DonationsController.getAll);
donationsRouter.post("/", DonationsController.create);
donationsRouter.post("/create-order", DonationsController.createOrder);
donationsRouter.post("/verify", DonationsController.verifyPayment);
donationsRouter.post("/manual", upload.single("screenshot"), DonationsController.manualPayment);
donationsRouter.get("/:id", authMiddleware, DonationsController.getById);
donationsRouter.delete("/:id", authMiddleware, DonationsController.delete);
