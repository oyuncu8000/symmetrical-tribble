import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

// 🟢 minimal middleware (safe)
app.use((req: Request, res: Response, next) => {
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// 🟢 health endpoint (Vercel için önemli)
app.get("/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

export default app;