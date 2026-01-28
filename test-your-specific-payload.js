const axios = require("axios");

// Your exact payload from Bolna
const yourSpecificPayload = {
  "id": "6c972873-19b2-44b0-a6bf-d4f690a7a9cf",
  "agent_id": "9fb77fd4-45f6-45e4-86bf-ba5912c6156b",
  "batch_id": null,
  "created_at": "2026-01-28T13:17:50.116924",
  "updated_at": "2026-01-28T13:19:08.672994",
  "scheduled_at": null,
  "answered_by_voice_mail": null,
  "conversation_duration": 68.4,
  "total_cost": 12.71,
  "transcript": "assistant: Hello — this is Naina from Hindalco Primary Aluminium. Am I speaking with Akash?\nassistant: Hey, are you still there\nuser:  yeah i am here my name is विवेक\nassistant:  Thanks, Vivek — just to confirm, I have your name as Vivek. Is that correct?\nassistant: Hey, are you still there\nuser:  yes\nassistant:  Ok sir. Is it a good time for a quick feedback call?\nuser:  yes please tell me\nassistant:  On a scale from 0 to 10, how would you rate your recent experience with Hindalco Primary Aluminium?\nuser:  चार\nassistant:  तो आपने हमें 10 में से 4 अंक दिए हैं, सही है?\nuser:  सही है\nassistant:  हमें यह सुनकर खेद है। क्या आप कृपया बता सकती हैं कि हम क्या बेहतर कर सकती हैं?\nuser:  hello dear this is नाईना from\nassistant:  नमस्ते sir, मैं Naina हूँ Hindalco Primary Aluminium से। क्या अभी थोड़ा समय है — क्या मैं एक छोटा फीडबैक कॉल ले सकती हूँ?\n",
  "usage_breakdown": {
    "llmModel": {
      "gpt-4o-mini": {
        "input": 484,
        "output": 139
      },
      "azure/gpt-4.1-mini": {
        "input": 34553,
        "output": 270
      }
    },
    "voice_id": "2bNrEsM0omyhLiEyOwqY",
    "api_tools": [{
      "key": "transfer_call",
      "name": "transfer_call_917935458163",
      "parameters": {
        "url": null,
        "param": {
          "call_sid": "%(call_sid)s",
          "call_transfer_number": "+917935458163"
        },
        "method": "POST",
        "headers": {},
        "api_token": null
      }
    }],
    "llmTokens": 0,
    "buffer_size": 200,
    "endpointing": 100,
    "provider_source": {
      "llm": "bolna",
      "synthesizer": "bolna",
      "transcriber": "bolna"
    },
    "incremental_delay": 200,
    "synthesizer_model": "eleven_turbo_v2_5",
    "transcriber_model": "nova-3",
    "llm_usage_breakdown": {
      "hangup": null,
      "analytics": null,
      "extraction": {
        "input": 242,
        "model": "gpt-4o-mini",
        "output": 29,
        "provider": "azure",
        "provider_connected": false
      },
      "conversation": {
        "input": 34553,
        "model": "azure/gpt-4.1-mini",
        "output": 270,
        "provider": "azure",
        "provider_connected": false
      },
      "summarization": {
        "input": 242,
        "model": "gpt-4o-mini",
        "output": 110,
        "provider": "azure",
        "provider_connected": false
      }
    },
    "check_if_user_online": true,
    "hangup_after_silence": 10,
    "synthesizer_provider": "elevenlabs",
    "transcriber_duration": 68.39994,
    "transcriber_language": "hi",
    "transcriber_provider": "deepgram",
    "synthesizer_characters": 519,
    "synthesizer_usage_breakdown": {
      "provider_connected": false,
      "welcome_message_cache": true,
      "conversation_characters": 519,
      "welcome_message_characters": 0
    },
    "transcriber_usage_breakdown": {
      "provider_connected": false,
      "transcriber_duration": 68.39994
    },
    "voicemail_detection_enabled": false,
    "trigger_user_online_message_after": 6
  },
  "cost_breakdown": {
    "llm": 1.442,
    "network": 1.032,
    "platform": 4,
    "synthesizer": 5.19,
    "transcriber": 1.049,
    "llm_breakdown": {
      "hangup": 0,
      "analytics": 0,
      "voicemail": 0,
      "extraction": 0.006,
      "conversation": 1.425,
      "summarization": 0.011
    },
    "transfer_cost": 0,
    "synthesizer_breakdown": {
      "conversation": 5.19,
      "welcome_message": 0
    },
    "transcriber_breakdown": {
      "analytics": 0,
      "conversation": 1.049
    }
  },
  "extracted_data": {
    "user_name": "Vivek",
    "rate": "4",
    "mobile": "+917073122016",
    "feedback": ""
  },
  "summary": "The conversation involved an agent named Naina from Hindalco Primary Aluminium attempting to conduct a feedback call with a user who identified himself as Vivek. Naina asked Vivek to rate his recent experience with Hindalco on a scale from 0 to 10, to which Vivek responded with a rating of 4. Naina confirmed the rating and expressed regret, then asked Vivek to provide feedback on how the service could be improved. The call primarily focused on collecting customer feedback regarding Vivek's experience with Hindalco Primary Aluminium.",
  "error_message": null,
  "status": "completed",
  "agent_extraction": null,
  "workflow_retries": null,
  "rescheduled_at": null,
  "custom_extractions": null,
  "campaign_id": null,
  "smart_status": "completed",
  "user_number": "+917073122016",
  "agent_number": "+918035451391",
  "initiated_at": null,
  "deleted": false,
  "retry_config": null,
  "retry_count": 0,
  "retry_history": null,
  "telephony_data": {
    "duration": "69",
    "to_number": "+918035451391",
    "from_number": "+917073122016",
    "recording_url": "https://bolna-recordings-india.s3.ap-south-1.amazonaws.com/plivo/9f83bda8-03d0-466c-9f6c-6424d531fd8c.mp3",
    "hosted_telephony": true,
    "provider_call_id": "9f83bda8-03d0-466c-9f6c-6424d531fd8c",
    "call_type": "inbound",
    "provider": "plivo",
    "hangup_by": "Caller",
    "hangup_reason": "Call recipient hungup",
    "hangup_provider_code": 4000
  },
  "transfer_call_data": null,
  "context_details": {
    "recipient_data": {},
    "recipient_phone_number": "+918035451391"
  },
  "batch_run_details": null,
  "provider": "plivo",
  "latency_data": {
    "stream_id": 116.42065,
    "time_to_first_audio": 117.46924,
    "region": "in",
    "transcriber": {
      "time_to_connect": 78,
      "turns": [{
        "turn": 1,
        "turn_latency": [{
          "sequence_id": 1,
          "audio_to_text_latency": 21.06812,
          "text": "hello"
        }]
      }, {
        "turn": 2,
        "turn_latency": [{
          "sequence_id": 1,
          "audio_to_text_latency": 16.34155,
          "text": "yeah"
        }, {
          "sequence_id": 2,
          "audio_to_text_latency": 20.93042,
          "text": "yeah i'm here my"
        }, {
          "sequence_id": 3,
          "audio_to_text_latency": 27.20483,
          "text": "yeah i am here my name is विवेक"
        }]
      }, {
        "turn": 3,
        "turn_latency": [{
          "sequence_id": 1,
          "audio_to_text_latency": 14.84546,
          "text": "yes"
        }]
      }, {
        "turn": 4,
        "turn_latency": [{
          "sequence_id": 1,
          "audio_to_text_latency": 20.07544,
          "text": "yes"
        }, {
          "sequence_id": 2,
          "audio_to_text_latency": 21.51147,
          "text": "yes please tell me"
        }]
      }, {
        "turn": 5,
        "turn_latency": [{
          "sequence_id": 1,
          "audio_to_text_latency": 14.65649,
          "text": "चार"
        }]
      }, {
        "turn": 6,
        "turn_latency": [{
          "sequence_id": 1,
          "audio_to_text_latency": 14.87134,
          "text": "सही"
        }, {
          "sequence_id": 2,
          "audio_to_text_latency": 16.24219,
          "text": "सही है"
        }]
      }, {
        "turn": 7,
        "turn_latency": [{
          "sequence_id": 1,
          "audio_to_text_latency": 18.98584,
          "text": "hello"
        }, {
          "sequence_id": 2,
          "audio_to_text_latency": 27.78638,
          "text": "hello dear this is नाईना"
        }, {
          "sequence_id": 3,
          "audio_to_text_latency": 28.60449,
          "text": "hello dear this is नाईना from"
        }]
      }, {
        "turn": 8,
        "turn_latency": [{
          "sequence_id": 1,
          "audio_to_text_latency": 37.21997,
          "text": "अब"
        }]
      }]
    },
    "llm": {
      "time_to_connect": null,
      "turns": [{
        "time_to_first_token": 539.05199,
        "time_to_last_token": 994.67909,
        "turn": 1
      }, {
        "time_to_first_token": 541.69895,
        "time_to_last_token": 710.46388,
        "turn": 2
      }, {
        "time_to_first_token": 566.06439,
        "time_to_last_token": 944.88136,
        "turn": 3
      }, {
        "time_to_first_token": 419.09574,
        "time_to_last_token": 638.90493,
        "turn": 4
      }, {
        "time_to_first_token": 639.41219,
        "time_to_last_token": 921.793,
        "turn": 5
      }, {
        "time_to_first_token": 707.4814,
        "time_to_last_token": 1226.9632,
        "turn": 6
      }]
    },
    "synthesizer": {
      "time_to_connect": 61,
      "turns": [{
        "time_to_first_token": 223,
        "time_to_last_token": 425,
        "turn": -1
      }, {
        "time_to_first_token": 301,
        "time_to_last_token": 503,
        "turn": 1
      }, {
        "time_to_first_token": 245,
        "time_to_last_token": 447,
        "turn": -1
      }, {
        "time_to_first_token": 307,
        "time_to_last_token": 508,
        "turn": 2
      }, {
        "time_to_first_token": 327,
        "time_to_last_token": 529,
        "turn": 3
      }, {
        "time_to_first_token": 301,
        "time_to_last_token": 503,
        "turn": 4
      }, {
        "time_to_first_token": 333,
        "time_to_last_token": 536,
        "turn": 5
      }, {
        "time_to_first_token": 405,
        "time_to_last_token": 606,
        "turn": 1
      }]
    },
    "rag": null
  }
};

async function testYourSpecificPayload(baseUrl = "http://localhost:5001") {
  console.log("🧪 Testing Your Specific Bolna Payload\n");
  console.log("📋 Payload Details:");
  console.log("- Customer: Vivek");
  console.log("- Phone: +917073122016");
  console.log("- Rating: 4/10");
  console.log("- Feedback: (empty)");
  console.log("- Call Duration: 68.4 seconds");
  console.log("- Recording: Available");
  console.log("");

  try {
    console.log("🚀 Sending to Hindalco webhook...");
    const response = await axios.post(
      `${baseUrl}/hindalco-webhook`,
      yourSpecificPayload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ SUCCESS! Case Created Automatically:");
    console.log("Status:", response.status);
    console.log("Case ID:", response.data.data.caseId);
    console.log("Customer:", response.data.data.user_name);
    console.log("Rating:", response.data.data.rate);
    console.log("Sentiment:", response.data.data.sentiment);
    console.log("Call Duration:", response.data.data.callDuration);
    console.log("Email Sent:", response.data.data.emailSent);
    console.log("WhatsApp Sent:", response.data.data.whatsappSent);
    console.log("");
    console.log("🎯 Salesforce Case Details:");
    console.log(JSON.stringify(response.data.salesforceResponse, null, 2));

  } catch (error) {
    console.error("❌ FAILED:");
    console.error("Status:", error.response?.status);
    console.error("Error:", error.response?.data?.error);
    console.error("Details:", error.response?.data);
    
    if (error.response?.data?.missingFields) {
      console.error("Missing Fields:", error.response.data.missingFields);
    }
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  const baseUrl = process.argv[2] || "http://localhost:5001";
  console.log(`🔗 Testing against: ${baseUrl}\n`);
  testYourSpecificPayload(baseUrl);
}

module.exports = { yourSpecificPayload, testYourSpecificPayload };