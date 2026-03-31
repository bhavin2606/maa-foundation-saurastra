import express from "express";
import cors from "cors";
import { campaignsRouter } from "./routes/campaigns.js";
import { donationsRouter } from "./routes/donations.js";
import { contactRouter } from "./routes/contact.js";
import { reelsRouter } from "./routes/reels.js";
import { dashboardRouter } from "./routes/dashboard.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
}));
app.use(express.json());

app.use("/api/campaigns", campaignsRouter);
app.use("/api/donations", donationsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/reels", reelsRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
