import express, { Application, Request, Response } from "express";
import errorHandler from "./middleware/errorHandler";

const app: Application = express();
const PORT : Number = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

app.use("/cars", require("./routes/carRoutes"));
app.all("{*path}", (res: Response) => {
  res.status(404).json({ message: "Not found." })
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
