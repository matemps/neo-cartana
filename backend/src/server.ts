import app from "./app.ts";

const PORT : number = parseInt(process.env.PORT || "3000", 10);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
