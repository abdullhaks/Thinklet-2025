import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/dbConnection";
import cors from "cors";
import userRouter from "./routes/userRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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

app.options("*", cors()); // handle preflight requests

app.get("/", (req, res) => {
  res.send("my health is running....");
});

connectDB();

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`MyHealth is running on port 3000 http://localhost:${port}`);
});
