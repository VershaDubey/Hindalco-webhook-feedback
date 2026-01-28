# 📋 Postman Payload Examples for Hindalco Webhook

## 🎯 **Complete Bolna AI Payload Structure**

Copy and paste these payloads directly into Postman for testing.

### ✅ **Success Case - Hindi Content**

```json
{
  "id": "f56b9de9-061b-4842-94fc-aa6347725ad2",
  "agent_id": "ac573cff-0b25-4a56-971d-2270041d2da7",
  "batch_id": null,
  "created_at": "2026-01-16T05:21:31.365265",
  "updated_at": "2026-01-16T05:21:53.692367",
  "conversation_duration": 11.5,
  "total_cost": 2.52,
  "transcript": "assistant: नमस्कार hindalco कस्टमर केयर में आपका स्वागत है में नैना आपकी किस प्रकार सहायता कर सकती हूँ\nuser: मैं आपके प्रोडक्ट के बारे में फीडबैक देना चाहता हूं। आपका सर्विस अच्छा है, मैं 4 स्टार देता हूं।",
  "extracted_data": {
    "user_name": "राजेश कुमार",
    "mobile": "8795583362",
    "rate": "4",
    "feedback": "आपका सर्विस अच्छा है लेकिन डिलीवरी में थोड़ी देरी हुई",
    "email": "rajesh.kumar@example.com",
    "address": "मुंबई, महाराष्ट्र"
  },
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
  "status": "completed",
  "user_number": "+918795583362",
  "agent_number": "+918035735856",
  "initiated_at": "2026-01-16T05:21:32.699100"
}
```

### ❌ **Validation Error Case - Missing Required Fields**

```json
{
  "id": "missing-fields-test-123",
  "agent_id": "ac573cff-0b25-4a56-971d-2270041d2da7",
  "conversation_duration": 60,
  "transcript": "Test transcript without required fields",
  "extracted_data": {
    "user_name": "Test User",
    "mobile": "9876543210"
  },
  "telephony_data": {
    "recording_url": "https://example.com/test-recording.mp3"
  },
  "status": "completed"
}
```

### ✅ **English Content Case**

```json
{
  "id": "english-content-test-456",
  "agent_id": "ac573cff-0b25-4a56-971d-2270041d2da7",
  "conversation_duration": 120,
  "transcript": "assistant: Welcome to Hindalco customer care, I'm Naina, how can I help you?\nuser: I want to give feedback about your product. Your service is excellent, I give 5 stars.",
  "extracted_data": {
    "user_name": "John Smith",
    "mobile": "9876543210",
    "rate": "5",
    "feedback": "Excellent service and product quality. Very satisfied with Hindalco.",
    "email": "john.smith@example.com",
    "address": "Mumbai, Maharashtra"
  },
  "telephony_data": {
    "duration": "120",
    "recording_url": "https://example.com/english-recording.mp3",
    "provider": "plivo"
  },
  "status": "completed"
}
```

### ✅ **Minimal Required Data**

```json
{
  "id": "minimal-test-789",
  "conversation_duration": 45,
  "transcript": "Very satisfied with the service",
  "extracted_data": {
    "user_name": "Priya Sharma",
    "rate": "5",
    "feedback": "Excellent service and product quality!"
  },
  "status": "completed"
}
```

## 🔧 **How to Use in Postman**

### 1. **Set Request Method**
- Method: `POST`
- URL: `{{base_url}}/hindalco-webhook`

### 2. **Set Headers**
```
Content-Type: application/json
```

### 3. **Set Body**
- Select `raw` and `JSON`
- Copy and paste any payload above

### 4. **Expected Responses**

#### **Success Response (200)**
```json
{
  "success": true,
  "message": "Hindalco feedback processed successfully",
  "data": {
    "caseId": "SR-12345",
    "user_name": "राजेश कुमार",
    "rate": "4",
    "feedback": "आपका सर्विस अच्छा है लेकिन डिलीवरी में थोड़ी देरी हुई",
    "sentiment": "Neutral",
    "emailSent": true,
    "whatsappSent": false
  }
}
```

#### **Validation Error Response (400)**
```json
{
  "success": false,
  "error": "Missing required Hindalco fields: user_name, rate, feedback",
  "message": "Failed to process Hindalco feedback"
}
```

## 🌐 **Environment Variables**

Update your Postman environment:

**Local Testing:**
```
base_url = http://localhost:5001
```

**Production Testing:**
```
base_url = https://your-app.onrender.com
```

## 📝 **Key Differences from Original Payload**

### **Hindalco Required Fields:**
- `user_name` ✅ (Required)
- `rate` ✅ (Required) 
- `feedback` ✅ (Required)

### **Optional Fields:**
- `mobile`
- `email`
- `address`

### **Removed Fields:**
- `pincode`
- `technician_visit_date`
- `issuedesc`
- `fulladdress`

The webhook will work with the complete Bolna AI payload structure while focusing on the Hindalco-specific fields in `extracted_data`.