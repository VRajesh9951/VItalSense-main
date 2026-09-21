require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/db");

const reportsRouter = require("./routes/reports");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const trendsRouter = require("./routes/trends");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "vitalsense-backend", time: new Date().toISOString() });
});

app.use("/api/reports", reportsRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/trends", trendsRouter);

// Fallback error handler (e.g. multer file-type rejections)
app.use((err, req, res, next) => {
  console.error("[server] Unhandled error:", err.message);
  res.status(500).json({ error: err.message || "Internal server error" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\nVitalSense backend running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health\n`);
  });
});
