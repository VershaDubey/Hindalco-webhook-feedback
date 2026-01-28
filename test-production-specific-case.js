const axios = require("axios");

// Your specific case payload - exactly as you provided
const productionCasePayload = {
  "extracted_data": {
    "user_name": "आकाश",
    "rate": "4", 
    "mobile": "+917073122016",
    "feedback": "Order has not arrived yet; user is concerned about the delay and requested escalation to higher management."
  },
  // Add these fields that Bolna AI typically sends
  "status": "completed",
  "conversation_duration": 45.2,
  "transcript": "assistant: नमस्कार hindalco कस्टमर केयर में आपका स्वागत है\nuser: मेरा ऑर्डर अभी तक नहीं आया है, मैं बहुत परेशान हूं",
  "telephony_data": {
    "duration": "45",
    "to_number": "+917073122016", 
    "from_number": "+918035735856",
    "recording_url": "https://bolna-recordings-india.s3.ap-south-1.amazonaws.com/plivo/example.mp3",
    "call_type": "outbound",
    "provider": "plivo",
    "hangup_by": "Callee"
  }
};

async function testProductionWebhook() {
  // Test against your production URL (update this with your actual Render URL)
  const productionUrl = "https://hindalco-webhook-api.onrender.com"; // Update this!
  
  console.log("🌐 Testing Production Webhook for आकाश's Case");
  console.log(`🔗 Production URL: ${productionUrl}/hindalco-webhook\n`);

  try {
    console.log("🚀 Sending आकाश's case to production...");
    const response = await axios.post(
      `${productionUrl}/hindalco-webhook`,
      productionCasePayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000 // 30 second timeout for production
      }
    );

    console.log("✅ PRODUCTION SUCCESS!");
    console.log("Status:", response.status);
    console.log("Case ID:", response.data.data?.caseId);
    console.log("User Name:", response.data.data?.user_name);
    console.log("Rate:", response.data.data?.rate);
    console.log("Feedback:", response.data.data?.feedback?.substring(0, 50) + "...");
    console.log("Sentiment:", response.data.data?.sentiment);
    console.log("Email Sent:", response.data.data?.emailSent);
    console.log("WhatsApp Sent:", response.data.data?.whatsappSent);
    
    console.log("\n📊 Salesforce Response:");
    console.log("Case Number:", response.data.salesforceResponse?.caseNumber);
    console.log("Case ID:", response.data.salesforceResponse?.caseId);
    console.log("Contact ID:", response.data.salesforceResponse?.contactId);

  } catch (error) {
    console.error("❌ PRODUCTION FAILED:");
    
    if (error.code === 'ECONNREFUSED') {
      console.error("🔌 Connection refused - Server might not be running");
    } else if (error.code === 'ENOTFOUND') {
      console.error("🌐 DNS error - Check the production URL");
    } else if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Error:", error.response.data?.error);
      console.error("Missing Fields:", error.response.data?.missingFields);
      
      if (error.response.status === 500) {
        console.error("\n🔧 Possible Issues:");
        console.error("- Environment variables not set in production");
        console.error("- Salesforce credentials incorrect");
        console.error("- OpenAI API key missing");
      }
    } else {
      console.error("Network Error:", error.message);
    }
  }
}

// Test health check first
async function testProductionHealth() {
  const productionUrl = "https://hindalco-webhook-api.onrender.com"; // Update this!
  
  console.log("🏥 Testing Production Health Check...");
  
  try {
    const response = await axios.get(`${productionUrl}/ping`, { timeout: 10000 });
    console.log("✅ Production server is running");
    console.log("Response:", response.data.message);
    return true;
  } catch (error) {
    console.error("❌ Production server health check failed:");
    console.error("Error:", error.message);
    return false;
  }
}

// Run the tests
async function runProductionTests() {
  console.log("🧪 Production Environment Testing\n");
  
  // First check if server is running
  const isHealthy = await testProductionHealth();
  console.log("");
  
  if (isHealthy) {
    // Then test the specific webhook
    await testProductionWebhook();
  } else {
    console.log("⚠️  Skipping webhook test - server not accessible");
    console.log("\n🔧 Troubleshooting Steps:");
    console.log("1. Check if your Render deployment is successful");
    console.log("2. Verify the production URL is correct");
    console.log("3. Check Render logs for any startup errors");
    console.log("4. Ensure all environment variables are set in Render dashboard");
  }
}

if (require.main === module) {
  runProductionTests();
}

module.exports = { testProductionWebhook, productionCasePayload };