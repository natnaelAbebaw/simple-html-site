import cors from "cors";
import { CommentController } from "./Controllers/index";
import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { routers } from "./decorators/Routers";
import AppError from "./utils/AppError";

const App: Express = express();

const url = "/api/v1";

App.use(morgan("dev"));
App.use(cors());

App.use(express.json());
App.use(express.urlencoded({ extended: true }));

App.use(url, routers[CommentController.name]);

App.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

App.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
  });
});

export default App;
