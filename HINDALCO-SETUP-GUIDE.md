# 🏢 HINDALCO Webhook Setup Guide

## समस्याओं का समाधान

### 1. Recording Issue: Hindalco में Godrej की recording आ रही है

**कारण:**
- Bolna में webhook URL गलत configured है
- Same recording URL multiple companies में share हो रहा है

**समाधान:**

#### A. Bolna Dashboard में सही URL set करें:
```
HINDALCO Webhook URL: https://your-domain.onrender.com/hindalco-webhook
GODREJ Webhook URL: https://your-domain.onrender.com/webhook
```

#### B. Bolna Agent Settings:
1. **HINDALCO Agent** के लिए:
   - Webhook URL: `/hindalco-webhook`
   - Company: "HINDALCO"
   - Recording prefix: "HINDALCO-"

2. **GODREJ Agent** के लिए:
   - Webhook URL: `/webhook`  
   - Company: "GODREJ"
   - Recording prefix: "GODREJ-"

### 2. Case Creation Issue: Call cut होने पर case नहीं बन रहा

**कारण:**
- Required fields missing हैं जब call incomplete होती है
- Validation बहुत strict है

**समाधान:**

#### A. Bolna Agent में बेहतर field extraction:
```javascript
// Agent prompt में add करें:
"Even if call is short, try to extract:
- user_name (कम से कम first name)
- rate (1-5, default 3 if not given)  
- feedback (कम से कम basic feedback)"
```

#### B. Flexible validation अब implemented है:
- Empty strings को handle करता है
- Missing fields को clearly identify करता है
- Call status को track करता है

## Testing Commands

### 1. Debug Script चलाएं:
```bash
node debug-hindalco-issues.js
```

### 2. Production Test:
```bash
node test-production-webhook.js
```

### 3. Specific Hindalco Test:
```bash
node test-hindalco-bolna-payload.js https://your-domain.onrender.com
```

## Bolna Configuration Checklist

### HINDALCO Agent Settings:
- [ ] **Agent Name**: "HINDALCO Customer Care"
- [ ] **Webhook URL**: `https://your-domain.onrender.com/hindalco-webhook`
- [ ] **Webhook Method**: POST
- [ ] **Webhook Headers**: `Content-Type: application/json`
- [ ] **Webhook Trigger**: On call completion
- [ ] **Include Data**: extracted_data, transcript, telephony_data, conversation_duration, status

### Required Field Extraction:
```json
{
  "user_name": "Customer का नाम (required)",
  "mobile": "Phone number (optional)", 
  "rate": "1-5 rating (required)",
  "feedback": "Customer feedback (required)",
  "email": "Email if provided (optional)",
  "issuedesc": "Issue description (optional)"
}
```

### Webhook Payload Structure:
```json
{
  "id": "unique-call-id",
  "status": "completed|failed|in_progress",
  "conversation_duration": 45.5,
  "transcript": "Full conversation transcript",
  "extracted_data": {
    "user_name": "राहुल शर्मा",
    "rate": "5",
    "feedback": "बहुत अच्छा service है"
  },
  "telephony_data": {
    "recording_url": "https://recordings.../hindalco-123.mp3"
  }
}
```

## Monitoring & Debugging

### 1. Real-time Logs देखें:
```bash
# Render Dashboard → Your Service → Logs
# Look for these patterns:
📦 HINDALCO Webhook received payload
✅ HINDALCO Required Fields Validated
📝 Creating HINDALCO case in Salesforce
```

### 2. Common Log Patterns:

#### Success Case:
```
📦 HINDALCO Webhook received payload
🔍 HINDALCO Extracted Fields: {...}
✅ HINDALCO Required Fields Validated
🎵 HINDALCO Recording URL: Provided
📝 Creating HINDALCO case in Salesforce
✅ HINDALCO Salesforce Case created
```

#### Failed Case (Missing Fields):
```
📦 HINDALCO Webhook received payload
❌ HINDALCO Missing required fields: ["rate", "feedback"]
```

#### Failed Case (Call Cut):
```
📞 Call Status: failed
📞 Call Duration: 8.2
⚠️ Call not completed properly, status: failed
```

## Troubleshooting Steps

### Issue: कोई webhook नहीं आ रही
1. Bolna dashboard में webhook URL check करें
2. Server health check करें: `/ping`
3. Webhook logs में errors देखें

### Issue: Webhook आ रही है लेकिन case नहीं बन रहा
1. Required fields check करें
2. Salesforce token valid है या नहीं
3. Environment variables set हैं या नहीं

### Issue: Wrong company की recording आ रही है
1. Webhook URL unique है या नहीं
2. Recording URL में company identifier है या नहीं
3. Bolna agent configuration अलग है या नहीं

## Production Deployment

### Environment Variables:
```
OPENAI_API_KEY=your_openai_key
SF_CLIENT_ID=your_salesforce_client_id
SF_CLIENT_SECRET=your_salesforce_client_secret
SF_USERNAME=your_salesforce_username
SF_PASSWORD=your_salesforce_password
WHATSAPP_ACCESS_TOKEN=your_whatsapp_token
RESEND_API_KEY=your_resend_key
```

### Webhook URLs:
```
HINDALCO: https://your-domain.onrender.com/hindalco-webhook
GODREJ:   https://your-domain.onrender.com/webhook
```

## Support Commands

```bash
# Health check
curl https://your-domain.onrender.com/ping

# Environment check
curl https://your-domain.onrender.com/env-check

# Test HINDALCO webhook
curl -X POST https://your-domain.onrender.com/hindalco-webhook \
  -H "Content-Type: application/json" \
  -d '{"extracted_data":{"user_name":"Test","rate":"5","feedback":"Test"}}'
```