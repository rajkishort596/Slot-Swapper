import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { asyncHandler } from "./utils/asyncHandler.js";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(",");

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//test route
app.get(
  "/",
  asyncHandler(async (req, res) => {
    res.send("Slot Swapper API is running!");
  })
);

import userRouter from "./routes/user.routes.js";
import swapRouter from "./routes/swap.routes.js";
import eventRouter from "./routes/event.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/swaps", swapRouter);
app.use("/api/v1/events", eventRouter);

import { errorHandler } from "./middlewares/errorHandler.middleware.js";

app.use(errorHandler);

export { app };
