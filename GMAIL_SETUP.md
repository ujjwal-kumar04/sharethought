# Email Setup Guide for ShareThought 📧

## 🚨 Problem: Render Blocks Gmail SMTP (Connection Timeout)

Render aur bahut saare cloud providers SMTP ports (25, 465, 587) block karte hain security ke liye. Isliye Gmail se email nahi jaa raha.

---

## ✅ Solution 1: Resend (RECOMMENDED - FREE)

Resend Render pe perfect kaam karta hai aur 100 emails/day free hai!

### Step 1: Resend Account Banao
1. [resend.com](https://resend.com) pe jao
2. GitHub ya email se signup karo
3. Email verify karo

### Step 2: API Key Lo
1. Dashboard → API Keys pe jao
2. "Create API Key" pe click karo
3. Key copy karo (starts with `re_`)

### Step 3: Render pe Environment Variables Set Karo
```
RESEND_API_KEY=re_your_api_key_here
EMAIL_USER=onboarding@resend.dev
```

**Testing ke liye**: `onboarding@resend.dev` use kar sakte ho

**Production ke liye**: Apna domain add karo Resend pe

---

## ✅ Solution 2: Brevo (FREE - 300 emails/day)

### Step 1: Brevo Account Banao
1. [brevo.com](https://brevo.com) pe jao
2. Free signup karo

### Step 2: SMTP Key Lo
1. Settings → SMTP & API pe jao
2. SMTP Key copy karo

### Step 3: Render pe Set Karo
```
BREVO_API_KEY=your_brevo_smtp_key
EMAIL_USER=your-email@domain.com
```

---

## Gmail Setup (May Not Work on Render)

Agar phir bhi Gmail try karna hai:

### Step 1: 2-Factor Authentication Enable Karo
1. [myaccount.google.com](https://myaccount.google.com) pe jao
2. Security → 2-Step Verification → ON karo

### Step 2: App Password Banao
1. [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) pe jao
2. "Mail" aur "Other" select karo
3. "ShareThought" naam do
4. 16-character password copy karo

### Step 3: Render pe Set Karo
```
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

---

## 🎯 Quick Setup (Fastest Way)

1. [resend.com](https://resend.com) pe jao
2. GitHub se signup karo
3. API Key lo
4. Render pe ye set karo:
```
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_USER=onboarding@resend.dev
```
5. Render service restart karo
6. Done! ✅

---

## Verify Karo

1. Render service restart karo
2. Naya user register karo
3. Logs me dekho: "✅ OTP Email sent successfully!"
4. Email inbox check karo (spam bhi check karo)

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| Connection timeout | Resend use karo, Gmail nahi |
| Authentication failed | API key check karo |
| Email spam me gaya | Domain verify karo Resend pe |
| Email nahi aaya | Spam folder check karo |