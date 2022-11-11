require("dotenv").config();
require("express-async-errors");
const connectDB = require("./db/connect");
const express = require("express");

// extra security packages
const helmet = require("helmet"); // protects the server by setting various HTTP headers
const cors = require("cors"); // Cross Origin Resource Sharing - lets control which client can make request to the server
const xss = require("xss-clean"); // sanitize user input (req.body, req.params, req.query)
const rateLimit = require("express-rate-limit"); // limit the number of requests to the server

const app = express();
app.set("trust proxy", 1);

const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authMiddleware = require("./middleware/authentication");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleware, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
