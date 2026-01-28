const express = require("express");
const router = express.Router();
const axios = require("axios");
const sendMail = require("../utils/sendMail");
const { getSalesforceToken } = require("../utils/salesforceAuth");
const OpenAI = require("openai");
require("dotenv").config();

// Check if OpenAI API key exists before initializing
if (!process.env.OPENAI_API_KEY) {
  console.warn("⚠️  OPENAI_API_KEY not found. Translation/sentiment analysis will be disabled.");
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Function to translate transcript to English and analyze sentiment
async function translateAndAnalyzeSentiment(transcript) {
  try {
    if (!openai) {
      console.warn("⚠️  OpenAI service not available - OPENAI_API_KEY missing");
      return {
        translatedText: transcript || "",
        sentiment: "Neutral",
      };
    }

    if (!transcript || transcript.trim() === "") {
      return {
        translatedText: "",
        sentiment: "Neutral",
      };
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that translates text to English and analyzes sentiment. 
          For the given transcript:
          1. Translate it to English if it's in another language (if already in English, return as is)
          2. Analyze the overall sentiment and classify it as one of: Positive, Negative, or Neutral
          
          Respond in JSON format with two fields:
          {
            "translatedText": "the English translation",
            "sentiment": "Positive/Negative/Neutral"
          }`,
        },
        {
          role: "user",
          content: transcript,
        },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content);
    return {
      translatedText: result.translatedText || transcript,
      sentiment: result.sentiment || "Neutral",
    };
  } catch (error) {
    console.error("❌ Error in translation/sentiment analysis:", error.message);
    return {
      translatedText: transcript,
      sentiment: "Neutral",
    };
  }
}

// Function to format conversation duration
function formatDuration(seconds) {
  const totalMilliseconds = Math.floor(seconds * 1000);
  const minutes = Math.floor(totalMilliseconds / 60000);
  const remainingAfterMinutes = totalMilliseconds % 60000;
  const secs = Math.floor(remainingAfterMinutes / 1000);
  const milliseconds = remainingAfterMinutes % 1000;

  let result = "";
  if (minutes > 0) result += `${minutes} min `;
  if (secs > 0) result += `${secs} sec `;
  if (milliseconds > 0) result += `${milliseconds} ms`;

  return result.trim() || "0 sec";
}

// Hindalco Webhook Handler
router.post("/", async (req, res) => {
  try {
    console.log("📦 HINDALCO Webhook received payload:", JSON.stringify(req.body, null, 2));
    console.log("🏢 Processing HINDALCO specific webhook");

    const extracted = req.body.extracted_data;
    const telephoneData = req.body.telephony_data;
    const transcriptedData = req.body.transcript;
    const conversationDuration = req.body.conversation_duration;
    const callStatus = req.body.status; // Check call completion status

    // Log call status for debugging
    console.log("📞 Call Status:", callStatus);
    console.log("📞 Call Duration:", conversationDuration);

    if (!extracted) {
      console.log("❌ No extracted_data found in HINDALCO webhook");
      return res.status(400).json({ 
        error: "No extracted_data found in payload",
        success: false 
      });
    }

    // Check if call was completed properly
    if (callStatus && callStatus !== 'completed') {
      console.log("⚠️ Call not completed properly, status:", callStatus);
      // Still process but log the status
    }

    // Extract required Hindalco fields
    const {
      user_name,
      mobile,
      rate,           
      feedback,       
      issuedesc,
      email,
      address,
      preferred_date
    } = extracted;

    console.log("🔍 HINDALCO Extracted Fields:", {
      user_name,
      mobile: mobile ? "***" + mobile.slice(-4) : "Not provided",
      rate,
      feedback: feedback ? feedback.substring(0, 50) + "..." : "Not provided",
      issuedesc: issuedesc ? "Provided" : "Not provided",
      email: email ? "Provided" : "Not provided"
    });

    // Validate required fields for Hindalco - More flexible validation
    const missingFields = [];
    if (!user_name || user_name.trim() === "") missingFields.push("user_name");
    if (!rate || rate.trim() === "") missingFields.push("rate");
    if (!feedback || feedback.trim() === "") missingFields.push("feedback");

    if (missingFields.length > 0) {
      console.log("❌ HINDALCO Missing required fields:", missingFields);
      return res.status(400).json({
        error: `Missing required Hindalco fields: ${missingFields.join(", ")}`,
        success: false,
        received: { user_name, rate, feedback },
        missingFields: missingFields
      });
    }

    console.log("✅ HINDALCO Required Fields Validated:", { user_name, rate, feedback });

    // Format data - Ensure HINDALCO specific recording URL
    const recordingURL = telephoneData?.recording_url || "";
    console.log("🎵 HINDALCO Recording URL:", recordingURL ? "Provided" : "Not available");
    
    const formattedDuration = formatDuration(conversationDuration || 0);
    const customerEmail = email || "";
    const customerAddress = address || "";
    const preferredDate = preferred_date ? new Date(preferred_date).toLocaleString() : "";

    // Add HINDALCO identifier to recording for tracking
    const hindalcoRecordingNote = recordingURL ? 
      `HINDALCO Call Recording: ${recordingURL}` : 
      "HINDALCO Call - No recording available";

    // Translate transcript and analyze sentiment
    console.log("🔄 Translating transcript and analyzing sentiment...");
    const { translatedText, sentiment } = await translateAndAnalyzeSentiment(transcriptedData);
    console.log("✅ Translation complete. Sentiment:", sentiment);

    // Get Salesforce token
    console.log("🔐 Getting Salesforce token...");
    const accessToken = await getSalesforceToken();

    // Create Salesforce Case for Hindalco
    console.log("📝 Creating HINDALCO case in Salesforce...");
    const sfResponse = await axios.post(
      "https://orgfarm-eb022cf662-dev-ed.develop.my.salesforce.com/services/apexrest/caseService",
      {
        Subject: "HINDALCO Customer Feedback", // Clear HINDALCO identifier
        operation: "insert",
        user_name: user_name,
        Mobile: mobile || "0000000000",  // Use default mobile if not provided
        Rate: rate,                   
        Feedback: feedback,       
        issuedesc: rate || issuedesc || "",
        email: customerEmail,
        preferred_date: preferredDate,
        recording_link: recordingURL,
        transcript: translatedText,
        conversationDueration: formattedDuration,
        sentiment: sentiment,
        Origin: "Phone",
        Priority: "Medium",
        Type: "HINDALCO Feedback",      // Clear HINDALCO identifier
        Company: "HINDALCO",            // Add company field for filtering
        Source: "HINDALCO Voice Bot"    // Add source for tracking
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ HINDALCO Salesforce Case created:", sfResponse.data);
    const caseId = "SR-" + sfResponse.data.caseNumber;

    // Send email notification if email provided
    let emailResponse = null;
    if (customerEmail) {
      console.log("📧 Sending email notification...");
      const emailHTML = `
        <h2 style="color: #004d40;">Hindalco - Feedback Received</h2>
        <p>Dear ${user_name},</p>
        
        <p>Thank you for your valuable feedback. We have received your response:</p>
        
        <p>
          <b>Case ID:</b> ${caseId}<br/>
          <b>Rating:</b> ${rate}<br/>
          <b>Feedback:</b> ${feedback}<br/>
          <b>Issue Description:</b> ${issuedesc || "N/A"}
        </p>
        
        <p>
          <b>Registered Phone:</b> ${mobile}<br/>
          <b>Registered Email:</b> ${customerEmail}
        </p>
        
        <p>We appreciate your time and will use your feedback to improve our services.</p>
        
        <p style="margin-top: 30px;">Regards,<br/><b>Hindalco Customer Service Team</b></p>
      `;

      emailResponse = await sendMail({
        to: customerEmail,
        subject: `Hindalco Feedback Received - Case ${caseId}`,
        html: emailHTML,
      });
    }

    // Send WhatsApp notification if mobile provided
    let whatsappResponse = null;
    if (mobile) {
      console.log("📱 Sending WhatsApp notification...");
      const whatsappMobile = mobile.replace(/^(\+91|91)/, "");
      
      const parameters = [
        user_name || "Customer",
        rate || "N/A",
        feedback || "N/A",
        caseId || "N/A",
        issuedesc || "Thank you for your feedback",
        mobile || "N/A"
      ];

      const whatsappPayload = {
        messaging_product: "whatsapp",
        to: "91" + whatsappMobile,
        type: "template",
        template: {
          name: "hindalco_feedback_confirmation", // You'll need to create this template
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: parameters.map((text) => ({ type: "text", text })),
            },
          ],
        },
      };

      try {
        whatsappResponse = await axios.post(
          "https://graph.facebook.com/v22.0/475003915704924/messages",
          whatsappPayload,
          {
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
              "Content-Type": "application/json",
              "Accept-Encoding": "identity",
            },
          }
        );
      } catch (whatsappError) {
        console.error("⚠️ WhatsApp notification failed:", whatsappError.message);
        // Don't fail the entire request if WhatsApp fails
      }
    }

    // Success response
    res.status(200).json({
      success: true,
      message: "HINDALCO feedback processed successfully",
      company: "HINDALCO",
      data: {
        caseId: caseId,
        user_name: user_name,
        rate: rate,
        feedback: feedback,
        sentiment: sentiment,
        recordingUrl: recordingURL,
        callDuration: formattedDuration,
        emailSent: !!emailResponse,
        whatsappSent: !!whatsappResponse
      },
      salesforceResponse: sfResponse.data,
      emailResponse: emailResponse,
      whatsappResponse: whatsappResponse?.data
    });

  } catch (error) {
    console.error("❌ HINDALCO Webhook error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
      message: "Failed to process HINDALCO feedback",
      company: "HINDALCO"
    });
  }
});

module.exports = router;