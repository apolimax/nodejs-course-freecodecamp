require("dotenv").config();
require("express-async-errors");
const express = require("express");
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error-handler");
const PORT = process.env.PORT || 3000;
const app = express();
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");

app.use(express.json());

app.use("/api/v1/products", productsRouter);

app.get("/", (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">producs route</a>');
});

app.use(errorMiddleware);
app.use(notFoundMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
