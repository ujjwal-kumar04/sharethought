# Gmail Email Setup - Complete Guide 📧

## Problem: Mail send nahi ho raha hai

Email service properly configure karna padega. Follow these exact steps:

---

## Step 1: Enable 2-Step Verification (MANDATORY)

1. Go to: **https://myaccount.google.com/security**
2. Find **"2-Step Verification"** section
3. Click **"Get Started"** (if not already enabled)
4. Follow the prompts:
   - Enter your password
   - Add phone number
   - Enter verification code
   - Turn on 2-Step Verification

**✅ You MUST complete this step before proceeding!**

---

## Step 2: Generate App Password

1. Go to: **https://myaccount.google.com/apppasswords**
   - Or: Google Account → Security → 2-Step Verification → App passwords (scroll down)

2. You'll see "App passwords" section

3. Click to generate:
   - **Select app:** Mail
   - **Select device:** Other (Custom name)
   - **Name it:** ShareThought
   - Click **"Generate"**

4. Google will show a **16-character password** like this:
   ```
   abcd efgh ijkl mnop
   ```

5. **Copy this password** (remove spaces):
   ```
   abcdefghijklmnop
   ```

---

## Step 3: Set Environment Variables in Render

1. Go to: **https://dashboard.render.com**

2. Select your **backend service** (sharethought-pyuh or similar)

3. Click **"Environment"** tab in left sidebar

4. Add these variables (if not already added):

   **EMAIL_USER:**
   ```
   yourgmail@gmail.com
   ```
   (Your actual Gmail address)

   **EMAIL_PASSWORD:**
   ```
   abcdefghijklmnop
   ```
   (The 16-character App Password from Step 2, NO SPACES!)

5. Click **"Save Changes"**

---

## Step 4: Deploy/Restart

After adding environment variables:

1. Click **"Manual Deploy"** button
2. Select **"Clear build cache & deploy"**
3. Wait 3-5 minutes for deployment

Or simply:
- Click **"Restart"** button to restart with new env vars

---

## Step 5: Test Email

### Backend logs should show:
```
✅ Email server is ready to send messages
```

### Register a new user:
```
POST /api/auth/register
{
  "name": "Test User",
  "username": "testuser",
  "email": "youremail@gmail.com",
  "password": "test123"
}
```

### Check your Gmail inbox:
- Subject: "Verify Your Email - ShareThought"
- OTP should be in the email

---

## Common Errors & Solutions:

### ❌ Error: "Invalid login: 535-5.7.8 Username and Password not accepted"
**Solution:** 
- You're using regular Gmail password
- Use App Password instead (Step 2)

### ❌ Error: "Connection timeout" / "ETIMEDOUT"
**Solution:** 
- Check EMAIL_USER is correct
- Check EMAIL_PASSWORD has no spaces
- Ensure it's 16-character App Password
- Restart Render service

### ❌ Error: "Less secure app access"
**Solution:** 
- This is old. Gmail now requires App Passwords
- Follow Step 1 & 2 completely

### ❌ Error: "Username and Password not accepted"
**Solution:**
- Revoke old App Password in Google Account
- Generate new App Password
- Update in Render
- Redeploy

---

## Testing Locally (Optional)

1. Create `.env` file in `backend/` folder:
   ```env
   EMAIL_USER=yourgmail@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   JWT_SECRET=your-secret-key
   MONGODB_URI=your-mongodb-uri
   FRONTEND_URL=http://localhost:5173
   PORT=5000
   ```

2. Run backend:
   ```bash
   cd backend
   npm install
   npm start
   ```

3. Check logs:
   ```
   ✅ Email server is ready to send messages
   ```

4. Test registration from frontend

---

## Alternative: Use Ethereal Email (Development Only)

If you don't want to use real Gmail for testing:

1. Go to: **https://ethereal.email/**
2. Click **"Create Ethereal Account"**
3. Copy credentials
4. Update `emailService.js`:

```javascript
const transporter = createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'ethereal.user@ethereal.email',
    pass: 'ethereal.password'
  }
});
```

**Note:** This is only for testing. Emails won't actually deliver.

---

## Production Alternatives to Gmail:

For production apps, consider:

### 1. **SendGrid** (Recommended)
- Free tier: 100 emails/day
- Professional service
- Better deliverability
- Setup: https://sendgrid.com

### 2. **AWS SES**
- Very cheap
- Reliable
- Requires verification

### 3. **Mailgun**
- Free tier: 5000 emails/month
- Easy to use

---

## Verify Current Setup:

Check if email is configured:
```
https://sharethought-pyuh.onrender.com/api/health
```

Should return:
```json
{
  "env": {
    "emailUser": true
  }
}
```

If `emailUser: false`, email credentials are not set.

---

## Quick Checklist:

- [ ] 2-Step Verification enabled on Gmail
- [ ] App Password generated (16 characters)
- [ ] EMAIL_USER set in Render (your Gmail)
- [ ] EMAIL_PASSWORD set in Render (App Password, no spaces)
- [ ] Render service restarted/redeployed
- [ ] Backend logs show "Email server is ready"
- [ ] Test email received in inbox

---

## Still Not Working?

1. **Check Render Logs:**
   - Dashboard → Your Service → Logs
   - Look for email errors

2. **Regenerate App Password:**
   - Delete old one in Google Account
   - Create new one
   - Update in Render
   - Redeploy

3. **Try Different Gmail Account:**
   - Some corporate/organization Gmail accounts have restrictions
   - Use personal Gmail account

4. **Check Gmail Settings:**
   - Make sure IMAP is enabled
   - Settings → Forwarding and POP/IMAP → Enable IMAP

---

## Contact for Help:

If still not working, provide:
- Screenshot of Render environment variables (hide passwords)
- Backend logs during registration
- Error message from frontend

Bas properly follow karo, email zarur jayegi! 🚀📧
