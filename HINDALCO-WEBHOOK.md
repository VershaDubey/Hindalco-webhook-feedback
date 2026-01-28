# Hindalco Webhook Documentation

## Overview
This webhook is specifically designed for Hindalco to process customer feedback and automatically create cases in Salesforce.

## Endpoint
```
POST /hindalco-webhook
```

## Required Fields
The webhook expects these **mandatory** fields in the `extracted_data` object:

- `user_name` (string) - Customer name
- `rate` (string/number) - Customer rating (1-5)
- `feedback` (string) - Customer feedback text

## Optional Fields
- `mobile` (string) - Customer mobile number
- `email` (string) - Customer email address
- `issuedesc` (string) - Issue description
- `address` (string) - Customer address
- `preferred_date` (string) - Preferred service date

## Sample Request Payload
```json
{
  "extracted_data": {
    "user_name": "Rajesh Kumar",
    "mobile": "9876543210",
    "rate": "4",
    "feedback": "Good service, but could be faster",
    "issuedesc": "Product quality inquiry",
    "email": "rajesh.kumar@example.com",
    "address": "123 Industrial Area, Mumbai",
    "preferred_date": "2026-01-30T10:00:00Z"
  },
  "telephony_data": {
    "recording_url": "https://example.com/recording.mp3"
  },
  "transcript": "Customer conversation transcript",
  "conversation_duration": 120.5
}
```

## Response Format

### Success Response (200)
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
    "whatsappSent": true
  },
  "salesforceResponse": { ... },
  "emailResponse": { ... },
  "whatsappResponse": { ... }
}
```

### Error Response (400/500)
```json
{
  "success": false,
  "error": "Missing required Hindalco fields: user_name, rate, feedback",
  "message": "Failed to process Hindalco feedback"
}
```

## Features

1. **Automatic Case Creation** - Creates Salesforce case with Hindalco-specific fields
2. **Sentiment Analysis** - Uses OpenAI to analyze customer sentiment
3. **Translation** - Translates non-English feedback to English
4. **Email Notifications** - Sends confirmation email to customer
5. **WhatsApp Notifications** - Sends WhatsApp message (if mobile provided)
6. **Recording Storage** - Stores conversation recording URL

## Testing

Run the test file to verify webhook functionality:
```bash
node test-hindalco-webhook.js
```

## Environment Variables Required

```env
# Salesforce
SF_CLIENT_ID=your_salesforce_client_id
SF_CLIENT_SECRET=your_salesforce_client_secret
SF_USERNAME=your_salesforce_username
SF_PASSWORD=your_salesforce_password

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Email
RESEND_API_KEY=your_resend_api_key

# Server
PORT=5001
```

## Error Handling

The webhook includes comprehensive error handling:
- Validates required fields before processing
- Graceful handling of email/WhatsApp failures
- Detailed error messages for debugging
- Continues processing even if optional services fail

## Integration Notes

1. **Salesforce Integration** - Uses custom Apex REST service at `/services/apexrest/caseService`
2. **WhatsApp Template** - Requires `hindalco_feedback_confirmation` template to be created
3. **Email Template** - Uses custom HTML template for Hindalco branding
4. **Token Management** - Uses cached Salesforce tokens for better performance