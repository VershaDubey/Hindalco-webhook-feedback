# 🧪 Postman Testing Guide for Hindalco Webhook

## Setup Instructions

### 1. Import Collection & Environment
1. Open Postman
2. Click **Import** button
3. Import `postman-collection.json` (drag & drop or browse)
4. Import `postman-environment.json` 
5. Select "Hindalco Webhook Environment" from environment dropdown

### 2. Test Endpoints

#### ✅ **Health Check**
- **Method**: GET
- **URL**: `http://localhost:5001/ping`
- **Expected**: 200 OK with server status

#### ✅ **Hindalco Webhook - Success Case**
- **Method**: POST
- **URL**: `http://localhost:5001/hindalco-webhook`
- **Body**: Complete payload with all required fields
- **Expected**: 200 OK with case creation success

#### ❌ **Missing Required Fields Test**
- **Method**: POST
- **URL**: `http://localhost:5001/hindalco-webhook`
- **Body**: Payload without `rate` and `feedback`
- **Expected**: 400 Bad Request with validation error

#### ✅ **Minimal Required Data**
- **Method**: POST
- **URL**: `http://localhost:5001/hindalco-webhook`
- **Body**: Only `user_name`, `rate`, `feedback`
- **Expected**: 200 OK (should work with minimal data)

#### 🌐 **Hindi Transcript Test**
- **Method**: POST
- **URL**: `http://localhost:5001/hindalco-webhook`
- **Body**: Hindi text in transcript and feedback
- **Expected**: 200 OK with translation to English

## Manual Testing Steps

### Test 1: Basic Success Case
```json
POST http://localhost:5001/hindalco-webhook
Content-Type: application/json

{
  "extracted_data": {
    "user_name": "Rajesh Kumar",
    "mobile": "9876543210",
    "rate": "4",
    "feedback": "Good service, but could be faster",
    "issuedesc": "Product quality inquiry",
    "email": "rajesh.kumar@example.com"
  },
  "transcript": "Hello, I wanted to give feedback about your product.",
  "conversation_duration": 120.5
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Hindalco feedback processed successfully",
  "data": {
    "caseId": "SR-12345",
    "user_name": "Rajesh Kumar",
    "rate": "4",
    "feedback": "Good service, but could be faster",
    "sentiment": "Positive",
    "emailSent": true,
    "whatsappSent": false
  }
}
```

### Test 2: Validation Error
```json
POST http://localhost:5001/hindalco-webhook
Content-Type: application/json

{
  "extracted_data": {
    "user_name": "Test User",
    "mobile": "9876543210"
    // Missing rate and feedback
  }
}
```

**Expected Response:**
```json
{
  "success": false,
  "error": "Missing required Hindalco fields: user_name, rate, feedback",
  "received": {
    "user_name": "Test User",
    "rate": null,
    "feedback": null
  }
}
```

## Troubleshooting

### Common Issues:

1. **Server not running**
   - Check if `node server.js` is running
   - Verify port 5001 is available

2. **Salesforce errors**
   - Check `.env` file has correct SF credentials
   - Verify Salesforce org is accessible

3. **OpenAI errors**
   - Verify `OPENAI_API_KEY` in `.env`
   - Check API quota/limits

4. **Email errors**
   - Verify `RESEND_API_KEY` in `.env`
   - Check email format is valid

## Environment Variables Check

Make sure your `.env` file contains:
```env
PORT=5001
OPENAI_API_KEY=sk-proj-...
RESEND_API_KEY=re_...
SF_CLIENT_ID=3MVG9GCM...
SF_CLIENT_SECRET=6A4ADED2D079...
SF_USERNAME=rounak.singh356@agentforce.com
SF_PASSWORD=Crm@2025...
```

## Next Steps

After successful local testing:
1. Deploy to Render
2. Update environment variable `base_url` to your Render URL
3. Test production endpoint