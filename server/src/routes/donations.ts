import { Router } from "express";
import { DonationsController } from "../controllers/donations.controller.js";

export const donationsRouter = Router();

donationsRouter.get("/", DonationsController.getAll);
donationsRouter.post("/", DonationsController.create);
donationsRouter.get("/:id", DonationsController.getById);
donationsRouter.delete("/:id", DonationsController.delete);
