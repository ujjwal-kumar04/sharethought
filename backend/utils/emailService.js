import { createTransport } from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  // For development, you can use Gmail or any SMTP service
  // For production, use services like SendGrid, AWS SES, etc.
  
  const transporter = createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    debug: true, // Enable debug output
    logger: true // Log to console
  });

  // Verify transporter configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.error('❌ Email transporter verification failed:', error);
    } else {
      console.log('✅ Email server is ready to send messages');
    }
  });

  return transporter;
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter();

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
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP Email sent successfully!');
    console.log('📬 Message ID:', info.messageId);
    console.log('📨 Response:', info.response);
    return true;
  } catch (error) {
    console.error('❌ Error sending OTP email:', error.message);
    if (error.code) {
      console.error('Error Code:', error.code);
    }
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    return false;
  }
};

// Send welcome email after verification
export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

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
