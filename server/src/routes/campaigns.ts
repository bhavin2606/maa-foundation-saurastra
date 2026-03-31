import { Router } from "express";
import { CampaignsController } from "../controllers/campaigns.controller.js";

export const campaignsRouter = Router();

campaignsRouter.get("/", CampaignsController.getAll);
campaignsRouter.post("/", CampaignsController.create);
campaignsRouter.get("/:id", CampaignsController.getById);
campaignsRouter.put("/:id", CampaignsController.update);
campaignsRouter.delete("/:id", CampaignsController.delete);
