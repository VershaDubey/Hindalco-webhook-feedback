const axios = require("axios");

// Test different call scenarios for Hindalco
async function testCallScenarios() {
  const baseUrl = "http://localhost:5001";
  
  console.log("🧪 HINDALCO Call Scenarios Testing");
  console.log("==================================\n");

  // Scenario 1: Perfect call - All data provided
  console.log("1️⃣ Perfect Call Scenario");
  try {
    const perfectCall = {
      "id": "perfect-call-123",
      "status": "completed",
      "conversation_duration": 65.3,
      "transcript": "assistant: नमस्कार hindalco कस्टमर केयर में आपका स्वागत है\nuser: मैं आपके aluminum products के बारे में feedback देना चाहता हूं। बहुत अच्छी quality है, 5 star rating देता हूं।",
      "extracted_data": {
        "user_name": "अमित शर्मा",
        "mobile": "9876543210",
        "rate": "5",
        "feedback": "Aluminum products की quality excellent है, delivery भी time पर हुई",
        "email": "amit.sharma@example.com",
        "address": "Mumbai, Maharashtra",
        "issuedesc": "कोई issue नहीं है, बस positive feedback देना था"
      },
      "telephony_data": {
        "recording_url": "https://hindalco-recordings.s3.amazonaws.com/perfect-call-123.mp3",
        "duration": "65",
        "call_type": "inbound",
        "hangup_by": "Callee",
        "hangup_reason": "Call completed successfully"
      }
    };

    const response = await axios.post(`${baseUrl}/hindalco-webhook`, perfectCall);
    console.log("✅ Perfect Call Success:");
    console.log(`   Case ID: ${response.data.data.caseId}`);
    console.log(`   Sentiment: ${response.data.data.sentiment}`);
    console.log(`   Recording: ${response.data.data.recordingUrl ? 'Available' : 'Not available'}`);
    
  } catch (error) {
    console.error("❌ Perfect Call Failed:", error.response?.data?.error);
  }

  // Scenario 2: Call cut early - Missing feedback
  console.log("\n2️⃣ Call Cut Early Scenario");
  try {
    const cutCall = {
      "id": "cut-call-456",
      "status": "failed",
      "conversation_duration": 12.1,
      "transcript": "assistant: नमस्कार hindalco कस्टमर केयर में\nuser: हैलो... मैं... [call disconnected]",
      "extracted_data": {
        "user_name": "राज पटेल",
        "mobile": "8765432109",
        "rate": "", // Empty - call cut before rating
        "feedback": "", // Empty - call cut before feedback
        "email": ""
      },
      "telephony_data": {
        "recording_url": "https://hindalco-recordings.s3.amazonaws.com/cut-call-456.mp3",
        "duration": "12",
        "hangup_by": "System",
        "hangup_reason": "Call dropped due to network issue"
      }
    };

    const response = await axios.post(`${baseUrl}/hindalco-webhook`, cutCall);
    console.log("⚠️ Unexpected success for cut call:", response.data);
    
  } catch (error) {
    console.log("✅ Expected validation error:");
    console.log(`   Status: ${error.response?.status}`);
    console.log(`   Missing: ${error.response?.data?.missingFields?.join(', ')}`);
  }

  // Scenario 3: Partial data - Only name and rating
  console.log("\n3️⃣ Partial Data Scenario");
  try {
    const partialCall = {
      "id": "partial-call-789",
      "status": "completed",
      "conversation_duration": 25.7,
      "transcript": "assistant: नमस्कार hindalco कस्टमर केयर में\nuser: मैं सुरेश हूं, आपको 3 star देता हूं।",
      "extracted_data": {
        "user_name": "सुरेश गुप्ता",
        "mobile": "7654321098",
        "rate": "3",
        "feedback": "Average service", // Minimal feedback
        "email": "",
        "address": ""
      },
      "telephony_data": {
        "recording_url": "https://hindalco-recordings.s3.amazonaws.com/partial-call-789.mp3",
        "duration": "25"
      }
    };

    const response = await axios.post(`${baseUrl}/hindalco-webhook`, partialCall);
    console.log("✅ Partial Data Success:");
    console.log(`   Case ID: ${response.data.data.caseId}`);
    console.log(`   User: ${response.data.data.user_name}`);
    console.log(`   Rating: ${response.data.data.rate}`);
    
  } catch (error) {
    console.error("❌ Partial Data Failed:", error.response?.data?.error);
  }

  // Scenario 4: No recording URL
  console.log("\n4️⃣ No Recording URL Scenario");
  try {
    const noRecordingCall = {
      "id": "no-recording-101",
      "status": "completed",
      "conversation_duration": 35.2,
      "transcript": "assistant: नमस्कार hindalco कस्टमर केयर में\nuser: मैं प्रिया हूं, आपका service बहुत अच्छा है, 4 star।",
      "extracted_data": {
        "user_name": "प्रिया सिंह",
        "mobile": "6543210987",
        "rate": "4",
        "feedback": "Service quality अच्छी है, customer support responsive है",
        "email": "priya@example.com"
      },
      "telephony_data": {
        // No recording_url provided
        "duration": "35",
        "call_type": "inbound"
      }
    };

    const response = await axios.post(`${baseUrl}/hindalco-webhook`, noRecordingCall);
    console.log("✅ No Recording Success:");
    console.log(`   Case ID: ${response.data.data.caseId}`);
    console.log(`   Recording: ${response.data.data.recordingUrl || 'Not available'}`);
    
  } catch (error) {
    console.error("❌ No Recording Failed:", error.response?.data?.error);
  }

  // Scenario 5: Long conversation with complaint
  console.log("\n5️⃣ Long Complaint Call Scenario");
  try {
    const complaintCall = {
      "id": "complaint-call-202",
      "status": "completed",
      "conversation_duration": 120.5,
      "transcript": "assistant: नमस्कार hindalco कस्टमर केयर में\nuser: मैं बहुत परेशान हूं, आपके product में defect था, delivery भी late हुई। लेकिन customer service team ने अच्छा handle किया, इसलिए 2 star दे रहा हूं।",
      "extracted_data": {
        "user_name": "विकास अग्रवाल",
        "mobile": "5432109876",
        "rate": "2",
        "feedback": "Product में defect था, delivery late हुई, लेकिन customer service team responsive थी",
        "email": "vikas@example.com",
        "address": "Delhi, India",
        "issuedesc": "Product defect और delivery delay की complaint"
      },
      "telephony_data": {
        "recording_url": "https://hindalco-recordings.s3.amazonaws.com/complaint-call-202.mp3",
        "duration": "120",
        "call_type": "inbound"
      }
    };

    const response = await axios.post(`${baseUrl}/hindalco-webhook`, complaintCall);
    console.log("✅ Complaint Call Success:");
    console.log(`   Case ID: ${response.data.data.caseId}`);
    console.log(`   Sentiment: ${response.data.data.sentiment}`);
    console.log(`   Rating: ${response.data.data.rate} (Low rating handled)`);
    
  } catch (error) {
    console.error("❌ Complaint Call Failed:", error.response?.data?.error);
  }

  console.log("\n📊 Test Summary:");
  console.log("================");
  console.log("✅ Perfect calls should create cases successfully");
  console.log("❌ Cut calls should fail validation (missing required fields)");
  console.log("✅ Partial data calls should work if required fields present");
  console.log("✅ No recording calls should still create cases");
  console.log("✅ Complaint calls should be handled with proper sentiment");
  console.log("\n🔍 Next Steps:");
  console.log("1. Deploy to production");
  console.log("2. Update Bolna webhook URL to /hindalco-webhook");
  console.log("3. Test with real calls");
  console.log("4. Monitor logs for HINDALCO identifiers");
}

// Run tests
if (require.main === module) {
  testCallScenarios().catch(console.error);
}

module.exports = { testCallScenarios };