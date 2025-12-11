import dotenv from 'dotenv';
import { createTransport } from 'nodemailer';

dotenv.config();

console.log('Testing nodemailer...');
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Password:', process.env.EMAIL_PASSWORD ? '***SET***' : 'NOT SET');

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

console.log('Transporter created successfully!');

// Verify connection
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Connection failed:', error);
  } else {
    console.log('✅ Server is ready to send emails');
    
    // Send test email
    const mailOptions = {
      from: `"ShareThought" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Test Email from ShareThought',
      html: '<h1>Test Email</h1><p>If you receive this, nodemailer is working!</p>'
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('❌ Send failed:', err);
      } else {
        console.log('✅ Test email sent!', info.messageId);
      }
      process.exit(0);
    });
  }
});
