# Hindalco Webhook Feedback System

A Node.js webhook service designed specifically for Hindalco to process customer feedback and automatically create cases in Salesforce.

## Features

- ✅ **Required Fields Processing**: Handles `user_name`, `rate`, `feedback` (mandatory for Hindalco)
- 🤖 **AI-Powered**: OpenAI integration for translation and sentiment analysis
- 📧 **Email Notifications**: Automatic confirmation emails to customers
- 📱 **WhatsApp Integration**: SMS notifications via WhatsApp Business API
- 🔗 **Salesforce Integration**: Automatic case creation with proper categorization
- 🌐 **Multi-language Support**: Translates non-English feedback to English

## API Endpoints

### Health Check
```
GET /ping
```

### Hindalco Webhook
```
POST /hindalco-webhook
```

**Required Fields:**
- `user_name` (string) - Customer name
- `rate` (string/number) - Customer rating (1-5)
- `feedback` (string) - Customer feedback text

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/VershaDubey/Hindalco-webhook-feedback.git
   cd Hindalco-webhook-feedback
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env` file and add your actual API keys
   - See `RENDER-DEPLOYMENT.md` for required variables

4. **Start the server**
   ```bash
   npm start
   ```

5. **Test the webhook**
   ```bash
   npm test
   ```

## Testing

- **Postman Collection**: Import `postman-collection.json` for easy testing
- **Test Script**: Run `node test-hindalco-webhook.js` for automated testing
- **Production Test**: Use `test-production.js` after deployment

## Deployment

This project is ready for deployment on Render. See `RENDER-DEPLOYMENT.md` for detailed instructions.

## Documentation

- `HINDALCO-WEBHOOK.md` - Complete webhook documentation
- `POSTMAN-TESTING.md` - Testing guide with Postman
- `RENDER-DEPLOYMENT.md` - Deployment instructions

## Environment Variables

See `.env` file for all required environment variables. Make sure to set actual values before deployment.

## License

ISC
on the basis of user response model hit the apis
