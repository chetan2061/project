require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const taskRoutes = require("./routes/taskRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use("/static", express.static(path.join(__dirname, "../frontend")));

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// API routes
app.use("/api/tasks", taskRoutes);

// Error handler
app.use(errorHandler);

// MongoDB connection + start server
mongoose
  .connect(process.env.MONGO_URI) // Removed deprecated options
  .then(() => {
    console.log("Connected to ToDoList Database");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Connection error:", err.message);
    process.exit(1);
  });
