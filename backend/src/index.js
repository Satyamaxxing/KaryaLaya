require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initDB, closeDB } = require("./db");
const { attachRoutes } = require("./routes");
const seed = require("./seed");

const PORT = Number(process.env.PORT || 8000);

async function start() {
  const app = express();

  // 🔥 SIMPLE CORS (FINAL FIX)
  app.use(cors());

  app.use(express.json());

  // ✅ ROOT ROUTE
  app.get("/", (req, res) => {
    res.send("🚀 KaryaLaya Backend is running successfully!");
  });

  try {
    const pool = await initDB();

    await seed();

    attachRoutes(app, pool);

    const server = app.listen(PORT, () => {
      console.log(`✅ Backend listening on port ${PORT}`);
    });

    const shutdown = async () => {
      console.log("Shutting down server...");
      server.close(async () => {
        await closeDB();
        console.log("Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();