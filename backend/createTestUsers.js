import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const testUsers = [
  {
    username: 'राज',
    email: 'raj@test.com',
    password: '123456',
    bio: 'हिंदी साहित्य के शौकीन। कहानियाँ लिखना पसंद है। 📚'
  },
  {
    username: 'प्रिया',
    email: 'priya@test.com',
    password: '123456',
    bio: 'कविता और संगीत प्रेमी। 🎵 जीवन को खूबसूरती से जीना पसंद है।'
  },
  {
    username: 'अर्जुन',
    email: 'arjun@test.com',
    password: '123456',
    bio: 'टेक्नोलॉजी एंथूज़िएस्ट। प्रोग्रामिंग और गैजेट्स के दीवाने। 💻'
  },
  {
    username: 'आयुषी',
    email: 'ayushi@test.com',
    password: '123456',
    bio: 'फोटोग्राफी और यात्रा प्रेमी। दुनिया को कैमरे से देखती हूँ। 📷'
  }
];

async function createTestUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB कनेक्टेड (MongoDB Connected)');

    // Clear existing test users
    await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    console.log('🗑️  पुराने टेस्ट यूजर्स डिलीट किए (Deleted old test users)');

    // Create new test users
    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      console.log(`✅ यूजर बनाया गया (User created): ${userData.username} (${userData.email})`);
    }

    console.log('\n🎉 सभी टेस्ट यूजर्स सफलतापूर्वक बनाए गए! (All test users created successfully!)');
    console.log('\n📝 Login Credentials:');
    testUsers.forEach(user => {
      console.log(`   - ${user.username}: ${user.email} / ${user.password}`);
    });

    console.log('\n💡 Tip: Different browsers या incognito windows में login करें (Login in different browsers or incognito windows)');
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUsers();
