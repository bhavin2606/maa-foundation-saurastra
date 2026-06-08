import "./lib/env.js";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { campaignsRouter } from "./routes/campaigns.js";
import { donationsRouter } from "./routes/donations.js";
import { contactRouter } from "./routes/contact.js";
import { reelsRouter } from "./routes/reels.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { authRouter } from "./routes/auth.js";
import { adminRouter } from "./routes/admin.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { logger } from "./lib/logger.js";

const app = express();
const PORT = process.env.PORT || 4000;

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Maa Foundation API",
      version: "1.0.0",
      description: "API documentation for Maa Foundation application",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
const options = {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js'
  ]
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));

const allowedOrigins = [
  "http://localhost:3000", 
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use("/api/campaigns", campaignsRouter);
app.use("/api/donations", donationsRouter);
app.use("/api/payment", donationsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/reels", reelsRouter);
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/dashboard", authMiddleware, dashboardRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    logger.info("Server started", {
      port: PORT,
      docsUrl: `http://localhost:${PORT}/api-docs`,
    });
  });
}

export default app;
