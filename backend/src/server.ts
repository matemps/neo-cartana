import express, { Application, Request, Response } from "express";
import userRouter from "./routes/carRoutes.ts";
import errorHandler from "./middleware/errorHandler.ts";

const app: Application = express();
const PORT : Number = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

app.use("/cars", userRouter);
app.all("{*path}", (_req: Request, res: Response) => {
  res.status(404).json({ message: "Not found." })
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
