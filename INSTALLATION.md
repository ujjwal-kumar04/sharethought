# 🚀 ShareThought - Installation Instructions (Hindi)

## प्रथम बार सेटअप (First Time Setup)

### आवश्यक सॉफ्टवेयर (Prerequisites)

1. **Node.js** (संस्करण 16 या उससे ऊपर)
   - डाउनलोड करें: https://nodejs.org/
   - इंस्टॉल करने के बाद verify करें:
   ```bash
   node --version
   npm --version
   ```

2. **MongoDB** (दो विकल्प में से एक चुनें)
   
   **विकल्प A: Local MongoDB**
   - डाउनलोड करें: https://www.mongodb.com/try/download/community
   - इंस्टॉल करें और service start करें
   - Verify करें:
   ```bash
   mongod --version
   ```

   **विकल्प B: MongoDB Atlas (Cloud - Recommended)**
   - https://www.mongodb.com/cloud/atlas पर जाएं
   - Free account बनाएं
   - Cluster create करें
   - Connection string copy करें

3. **Git** (Optional, for version control)
   - डाउनलोड करें: https://git-scm.com/

---

## 📦 इंस्टॉलेशन स्टेप्स (Installation Steps)

### स्टेप 1: Dependencies इंस्टॉल करें

#### आसान तरीका (Easy Way):
```bash
# Project folder में जाएं
cd sharethought

# Setup script चलाएं (Windows)
setup.bat
```

#### Manual तरीका:
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies (नई terminal में)
cd frontend
npm install
```

---

### स्टेप 2: MongoDB Setup करें

#### Local MongoDB के लिए:
```bash
# MongoDB start करें
mongod
```

#### MongoDB Atlas के लिए:
1. Atlas dashboard में जाएं
2. "Connect" पर क्लिक करें
3. "Connect your application" चुनें
4. Connection string copy करें
5. Backend `.env` में paste करें

---

### स्टेप 3: Environment Variables सेट करें

**Backend का `.env` file already created है**, लेकिन check करें:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sharethought
JWT_SECRET=your_jwt_secret_key_change_this_in_production_make_it_long_and_random
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important बदलाव:**
- MongoDB Atlas use कर रहे हैं तो `MONGODB_URI` बदलें
- Production में `JWT_SECRET` को strong random string से बदलें

---

### स्टेप 4: Test Users बनाएं (Optional)

```bash
cd backend
npm run create-test-users
```

यह 4 test users बना देगा:
- राज (raj@test.com) / 123456
- प्रिया (priya@test.com) / 123456
- अर्जुन (arjun@test.com) / 123456
- आयुषी (ayushi@test.com) / 123456

---

### स्टेप 5: Application Start करें

#### आसान तरीका (Easy Way):
```bash
# Project root में
start.bat
```

यह दो terminal windows खोलेगा - एक backend के लिए, एक frontend के लिए।

#### Manual तरीका:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

### स्टेप 6: Browser में खोलें

Application खुल जाएगा यहाँ:
```
http://localhost:5173
```

Backend API चल रहा होगा यहाँ:
```
http://localhost:5000
```

---

## ✅ Verification Checklist

Installation सफल है या नहीं, check करें:

- [ ] `node --version` काम कर रहा है
- [ ] `npm --version` काम कर रहा है
- [ ] MongoDB चल रहा है (local या Atlas)
- [ ] Backend dependencies install हैं (`backend/node_modules` exists)
- [ ] Frontend dependencies install हैं (`frontend/node_modules` exists)
- [ ] Backend `.env` file exists और configured है
- [ ] Backend server चल रहा है (Terminal में "Server running" दिख रहा है)
- [ ] Frontend server चल रहा है (Terminal में "Local:" URL दिख रहा है)
- [ ] Browser में http://localhost:5173 खुल रहा है
- [ ] Login page दिख रहा है

---

## 🎯 पहला उपयोग (First Use)

### 1. Register करें
- Register पेज पर जाएं
- Username, Email, Password भरें
- "रजिस्टर करें" बटन क्लिक करें

### 2. Login करें (अगर test user use कर रहे हैं)
- raj@test.com / 123456
- या priya@test.com / 123456

### 3. Dashboard explore करें
- नई पोस्ट बनाएं
- Users search करें
- किसी को follow करें

### 4. Chat test करें
- दो अलग browsers में login करें
- एक-दूसरे को follow करें
- Chat icon पर क्लिक करें
- Message भेजें!

---

## 🐛 Common Problems और Solutions

### समस्या 1: "Cannot connect to MongoDB"
```bash
# Solution:
# 1. Check MongoDB service is running
mongod

# 2. या .env में connection string check करें
```

### समस्या 2: "Port 5000 already in use"
```bash
# Solution: Port को kill करें
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# या .env में PORT बदलें:
PORT=5001
```

### समस्या 3: "npm install failing"
```bash
# Solution: Cache clear करें और retry करें
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install
```

### समस्या 4: "Frontend not loading"
```bash
# Solution:
# 1. Backend चल रहा है check करें
# 2. Browser cache clear करें (Ctrl + Shift + Delete)
# 3. Hard reload करें (Ctrl + Shift + R)
```

### समस्या 5: "Socket connection failed"
```bash
# Solution:
# 1. Backend server restart करें
# 2. Frontend refresh करें
# 3. Browser console में errors check करें
```

---

## 📱 Testing चैट feature

Chat feature को test करने के लिए:

1. **Browser 1 (Chrome):**
   - Login as raj@test.com

2. **Browser 2 (Firefox/Incognito Chrome):**
   - Login as priya@test.com

3. **Browser 1 में:**
   - Search "प्रिया"
   - Profile पर जाएं
   - "फॉलो करें" क्लिक करें

4. **Browser 2 में:**
   - Search "राज"
   - Profile पर जाएं
   - "फॉलो करें" क्लिक करें

5. **अब दोनों में:**
   - "मैसेज करें" बटन दिखेगा
   - क्लिक करें और चैट करें!
   - Real-time messages दिखेंगे

---

## 🎨 Theme Test करना

1. Login करें
2. Top-right में 🌙 या ☀️ icon देखें
3. Click करें - Theme बदल जाएगी
4. Page refresh करें - Theme save रहेगी

---

## 📱 Responsive Design Test करना

### Desktop पर:
- Normal view में use करें (Best experience)

### Mobile पर:
- Browser Developer Tools खोलें (F12)
- Device toolbar toggle करें (Ctrl + Shift + M)
- Different devices select करें:
  - iPhone 12
  - Samsung Galaxy S20
  - iPad
- सभी features काम करने चाहिए

---

## 💾 Data Backup (Optional)

अपने MongoDB data को backup रखना चाहते हैं:

```bash
# Export database
mongodump --db sharethought --out backup/

# Import database
mongorestore --db sharethought backup/sharethought/
```

---

## 🔄 Updates Install करना

अगर future में dependencies update करनी हैं:

```bash
# Backend
cd backend
npm update

# Frontend
cd frontend
npm update
```

---

## 🗑️ Uninstall / Clean करना

अगर project को clean करना चाहते हैं:

```bash
# सभी node_modules delete करें
cd backend
rmdir /s /q node_modules

cd ../frontend
rmdir /s /q node_modules

# MongoDB data delete करें (Optional - CAREFUL!)
# Local MongoDB के लिए:
mongo
use sharethought
db.dropDatabase()
```

---

## 🆘 Help और Support

अगर कोई problem है तो:

1. **Documentation check करें:**
   - README.md
   - DOCUMENTATION.md
   - FEATURES.md

2. **Error messages ध्यान से पढ़ें:**
   - Terminal में backend errors
   - Browser console में frontend errors

3. **Common fixes try करें:**
   - Server restart करें
   - Browser cache clear करें
   - Dependencies reinstall करें

4. **Still stuck?**
   - Error message copy करें
   - Google search करें
   - Stack Overflow check करें

---

## ✅ Installation Successful!

अगर सब कुछ काम कर रहा है तो:
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:5173
- ✅ MongoDB connected
- ✅ Login/Register working
- ✅ Posts creating
- ✅ Follow working
- ✅ Chat working (mutual followers)
- ✅ Theme switching
- ✅ Responsive on all devices

**बधाई हो! 🎉 आपका ShareThought application ready है!**

---

## 📚 Next Steps

अब आप कर सकते हैं:
1. ✅ Code को explore करें
2. ✅ Features को customize करें
3. ✅ नए features add करें
4. ✅ Design को modify करें
5. ✅ Production में deploy करें

---

**Happy Coding! 💻**

**अपनी कहानी साझा करें! Share Your Thoughts!** 🚀
