const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`📩 [${req.method}] ${req.url}`);
  next();
});

// Health check
app.get("/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running fine ✅",
    time: new Date().toLocaleString(),
  });
});

// Environment check endpoint
app.get("/env-check", (req, res) => {
  const requiredVars = [
    'OPENAI_API_KEY',
    'RESEND_API_KEY', 
    'SF_CLIENT_ID',
    'SF_CLIENT_SECRET',
    'SF_USERNAME',
    'SF_PASSWORD',
    'WHATSAPP_ACCESS_TOKEN'
  ];

  const envStatus = {};
  const missingVars = [];

  requiredVars.forEach(varName => {
    const exists = !!process.env[varName];
    envStatus[varName] = exists ? '✅ Set' : '❌ Missing';
    if (!exists) missingVars.push(varName);
  });

  const allSet = missingVars.length === 0;

  res.status(allSet ? 200 : 500).json({
    success: allSet,
    message: allSet ? "All environment variables are set" : `Missing ${missingVars.length} environment variables`,
    environmentVariables: envStatus,
    missingVariables: missingVars,
    deploymentReady: allSet
  });
});

// Routes
app.use("/mail", require("./routes/mail"));
app.use("/webhook", require("./routes/webhook"));
app.use("/hindalco-webhook", require("./routes/hindalco-webhook"));

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
