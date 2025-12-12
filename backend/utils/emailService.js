import { createTransport } from 'nodemailer';

// Email transporter configuration - supports multiple providers
const createTransporter = () => {
  // Check for Resend API Key first (recommended for Render)
  if (process.env.RESEND_API_KEY) {
    console.log('📧 Using Resend email service');
    return createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY
      }
    });
  }
  
  // Check for Brevo (Sendinblue) - also works well on Render
  if (process.env.BREVO_API_KEY) {
    console.log('📧 Using Brevo email service');
    return createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.BREVO_API_KEY
      }
    });
  }

  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️ Email credentials not configured. OTP emails will not be sent.');
    return null;
  }
  
  // Determine email provider from EMAIL_USER
  const emailUser = process.env.EMAIL_USER;
  let transportConfig;
  
  if (emailUser.includes('@gmail.com')) {
    // Gmail configuration with multiple fallback options
    transportConfig = {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      }
    };
  } else if (emailUser.includes('@outlook.com') || emailUser.includes('@hotmail.com')) {
    // Outlook/Hotmail configuration
    transportConfig = {
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      }
    };
  } else if (emailUser.includes('@yahoo.com')) {
    // Yahoo configuration
    transportConfig = {
      host: 'smtp.mail.yahoo.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    };
  } else {
    // Generic SMTP configuration (for custom domains or other providers)
    // Uses SMTP_HOST and SMTP_PORT env variables if available
    transportConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    };
  }

  // Add common settings
  transportConfig.connectionTimeout = 30000; // 30 seconds (increased)
  transportConfig.greetingTimeout = 15000;   // 15 seconds (increased)
  transportConfig.socketTimeout = 30000;     // 30 seconds (increased)
  transportConfig.pool = true;               // Use pooled connections
  transportConfig.maxConnections = 5;
  transportConfig.maxMessages = 100;

  console.log(`📧 Creating email transporter for: ${emailUser}`);
  console.log(`📧 SMTP Host: ${transportConfig.host}:${transportConfig.port}`);
  
  const transporter = createTransport(transportConfig);

  // Verify transporter configuration (async, won't block)
  transporter.verify()
    .then(() => {
      console.log('✅ Email server is ready to send messages');
    })
    .catch((error) => {
      console.error('❌ Email transporter verification failed:', error.message);
      console.error('🔴 Tips to fix:');
      console.error('   1. For Gmail: Enable 2FA and create App Password');
      console.error('   2. App Password: https://myaccount.google.com/apppasswords');
      console.error('   3. Use App Password (16 chars without spaces)');
      console.error('   4. Check if "Less secure apps" is needed for your account');
    });

  return transporter;
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter();
    
    // If email is not configured, throw error
    if (!transporter) {
      console.log('\n' + '='.repeat(60));
      console.log('⚠️ EMAIL NOT CONFIGURED - Development Mode');
      console.log(`📧 OTP for ${email}: ${otp}`);
      console.log(`👤 Name: ${name}`);
      console.log('='.repeat(60) + '\n');
      throw new Error('Email service not configured. Please check EMAIL_USER and EMAIL_PASSWORD environment variables.');
    }

    const mailOptions = {
      from: `"ShareThought" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - ShareThought',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #7c3aed 0%, #667eea 100%);
              border-radius: 16px;
              padding: 40px;
              text-align: center;
            }
            .content {
              background: white;
              border-radius: 12px;
              padding: 30px;
              margin-top: 20px;
            }
            h1 {
              color: white;
              margin: 0 0 10px 0;
              font-size: 32px;
            }
            .tagline {
              color: rgba(255,255,255,0.9);
              font-size: 16px;
              margin: 0 0 20px 0;
            }
            .otp-box {
              background: linear-gradient(135deg, #7c3aed 0%, #667eea 100%);
              color: white;
              font-size: 36px;
              font-weight: bold;
              padding: 20px;
              border-radius: 12px;
              letter-spacing: 8px;
              margin: 20px 0;
              display: inline-block;
            }
            .message {
              color: #555;
              font-size: 16px;
              margin: 20px 0;
            }
            .warning {
              color: #e74c3c;
              font-size: 14px;
              margin-top: 20px;
              padding: 15px;
              background: #fee;
              border-radius: 8px;
            }
            .footer {
              color: rgba(255,255,255,0.8);
              font-size: 14px;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>ShareThought</h1>
            <p class="tagline">Connect. Share. Inspire.</p>
            
            <div class="content">
              <h2>Welcome, ${name}! 🎉</h2>
              <p class="message">
                Thank you for registering with ShareThought. 
                To complete your registration, please verify your email address using the OTP below:
              </p>
              
              <div class="otp-box">${otp}</div>
              
              <p class="message">
                This OTP is valid for <strong>10 minutes</strong>.
              </p>
              
              <div class="warning">
                ⚠️ <strong>Security Notice:</strong> Never share this OTP with anyone. 
                ShareThought will never ask for your OTP via phone or email.
              </div>
            </div>
            
            <p class="footer">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        </body>
        </html>
      `
    };

    console.log(`📧 Sending OTP email to: ${email}`);
    
    // Try sending email with retry mechanism
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`📧 Attempt ${attempt}/3 to send email...`);
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ OTP Email sent successfully!');
        console.log('📬 Message ID:', info.messageId);
        console.log('📨 Response:', info.response);
        return true;
      } catch (sendError) {
        lastError = sendError;
        console.error(`❌ Attempt ${attempt} failed:`, sendError.message);
        if (attempt < 3) {
          console.log(`⏳ Waiting 2 seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    // All retries failed, throw error
    throw lastError;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
      
      // Provide helpful error messages
      if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKET') {
        console.error('🔴 Connection timeout - Possible causes:');
        console.error('   1. Render blocks some SMTP ports');
        console.error('   2. Try using port 465 with secure: true');
        console.error('   3. EMAIL_PASSWORD should be App Password (16 chars)');
        console.error('   4. Try alternative: Use Resend, SendGrid, or Mailgun');
      } else if (error.code === 'EAUTH') {
        console.error('🔴 Authentication failed - Check:');
        console.error('   1. Enable 2-Step Verification in Gmail');
        console.error('   2. Generate App Password in Google Account');
        console.error('   3. Use App Password, not account password');
      } else if (error.code === 'ECONNREFUSED') {
        console.error('🔴 Connection refused - SMTP blocked on this server');
      }
    }
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    
    // Throw error so registration fails properly
    throw new Error(`Failed to send OTP email: ${error.message}. Please try again or contact support.`);
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    // If email is not configured, just log and return
    if (!transporter) {
      console.log(`⚠️ Email not configured. Skipping welcome email for ${email}`);
      return false;
    }

    const mailOptions = {
      from: `"ShareThought" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to ShareThought! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .container {
              background: linear-gradient(135deg, #7c3aed 0%, #667eea 100%);
              border-radius: 16px;
              padding: 40px;
              text-align: center;
            }
            .content {
              background: white;
              border-radius: 12px;
              padding: 30px;
              margin-top: 20px;
            }
            h1 {
              color: white;
              margin: 0 0 20px 0;
              font-size: 32px;
            }
            .welcome-text {
              font-size: 18px;
              color: #555;
              margin: 20px 0;
            }
            .features {
              text-align: left;
              margin: 20px 0;
            }
            .feature {
              margin: 15px 0;
              padding-left: 30px;
              position: relative;
            }
            .feature:before {
              content: "✓";
              position: absolute;
              left: 0;
              color: #7c3aed;
              font-weight: bold;
              font-size: 20px;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #7c3aed 0%, #667eea 100%);
              color: white;
              padding: 15px 40px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: bold;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to ShareThought! 🎉</h1>
            
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p class="welcome-text">
                Your email has been verified successfully! You're now part of the ShareThought community.
              </p>
              
              <div class="features">
                <div class="feature">Share your thoughts and ideas with the world</div>
                <div class="feature">Connect with like-minded people</div>
                <div class="feature">Engage in meaningful conversations</div>
                <div class="feature">Stay updated with real-time notifications</div>
              </div>
              
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" class="cta-button">
                Start Exploring
              </a>
              
              <p style="margin-top: 30px; color: #888; font-size: 14px;">
                Happy sharing! 🚀
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    console.log(`📧 Sending welcome email to: ${email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    return false;
  }
};
