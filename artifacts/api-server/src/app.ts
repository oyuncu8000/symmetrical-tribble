import express, { type Express } from "express";
import cors from "cors";
import * as pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// ✅ FIX: pino-http default export workaround
const httpLogger = (pinoHttp as any).default
  ? (pinoHttp as any).default({
      logger,
      serializers: {
        req(req: any) {
          return {
            method: req.method,
            url: req.url?.split("?")[0],
          };
        },
        res(res: any) {
          return {
            statusCode: res.statusCode,
          };
        },
      },
    })
  : (pinoHttp as any)({
      logger,
      serializers: {
        req(req: any) {
          return {
            method: req.method,
            url: req.url?.split("?")[0],
          };
        },
        res(res: any) {
          return {
            statusCode: res.statusCode,
          };
        },
      },
    });

app.use(httpLogger);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;