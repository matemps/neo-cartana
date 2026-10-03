import express, { Application, Request, Response } from "express";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import carRouter from "./routes/carRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app: Application = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use("/cars", carRouter);
app.all("{*path}", (_req: Request, res: Response) => {
  res.status(404).json({ message: "Not found." })
});

app.use(errorHandler);


export default app;
