import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

// 🟢 ultra-safe minimal logger (opsiyonel)
app.use((req: Request, res: Response, next: NextFunction) => {
  // İstersen burada console.log koyabilirsin
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// 🟢 health check (Vercel için çok önemli)
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

export default app;