import express, { Application, Request, Response } from "express";
import userRouter from "./routes/carRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app: Application = express();

app.use(express.json());

app.use("/cars", userRouter);
app.all("{*path}", (_req: Request, res: Response) => {
  res.status(404).json({ message: "Not found." })
});

app.use(errorHandler);


export default app;
