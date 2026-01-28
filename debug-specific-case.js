const axios = require("axios");

// Your specific case payload
const specificCasePayload = {
  "extracted_data": {
    "user_name": "आकाश",
    "rate": "4",
    "mobile": "+917073122016",
    "feedback": "Order has not arrived yet; user is concerned about the delay and requested escalation to higher management."
  },
  "status": "completed", // Ensure call is marked as completed
  "conversation_duration": 45.2,
  "transcript": "assistant: नमस्कार hindalco कस्टमर केयर में आपका स्वागत है\nuser: मेरा ऑर्डर अभी तक नहीं आया है, मैं बहुत परेशान हूं",
  "telephony_data": {
    "duration": "45",
    "to_number": "+917073122016",
    "from_number": "+918035735856",
    "recording_url": "https://example.com/recording.mp3",
    "call_type": "outbound",
    "provider": "plivo",
    "hangup_by": "Callee"
  }
};

async function debugSpecificCase(baseUrl = "http://localhost:5001") {
  console.log("🔍 Debugging Specific Case - आकाश's Order Issue\n");
  
  console.log("📦 Payload being sent:");
  console.log(JSON.stringify(specificCasePayload, null, 2));
  console.log("\n");

  try {
    console.log("🚀 Sending request to webhook...");
    const response = await axios.post(
      `${baseUrl}/hindalco-webhook`,
      specificCasePayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000 // 30 second timeout
      }
    );

    console.log("✅ SUCCESS! Case created:");
    console.log("Status:", response.status);
    console.log("Case ID:", response.data.data?.caseId);
    console.log("User Name:", response.data.data?.user_name);
    console.log("Rate:", response.data.data?.rate);
    console.log("Feedback:", response.data.data?.feedback);
    console.log("Mobile:", response.data.data?.mobile || "Not in response");
    console.log("Sentiment:", response.data.data?.sentiment);
    console.log("\nFull Response:");
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error("❌ FAILED to create case:");
    console.error("Status:", error.response?.status);
    console.error("Error Message:", error.response?.data?.error);
    console.error("Missing Fields:", error.response?.data?.missingFields);
    console.error("Received Data:", error.response?.data?.received);
    
    if (error.response?.data) {
      console.error("\nFull Error Response:");
      console.error(JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Network/Connection Error:", error.message);
    }
  }
}

// Test with different variations
async function testVariations(baseUrl = "http://localhost:5001") {
  console.log("\n🧪 Testing Different Variations...\n");

  // Test 1: Without mobile (to see if that's the issue)
  const withoutMobile = {
    ...specificCasePayload,
    extracted_data: {
      ...specificCasePayload.extracted_data,
      mobile: undefined
    }
  };

  console.log("1️⃣ Testing without mobile field...");
  try {
    const response = await axios.post(`${baseUrl}/hindalco-webhook`, withoutMobile, {
      headers: { "Content-Type": "application/json" }
    });
    console.log("✅ Success without mobile:", response.data.data?.caseId);
  } catch (error) {
    console.log("❌ Failed without mobile:", error.response?.data?.error);
  }

  // Test 2: With minimal required fields only
  const minimalPayload = {
    extracted_data: {
      user_name: "आकाश",
      rate: "4", 
      feedback: "Order has not arrived yet; user is concerned about the delay and requested escalation to higher management."
    },
    status: "completed"
  };

  console.log("\n2️⃣ Testing with minimal required fields only...");
  try {
    const response = await axios.post(`${baseUrl}/hindalco-webhook`, minimalPayload, {
      headers: { "Content-Type": "application/json" }
    });
    console.log("✅ Success with minimal fields:", response.data.data?.caseId);
  } catch (error) {
    console.log("❌ Failed with minimal fields:", error.response?.data?.error);
  }
}

// Run the debug
if (require.main === module) {
  const baseUrl = process.argv[2] || "http://localhost:5001";
  console.log(`🔗 Testing against: ${baseUrl}\n`);
  
  debugSpecificCase(baseUrl).then(() => {
    return testVariations(baseUrl);
  });
}

module.exports = { debugSpecificCase, specificCasePayload };