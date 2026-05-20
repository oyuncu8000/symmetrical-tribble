import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "API çalışıyor 🚀",
  });
});

app.use("/api", router);

export default app;