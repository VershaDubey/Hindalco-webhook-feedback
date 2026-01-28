# 🔍 Debug Bolna Webhook Issues

## Step 1: Verify Production Deployment

1. **Find your Render URL**:
   - Go to [render.com](https://render.com) dashboard
   - Find your `hindalco-webhook-api` service
   - Copy the URL (should be like `https://hindalco-webhook-api-xxxx.onrender.com`)

2. **Test health endpoint**:
   ```bash
   curl https://your-render-url.onrender.com/ping
   ```
   Should return: `{"success": true, "message": "Server is running fine ✅"}`

## Step 2: Test Webhook Manually

```bash
curl -X POST https://your-render-url.onrender.com/hindalco-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "extracted_data": {
      "user_name": "Manual Test",
      "rate": "5", 
      "feedback": "Testing webhook manually"
    }
  }'
```

## Step 3: Check Bolna Configuration

### In Bolna Dashboard:

1. **Agent Settings** → **Webhooks**
2. **Webhook URL**: `https://your-render-url.onrender.com/hindalco-webhook`
3. **Method**: POST
4. **Headers**: `Content-Type: application/json`
5. **Enabled**: ✅ Yes

### Webhook Trigger Settings:
- **Trigger**: On call completion
- **Include**: extracted_data, transcript, telephony_data
- **Retry**: Enabled (3 attempts)

## Step 4: Check Bolna Logs

1. Go to **Bolna Dashboard** → **Calls** → **Recent Calls**
2. Click on a test call
3. Check **Webhook Logs** section
4. Look for:
   - ✅ Webhook sent successfully
   - ❌ Webhook failed (with error details)
   - 🔄 Webhook retrying

## Step 5: Common Issues & Solutions

### Issue 1: Webhook URL Wrong
**Symptoms**: No webhook received at all
**Solution**: Double-check URL in Bolna matches your Render URL exactly

### Issue 2: SSL/HTTPS Issues  
**Symptoms**: Webhook fails with SSL errors
**Solution**: Ensure using `https://` not `http://`

### Issue 3: Payload Format Mismatch
**Symptoms**: Webhook received but fails validation
**Solution**: Check if Bolna is sending `extracted_data` field

### Issue 4: Server Sleeping (Free Tier)
**Symptoms**: First webhook fails, subsequent ones work
**Solution**: 
- Render free tier sleeps after 15min inactivity
- Consider upgrading to paid tier
- Or use a service to ping your app every 10 minutes

### Issue 5: Environment Variables Missing
**Symptoms**: Webhook receives but fails to create case
**Solution**: Check all env vars are set in Render dashboard

## Step 6: Real Call Test

1. **Make a test call** to your Bolna number
2. **Provide required info**: name, rating, feedback
3. **Complete the call** properly
4. **Check logs** in both:
   - Render logs (for webhook processing)
   - Bolna logs (for webhook delivery)

## Step 7: Monitor Logs

### Render Logs:
```bash
# View real-time logs
# Go to Render Dashboard → Your Service → Logs
```

### Expected Log Output:
```
📦 Hindalco Webhook received payload: {...}
✅ Hindalco Required Fields: {user_name: "...", rate: "...", feedback: "..."}
🔄 Translating transcript and analyzing sentiment...
✅ Translation complete. Sentiment: Positive
🔐 Getting Salesforce token...
📝 Creating Hindalco case in Salesforce...
✅ Hindalco Salesforce Case created: {...}
```

## Quick Test Commands

```bash
# 1. Health check
curl https://your-render-url.onrender.com/ping

# 2. Environment check  
curl https://your-render-url.onrender.com/env-check

# 3. Webhook test
node test-production-webhook.js
```