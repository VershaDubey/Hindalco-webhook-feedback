const axios = require("axios");

// Test payload for Hindalco webhook
const testPayload = {
  extracted_data: {
    user_name: "Rajesh Kumar",
    mobile: "9876543210",
    rate: "4",                    // Required for Hindalco
    feedback: "Good service, but could be faster", // Required for Hindalco
    issuedesc: "Product quality inquiry",
    email: "rajesh.kumar@example.com",
    address: "123 Industrial Area, Mumbai",
    preferred_date: "2026-01-30T10:00:00Z"
  },
  telephony_data: {
    recording_url: "https://example.com/recording.mp3"
  },
  transcript: "Hello, I wanted to give feedback about your product. The quality is good but delivery was slow.",
  conversation_duration: 120.5
};

async function testHindalcoWebhook() {
  try {
    console.log("🧪 Testing Hindalco Webhook...");
    console.log("📦 Sending payload:", JSON.stringify(testPayload, null, 2));

    const response = await axios.post(
      "http://localhost:5001/hindalco-webhook",
      testPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Success Response:");
    console.log("Status:", response.status);
    console.log("Data:", JSON.stringify(response.data, null, 2));

  } catch (error) {
    console.error("❌ Error Response:");
    console.error("Status:", error.response?.status);
    console.error("Data:", JSON.stringify(error.response?.data, null, 2));
  }
}

// Test with missing required fields
async function testMissingFields() {
  try {
    console.log("\n🧪 Testing with missing required fields...");
    
    const invalidPayload = {
      extracted_data: {
        user_name: "Test User",
        mobile: "9876543210",
        // Missing rate and feedback - should fail
        issuedesc: "Test issue"
      },
      transcript: "Test transcript",
      conversation_duration: 60
    };

    const response = await axios.post(
      "http://localhost:5001/hindalco-webhook",
      invalidPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response:", response.data);

  } catch (error) {
    console.log("✅ Expected error for missing fields:");
    console.log("Status:", error.response?.status);
    console.log("Error:", error.response?.data?.error);
  }
}

// Run tests
async function runTests() {
  console.log("🚀 Starting Hindalco Webhook Tests\n");
  
  await testHindalcoWebhook();
  await testMissingFields();
  
  console.log("\n✅ Tests completed!");
}

runTests();