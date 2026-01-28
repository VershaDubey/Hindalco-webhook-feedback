const axios = require("axios");

// Debug script for Hindalco webhook issues
async function debugHindalcoIssues() {
  console.log("🔍 HINDALCO Webhook Debug Script");
  console.log("================================\n");

  // Test different scenarios
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? "https://hindalco-webhook-api.onrender.com" 
    : "http://localhost:5001";

  console.log(`🔗 Testing against: ${baseUrl}\n`);

  // Test 1: Health check
  try {
    console.log("1️⃣ Health Check...");
    const health = await axios.get(`${baseUrl}/ping`);
    console.log("✅ Server is running:", health.data.message);
  } catch (error) {
    console.error("❌ Server not accessible:", error.message);
    return;
  }

  // Test 2: Complete call scenario (should create case)
  try {
    console.log("\n2️⃣ Testing Complete Call Scenario...");
    const completeCallPayload = {
      "id": "hindalco-complete-test",
      "status": "completed", // Important: Call completed
      "conversation_duration": 45.5,
      "transcript": "assistant: नमस्कार hindalco कस्टमर केयर में आपका स्वागत है\nuser: मैं फीडबैक देना चाहता हूं। आपका प्रोडक्ट बहुत अच्छा है, 5 स्टार।",
      "extracted_data": {
        "user_name": "राहुल शर्मा",
        "mobile": "9876543210",
        "rate": "5",
        "feedback": "बहुत अच्छा प्रोडक्ट है, quality excellent है",
        "email": "rahul@example.com",
        "issuedesc": "कोई issue नहीं है, बस feedback देना था"
      },
      "telephony_data": {
        "recording_url": "https://hindalco-recordings.s3.amazonaws.com/hindalco-test-123.mp3",
        "duration": "45",
        "call_type": "inbound",
        "hangup_by": "Callee",
        "hangup_reason": "Call completed normally"
      }
    };

    const response = await axios.post(`${baseUrl}/hindalco-webhook`, completeCallPayload);
    console.log("✅ Complete Call Success:");
    console.log("   Case ID:", response.data.data.caseId);
    console.log("   Recording URL:", response.data.data.recordingUrl);
    console.log("   Company:", response.data.company);

  } catch (error) {
    console.error("❌ Complete Call Test Failed:");
    console.error("   Status:", error.response?.status);
    console.error("   Error:", error.response?.data?.error);
  }

  // Test 3: Incomplete call scenario (call cut)
  try {
    console.log("\n3️⃣ Testing Incomplete Call Scenario (Call Cut)...");
    const incompleteCallPayload = {
      "id": "hindalco-incomplete-test",
      "status": "failed", // Call was cut/failed
      "conversation_duration": 8.2,
      "transcript": "assistant: नमस्कार hindalco कस्टमर केयर में\nuser: हैलो... [call disconnected]",
      "extracted_data": {
        "user_name": "अमित कुमार",
        "mobile": "8765432109",
        "rate": "", // Empty because call was cut
        "feedback": "", // Empty because call was cut
        "email": ""
      },
      "telephony_data": {
        "recording_url": "https://hindalco-recordings.s3.amazonaws.com/hindalco-cut-456.mp3",
        "duration": "8",
        "call_type": "inbound",
        "hangup_by": "System",
        "hangup_reason": "Call dropped"
      }
    };

    const response2 = await axios.post(`${baseUrl}/hindalco-webhook`, incompleteCallPayload);
    console.log("⚠️ Incomplete Call - Should fail validation:");
    console.log("   Response:", response2.data);

  } catch (error) {
    console.log("✅ Expected validation error for incomplete call:");
    console.log("   Status:", error.response?.status);
    console.log("   Missing Fields:", error.response?.data?.missingFields);
  }

  // Test 4: Recording URL verification
  try {
    console.log("\n4️⃣ Testing Recording URL Handling...");
    const recordingTestPayload = {
      "id": "hindalco-recording-test",
      "status": "completed",
      "conversation_duration": 30,
      "transcript": "Test transcript for recording verification",
      "extracted_data": {
        "user_name": "Recording Test User",
        "mobile": "9999999999",
        "rate": "4",
        "feedback": "Testing recording URL handling"
      },
      "telephony_data": {
        "recording_url": "https://hindalco-specific-recordings.s3.amazonaws.com/hindalco-unique-789.mp3",
        "duration": "30",
        "provider": "plivo"
      }
    };

    const response3 = await axios.post(`${baseUrl}/hindalco-webhook`, recordingTestPayload);
    console.log("✅ Recording Test Success:");
    console.log("   Recording URL in response:", response3.data.data.recordingUrl);
    console.log("   Company identifier:", response3.data.company);

  } catch (error) {
    console.error("❌ Recording Test Failed:", error.response?.data);
  }

  console.log("\n🔍 Debug Summary:");
  console.log("================");
  console.log("1. Check Bolna webhook URL is pointing to /hindalco-webhook");
  console.log("2. Ensure calls are completing properly (status: 'completed')");
  console.log("3. Verify required fields (user_name, rate, feedback) are extracted");
  console.log("4. Check recording URLs are HINDALCO-specific");
  console.log("5. Monitor logs for HINDALCO identifiers in console output");
}

// Export for use in other scripts
module.exports = { debugHindalcoIssues };

// Run if executed directly
if (require.main === module) {
  debugHindalcoIssues().catch(console.error);
}