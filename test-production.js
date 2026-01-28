const axios = require("axios");

// Replace with your actual Render URL after deployment
const RENDER_URL = "https://hindalco-webhook-api.onrender.com";

async function testProductionWebhook() {
  try {
    console.log("🧪 Testing Production Hindalco Webhook...");
    console.log("🔗 URL:", RENDER_URL);

    // Test 1: Health Check
    console.log("\n1️⃣ Testing Health Check...");
    const healthResponse = await axios.get(`${RENDER_URL}/ping`);
    console.log("✅ Health Check:", healthResponse.data);

    // Test 2: Hindalco Webhook
    console.log("\n2️⃣ Testing Hindalco Webhook...");
    const webhookPayload = {
      extracted_data: {
        user_name: "Production Test User",
        mobile: "9876543210",
        rate: "5",
        feedback: "Testing production deployment - excellent!",
        issuedesc: "Production test case",
        email: "test@example.com"
      },
      transcript: "This is a production test of the Hindalco webhook",
      conversation_duration: 60
    };

    const webhookResponse = await axios.post(
      `${RENDER_URL}/hindalco-webhook`,
      webhookPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Webhook Success:");
    console.log("Status:", webhookResponse.status);
    console.log("Case ID:", webhookResponse.data.data.caseId);
    console.log("Sentiment:", webhookResponse.data.data.sentiment);

  } catch (error) {
    console.error("❌ Production Test Failed:");
    console.error("Status:", error.response?.status);
    console.error("Error:", error.response?.data?.error || error.message);
  }
}

// Update the URL and run
console.log("📝 Instructions:");
console.log("1. Update RENDER_URL with your actual Render app URL");
console.log("2. Run: node test-production.js");
console.log("\n" + "=".repeat(50));

testProductionWebhook();