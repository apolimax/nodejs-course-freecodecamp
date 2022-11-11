const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handling");
const tasks = require("./routes/tasks");

// middleware
app.use(express.json()); // parse json body
app.use(express.static("./public")); // serve static files
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

const PORT = process.env.PORT || 3000;

app.use("/api/v1/tasks", tasks);

app.use(notFound);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
};

start();
