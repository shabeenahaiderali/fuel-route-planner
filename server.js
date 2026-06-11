const express = require("express");
const cors = require("cors");

const processQuestion = require("./agent");

const app = express();

app.use(cors());
app.use(express.json());

// AI endpoint
app.post("/api/agent/chat", async (req, res) => {
  const { message } = req.body;

  const reply = await processQuestion(message);

  res.json({ reply });
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});

app.get("/test", (req, res) => {
  res.json({ message: "Server is working 🚀" });
});