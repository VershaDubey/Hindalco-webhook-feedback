# 🚀 Render Deployment Guide for Hindalco Webhook

## Pre-Deployment Checklist

✅ **Local Testing Complete**
- [x] Server runs locally on port 5001
- [x] Postman tests pass
- [x] Required fields validation works
- [x] Salesforce integration working
- [x] Email notifications working

## Deployment Steps

### 1. **Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up/login with GitHub account
3. Connect your GitHub repository

### 2. **Deploy Web Service**

#### Option A: Using Dashboard
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure settings:
   - **Name**: `hindalco-webhook-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free (for testing)

#### Option B: Using render.yaml (Recommended)
1. Push `render.yaml` to your repository
2. Render will auto-detect and deploy

### 3. **Environment Variables Setup**

Add these environment variables in Render dashboard:

```env
NODE_ENV=production
PORT=10000
OPENAI_API_KEY=your_openai_api_key_here
RESEND_API_KEY=your_resend_api_key_here
SF_CLIENT_ID=your_salesforce_client_id_here
SF_CLIENT_SECRET=your_salesforce_client_secret_here
SF_USERNAME=your_salesforce_username_here
SF_PASSWORD=your_salesforce_password_here
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token_here
```

### 4. **Deploy & Test**

1. **Deploy**: Push code to GitHub → Render auto-deploys
2. **Get URL**: Copy your Render app URL (e.g., `https://hindalco-webhook-api.onrender.com`)
3. **Test Health**: `GET https://your-app.onrender.com/ping`
4. **Test Webhook**: `POST https://your-app.onrender.com/hindalco-webhook`

## Production Testing

### Update Postman Environment
1. Open Postman
2. Edit "Hindalco Webhook Environment"
3. Update `base_url` to your Render URL
4. Run all test cases

### Test Commands
```bash
# Health check
curl https://your-app.onrender.com/ping

# Webhook test
curl -X POST https://your-app.onrender.com/hindalco-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "extracted_data": {
      "user_name": "Test User",
      "rate": "5",
      "feedback": "Great service!"
    }
  }'
```

## Monitoring & Logs

### View Logs
1. Go to Render Dashboard
2. Select your service
3. Click **"Logs"** tab
4. Monitor real-time logs

### Health Monitoring
- Render provides automatic health checks
- Service restarts automatically if it crashes
- Monitor uptime in dashboard

## Troubleshooting

### Common Issues:

1. **Build Fails**
   ```
   Solution: Check package.json has correct dependencies
   ```

2. **Environment Variables Missing**
   ```
   Solution: Add all required env vars in Render dashboard
   ```

3. **Port Issues**
   ```
   Solution: Use process.env.PORT || 5001 in server.js
   ```

4. **Salesforce Connection Fails**
   ```
   Solution: Verify SF credentials in environment variables
   ```

## Production URLs

After deployment, your endpoints will be:

- **Health Check**: `https://your-app.onrender.com/ping`
- **Hindalco Webhook**: `https://your-app.onrender.com/hindalco-webhook`
- **Original Webhook**: `https://your-app.onrender.com/webhook`

## Security Notes

- All sensitive data is in environment variables
- HTTPS is automatically provided by Render
- CORS is enabled for cross-origin requests
- Request logging is enabled for debugging

## Next Steps After Deployment

1. **Update Bolna AI** with your new webhook URL
2. **Test end-to-end** with real voice calls
3. **Monitor logs** for any issues
4. **Set up alerts** for critical errors