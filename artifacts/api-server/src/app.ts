import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import router from "./routes";

const app: Express = express();

// 🟢 Minimal logger yerine boş middleware (Vercel-safe)
app.use((req: Request, res: Response, next) => {
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;