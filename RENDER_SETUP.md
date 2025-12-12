# Render Deployment Setup Guide

## 500 Error Fix - Environment Variables

The 500 error occurs when required environment variables are not set in Render. Follow these steps:

## Step 1: Set Environment Variables in Render

Go to your Render dashboard → Your backend service → Environment tab and add these variables:

### Required Variables:

1. **MONGODB_URI**
   - Value: Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/sharethought?retryWrites=true&w=majority`
   - Get this from: MongoDB Atlas → Database → Connect → Drivers

2. **JWT_SECRET**
   - Value: A long random string (minimum 32 characters)
   - Example: `your-super-secret-jwt-key-minimum-32-chars-long`
   - Generate: Run in terminal: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

3. **FRONTEND_URL**
   - Value: Your frontend Vercel URL
   - Example: `https://your-app.vercel.app`

4. **EMAIL_USER** (for OTP emails)
   - Value: Your Gmail address
   - Example: `youremail@gmail.com`

5. **EMAIL_PASSWORD** (for OTP emails)
   - Value: Gmail App Password (NOT your regular password)
   - Get this from: Google Account → Security → 2-Step Verification → App passwords

### Optional but Recommended:

6. **PORT**
   - Value: `10000` (Render default) or leave blank

7. **NODE_ENV**
   - Value: `production`

## Step 2: Generate JWT_SECRET

Run this command in your terminal to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as the JWT_SECRET value.

## Step 3: Get Gmail App Password

1. Go to your Google Account settings
2. Security → 2-Step Verification (enable if not already)
3. App passwords → Select app: Mail → Select device: Other (Custom name)
4. Name it "ShareThought" → Generate
5. Copy the 16-character password and use it as EMAIL_PASSWORD

## Step 4: Verify Configuration

After setting all environment variables in Render:

1. Go to your backend service
2. Click "Manual Deploy" → "Deploy latest commit"
3. Wait for deployment to complete
4. Test the health check endpoint:
   ```
   https://sharethought-pyuh.onrender.com/api/health
   ```

This should return:
```json
{
  "status": "ok",
  "mongodb": "connected",
  "env": {
    "jwtSecret": true,
    "mongodbUri": true,
    "frontendUrl": true,
    "emailUser": true
  }
}
```

## Step 5: Update Frontend API URL

Make sure your frontend is pointing to the correct backend URL:

In `frontend/src/context/AuthContext.jsx` and other API calls, ensure:
```javascript
const API_URL = 'https://sharethought-pyuh.onrender.com/api';
```

## Troubleshooting

### If you still get 500 errors:

1. **Check Render Logs**: 
   - Dashboard → Your service → Logs
   - Look for error messages

2. **Verify MongoDB Connection**:
   - Make sure your MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
   - Network Access → Add IP Address → Allow Access from Anywhere

3. **Test Health Endpoint**:
   ```
   curl https://sharethought-pyuh.onrender.com/api/health
   ```

4. **Check if all env vars are set**:
   - Look at health endpoint response
   - All values should be `true`

### Common Issues:

- **MongoDB connection fails**: Check if IP whitelist includes 0.0.0.0/0
- **JWT_SECRET missing**: Generate and add it in Render env vars
- **Email not working**: Verify Gmail app password is correct
- **CORS errors**: Make sure FRONTEND_URL matches your Vercel domain exactly

## Redeploy After Changes

After updating environment variables:
1. Go to Render dashboard
2. Click "Manual Deploy" 
3. Select "Clear build cache & deploy"
4. Wait for completion

Your backend should now work without 500 errors! 🎉
