const axios = require("axios");

// Test your production webhook
async function testProductionWebhook() {
  // Replace with your actual Render URL
  const productionUrl = "https://hindalco-webhook-api.onrender.com";
  
  console.log("🔗 Testing Production Webhook:", productionUrl);
  
  // Test 1: Health check
  try {
    console.log("\n1️⃣ Testing Health Check...");
    const healthResponse = await axios.get(`${productionUrl}/ping`);
    console.log("✅ Health Check Success:", healthResponse.data);
  } catch (error) {
    console.error("❌ Health Check Failed:", error.message);
    console.log("🔍 Check if your app is deployed and running");
    return;
  }
  
  // Test 2: Webhook endpoint
  try {
    console.log("\n2️⃣ Testing Webhook Endpoint...");
    const testPayload = {
      "extracted_data": {
        "user_name": "Production Test User",
        "mobile": "9876543210",
        "rate": "5",
        "feedback": "Testing production webhook from script",
        "email": "test@example.com"
      },
      "transcript": "This is a test call transcript",
      "conversation_duration": 30,
      "telephony_data": {
        "recording_url": "https://example.com/test-recording.mp3"
      }
    };
    
    const webhookResponse = await axios.post(
      `${productionUrl}/hindalco-webhook`,
      testPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    console.log("✅ Webhook Success:");
    console.log("Status:", webhookResponse.status);
    console.log("Case ID:", webhookResponse.data.data?.caseId);
    console.log("Response:", webhookResponse.data);
    
  } catch (error) {
    console.error("❌ Webhook Test Failed:");
    console.error("Status:", error.response?.status);
    console.error("Error:", error.response?.data);
  }
}

// Run the test
testProductionWebhook();