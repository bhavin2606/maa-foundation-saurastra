import { Router } from "express";
import { CampaignsController } from "../controllers/campaigns.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

export const campaignsRouter = Router();

campaignsRouter.get("/", CampaignsController.getAll);
campaignsRouter.post("/", authMiddleware, upload.single("imageFile"), CampaignsController.create);
campaignsRouter.get("/:id", CampaignsController.getById);
campaignsRouter.put("/:id", authMiddleware, upload.single("imageFile"), CampaignsController.update);
campaignsRouter.delete("/:id", authMiddleware, CampaignsController.delete);
