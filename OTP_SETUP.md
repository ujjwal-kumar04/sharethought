# OTP Email Verification System

## Overview
ShareThought now has a complete OTP-based email verification system to prevent fake users and ensure authentic registrations.

## Features Implemented

### 🔐 Security Features
- **6-digit OTP** generation for email verification
- **10-minute expiry** for each OTP
- **5 maximum attempts** before requesting new OTP
- **Account verification status** tracking
- **Rate limiting** on OTP resend
- **Verified users only** can login

### 📧 Email Features
- Professional HTML email templates
- OTP email with branding
- Welcome email after verification
- Beautiful gradient design matching ShareThought theme

### 🎯 User Flow
1. User registers with name, username, email, password
2. OTP sent to email (6-digit code)
3. User enters OTP on verification page
4. Upon successful verification:
   - Account marked as verified
   - Welcome email sent
   - JWT token issued
   - Redirected to dashboard

## Installation

### 1. Install Nodemailer
```bash
cd backend
npm install nodemailer
```

### 2. Configure Email Service

#### Option A: Gmail (Development)
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password

4. Update `.env` file:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

#### Option B: Production (SendGrid/AWS SES)
For production, replace Gmail with professional services:

**SendGrid:**
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

**AWS SES:**
```javascript
import aws from '@aws-sdk/client-ses';
import nodemailer from 'nodemailer';

const ses = new aws.SES({
  apiVersion: '2010-12-01',
  region: 'us-east-1'
});

const transporter = nodemailer.createTransporter({
  SES: { ses, aws }
});
```

## API Endpoints

### Register User
```
POST /api/auth/register
Body: { name, username, email, password }
Response: { message, userId, email }
```

### Verify OTP
```
POST /api/auth/verify-otp
Body: { userId, otp }
Response: { message, token, user }
```

### Resend OTP
```
POST /api/auth/resend-otp
Body: { userId }
Response: { message, email }
```

### Login (Verified Users Only)
```
POST /api/auth/login
Body: { email, password }
Response: 
  - Success: { token, user }
  - Not Verified: { error, userId, needsVerification: true }
```

## Frontend Pages

### VerifyOTP.jsx
- 6-digit OTP input with automatic formatting
- 10-minute countdown timer
- Resend OTP functionality
- Error handling with attempt counter
- Success message before redirect

### Updated Register.jsx
- Redirects to OTP verification after registration
- Passes userId and email via navigation state

### Updated Login.jsx
- Checks verification status
- Redirects to OTP page if not verified

## Database Schema Changes

### User Model
```javascript
{
  name: String (new),
  username: String,
  email: String,
  password: String,
  bio: String,
  isVerified: Boolean (new),
  otp: String (new),
  otpExpiry: Date (new),
  otpAttempts: Number (new),
  followers: [ObjectId],
  following: [ObjectId],
  createdAt: Date
}
```

## Testing

### Development Testing (Console Logs)
The OTP is logged to console for testing:
```bash
OTP for user@example.com: 123456
```

### With Email (Gmail)
1. Configure Gmail app password in `.env`
2. Register a new user
3. Check email for OTP
4. Enter OTP on verification page

## Security Best Practices

### ✅ Implemented
- OTP expires after 10 minutes
- Maximum 5 verification attempts
- Hashed passwords with bcryptjs
- JWT token only after verification
- Verified status check on login

### 🔒 Production Recommendations
1. **Use HTTPS** for all API calls
2. **Rate limit** registration endpoint (prevent spam)
3. **CAPTCHA** on registration form
4. **Email validation** for disposable emails
5. **IP tracking** for suspicious activity
6. **2FA option** for additional security

## Email Templates

### OTP Email
- ShareThought branded header
- Large, centered 6-digit OTP
- Validity duration (10 minutes)
- Security warning
- Beautiful gradient design

### Welcome Email
- Personalized greeting
- Feature highlights
- Call-to-action button
- Encouragement message

## Troubleshooting

### Email Not Sending
1. Check `.env` file has correct credentials
2. Verify Gmail app password (not regular password)
3. Check console for error messages
4. Ensure 2FA is enabled on Gmail

### OTP Expired
- User can click "Resend OTP"
- New OTP generated with fresh 10-minute timer

### Too Many Attempts
- After 5 failed attempts, user must request new OTP
- OTP attempts reset when new OTP is sent

## Future Enhancements

### Potential Features
- [ ] SMS OTP as backup option
- [ ] Social login (Google, Facebook)
- [ ] Password reset via OTP
- [ ] Email change verification
- [ ] Remember device (trusted devices)
- [ ] Login history tracking
- [ ] Suspicious activity alerts

## Environment Variables

```env
# Required for OTP System
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173

# Existing Variables
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sharethought
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## File Structure

```
backend/
├── models/
│   └── User.js (updated with OTP fields)
├── routes/
│   └── auth.js (added OTP endpoints)
├── utils/
│   └── emailService.js (new - email functions)
└── .env (updated with email config)

frontend/
├── src/
│   ├── pages/
│   │   ├── Register.jsx (updated)
│   │   ├── Login.jsx (updated)
│   │   └── VerifyOTP.jsx (new)
│   ├── styles/
│   │   └── Auth.css (updated with OTP styles)
│   └── App.jsx (added VerifyOTP route)
```

## Summary

Ab ShareThought me:
✅ Fake users register nahi ho sakte
✅ Email verification zaroori hai
✅ Professional email templates
✅ Secure OTP system with expiry
✅ Rate limiting and attempt tracking
✅ Beautiful verification UI
✅ Welcome email after verification

Users ko ab register karne ke baad OTP verify karna padega, tabhi vo login kar payenge! 🎉
