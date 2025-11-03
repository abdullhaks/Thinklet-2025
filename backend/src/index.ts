import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/dbConnection";
import cors from "cors";
import userRouter from "./routes/userRoutes";

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://www.thinklet.abdullhakalamban.online",
  "https://thinklet.abdullhakalamban.online",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);

app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).send("✅ MyHealth backend running on Vercel!");
});

connectDB();

app.use("/api/user", userRouter);

// ✅ DO NOT CALL app.listen()
// Vercel needs a default export instead
export default app;


