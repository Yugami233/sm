const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect("your_mongodb_connection_string", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// SMS Schema
const smsSchema = new mongoose.Schema({
  sender: String,
  body: String,
  timestamp: { type: Date, default: Date.now },
});
const SMS = mongoose.model("SMS", smsSchema);

// API Routes
app.post("/api/sms", async (req, res) => {
  try {
    const sms = new SMS(req.body);
    await sms.save();
    res.status(201).json({ message: "✅ SMS saved" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error saving SMS" });
  }
});

app.get("/api/sms", async (req, res) => {
  try {
    const smsList = await SMS.find().sort({ timestamp: -1 });
    res.json(smsList);
  } catch (error) {
    res.status(500).json({ message: "❌ Error retrieving SMS" });
  }
});

// Serve React Frontend
const frontendHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SMS Tracker</title>
</head>
<body>
  <h1>📩 SMS Notification Tracker</h1>
  <script>
    async function sendSMS() {
      const response = await fetch('/api/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: 'John Doe', body: 'Hello World!' })
      });
      const data = await response.json();
      alert(data.message);
    }
  </script>
  <button onclick="sendSMS()">Send SMS</button>
</body>
</html>
`;

app.get("/", (req, res) => {
  res.send(frontendHTML);
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
