import { Router } from "express";
import { AdminPaymentsController } from "../controllers/admin.payments.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const adminRouter = Router();

// Manual Payments Management
adminRouter.get("/manual-payments", authMiddleware, AdminPaymentsController.getManualPayments);
adminRouter.post("/manual-payments/:id/approve", authMiddleware, AdminPaymentsController.approveManualPayment);
adminRouter.post("/manual-payments/:id/reject", authMiddleware, AdminPaymentsController.rejectManualPayment);
