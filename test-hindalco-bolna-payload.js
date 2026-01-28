const axios = require("axios");

// Complete Bolna AI payload structure for Hindalco webhook testing
const hindalcoTestPayload = {
  "id": "f56b9de9-061b-4842-94fc-aa6347725ad2",
  "agent_id": "ac573cff-0b25-4a56-971d-2270041d2da7",
  "batch_id": null,
  "created_at": "2026-01-16T05:21:31.365265",
  "updated_at": "2026-01-16T05:21:53.692367",
  "scheduled_at": null,
  "answered_by_voice_mail": null,
  "conversation_duration": 11.5,
  "total_cost": 2.52,
  "transcript": "assistant: नमस्कार hindalco कस्टमर केयर में आपका स्वागत है में नैना आपकी किस प्रकार सहायता कर सकती हूँ\nuser: मैं आपके प्रोडक्ट के बारे में फीडबैक देना चाहता हूं। आपका सर्विस अच्छा है, मैं 4 स्टार देता हूं।",
  "usage_breakdown": {
    "llmModel": {
      "gpt-4o-mini": {
        "input": 27,
        "output": 32
      },
      "azure/gpt-4.1-mini": {
        "input": 0,
        "output": 0
      }
    },
    "voice_id": "QTKSa2Iyv0yoxvXY2V8a",
    "api_tools": [],
    "llmTokens": 0,
    "buffer_size": 200,
    "endpointing": 1000,
    "provider_source": {
      "llm": "bolna",
      "synthesizer": "bolna",
      "transcriber": "bolna"
    },
    "incremental_delay": 1800,
    "synthesizer_model": "eleven_turbo_v2_5",
    "transcriber_model": "nova-3"
  },
  "cost_breakdown": {
    "llm": 0.002,
    "network": 0.344,
    "platform": 2,
    "synthesizer": 0,
    "transcriber": 0.175
  },
  // HINDALCO SPECIFIC EXTRACTED DATA
  "extracted_data": {
    "user_name": "राजेश कुमार",
    "mobile": "8795583362",
    "rate": "4",                    // Required for Hindalco
    "feedback": "आपका सर्विस अच्छा है लेकिन डिलीवरी में थोड़ी देरी हुई", // Required for Hindalco
    "email": "rajesh.kumar@example.com",
    "address": "मुंबई, महाराष्ट्र"
  },
  "summary": null,
  "error_message": null,
  "status": "completed",
  "agent_extraction": null,
  "workflow_retries": null,
  "rescheduled_at": null,
  "custom_extractions": null,
  "campaign_id": null,
  "smart_status": "completed",
  "user_number": "+918795583362",
  "agent_number": "+918035735856",
  "initiated_at": "2026-01-16T05:21:32.699100",
  "telephony_data": {
    "duration": "12",
    "to_number": "+918795583362",
    "from_number": "+918035735856",
    "recording_url": "https://bolna-recordings-india.s3.ap-south-1.amazonaws.com/plivo/0999335f-162b-4c32-bcad-56e944645a8f.mp3",
    "hosted_telephony": true,
    "provider_call_id": "0999335f-162b-4c32-bcad-56e944645a8f",
    "call_type": "outbound",
    "provider": "plivo",
    "hangup_by": "Callee",
    "hangup_reason": "Call recipient hungup",
    "hangup_provider_code": 4000
  },
  "transfer_call_data": null,
  "context_details": {
    "recipient_data": {
      "timezone": "Asia/Kolkata"
    },
    "recipient_phone_number": "+918795583362"
  },
  "batch_run_details": null,
  "provider": "plivo",
  "latency_data": {
    "stream_id": 154.06299,
    "time_to_first_audio": 155.40259,
    "region": "in",
    "transcriber": {
      "time_to_connect": 79,
      "turns": []
    },
    "llm": {
      "time_to_connect": null,
      "turns": []
    },
    "synthesizer": {
      "time_to_connect": 61,
      "turns": []
    },
    "rag": null
  }
};

// Test payload with missing required fields
const missingFieldsPayload = {
  ...hindalcoTestPayload,
  "id": "missing-fields-test",
  "extracted_data": {
    "user_name": "Test User",
    "mobile": "9876543210",
    // Missing rate and feedback - should fail validation
    "email": "test@example.com"
  }
};

// Test payload with English content
const englishPayload = {
  ...hindalcoTestPayload,
  "id": "english-test",
  "transcript": "assistant: Welcome to Hindalco customer care, I'm Naina, how can I help you?\nuser: I want to give feedback about your product. Your service is good, I give 5 stars.",
  "extracted_data": {
    "user_name": "John Smith",
    "mobile": "9876543210",
    "rate": "5",
    "feedback": "Excellent service and product quality. Very satisfied with Hindalco.",
    "email": "john.smith@example.com",
    "address": "Mumbai, Maharashtra"
  }
};

async function testHindalcoWebhook(baseUrl = "http://localhost:5001") {
  console.log("🧪 Testing Hindalco Webhook with Complete Bolna AI Payload\n");

  // Test 1: Success case with Hindi content
  try {
    console.log("1️⃣ Testing Success Case (Hindi Content)...");
    const response1 = await axios.post(
      `${baseUrl}/hindalco-webhook`,
      hindalcoTestPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Success Response:");
    console.log("Status:", response1.status);
    console.log("Case ID:", response1.data.data.caseId);
    console.log("User Name:", response1.data.data.user_name);
    console.log("Rate:", response1.data.data.rate);
    console.log("Feedback:", response1.data.data.feedback);
    console.log("Sentiment:", response1.data.data.sentiment);
    console.log("");

  } catch (error) {
    console.error("❌ Test 1 Failed:");
    console.error("Status:", error.response?.status);
    console.error("Error:", error.response?.data?.error);
    console.log("");
  }

  // Test 2: Missing required fields
  try {
    console.log("2️⃣ Testing Missing Required Fields...");
    const response2 = await axios.post(
      `${baseUrl}/hindalco-webhook`,
      missingFieldsPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Unexpected success:", response2.data);

  } catch (error) {
    console.log("✅ Expected validation error:");
    console.log("Status:", error.response?.status);
    console.log("Error:", error.response?.data?.error);
    console.log("");
  }

  // Test 3: English content
  try {
    console.log("3️⃣ Testing English Content...");
    const response3 = await axios.post(
      `${baseUrl}/hindalco-webhook`,
      englishPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ English Content Success:");
    console.log("Status:", response3.status);
    console.log("Case ID:", response3.data.data.caseId);
    console.log("Sentiment:", response3.data.data.sentiment);
    console.log("");

  } catch (error) {
    console.error("❌ Test 3 Failed:");
    console.error("Status:", error.response?.status);
    console.error("Error:", error.response?.data?.error);
    console.log("");
  }
}

// Export payloads for use in other tests
module.exports = {
  hindalcoTestPayload,
  missingFieldsPayload,
  englishPayload,
  testHindalcoWebhook
};

// Run tests if this file is executed directly
if (require.main === module) {
  const baseUrl = process.argv[2] || "http://localhost:5001";
  console.log(`🔗 Testing against: ${baseUrl}\n`);
  testHindalcoWebhook(baseUrl);
}