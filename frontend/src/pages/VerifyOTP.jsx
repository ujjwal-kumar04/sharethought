import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const API_URL = 'https://sharethought-pyuh.onrender.com/api';

function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const userId = location.state?.userId;
  const email = location.state?.email;

  useEffect(() => {
    if (!userId || !email) {
      navigate('/register');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userId, email, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        userId,
        otp
      });

      setSuccess(response.data.message);
      localStorage.setItem('token', response.data.token);
      
      // Set user in context
      setUser(response.data.user);

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
      if (err.response?.data?.attemptsLeft !== undefined) {
        setError(`${err.response.data.error} (${err.response.data.attemptsLeft} attempts left)`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setResending(true);

    try {
      const response = await axios.post(`${API_URL}/auth/resend-otp`, { userId });
      setSuccess(response.data.message);
      setTimeLeft(600); // Reset timer
      setOtp(''); // Clear OTP input
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>ShareThought</h1>
        <h2>Verify OTP</h2>
        
        <p className="verify-info">
          We've sent a 6-digit verification code to
          <br />
          <strong>{email}</strong>
        </p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength={6}
              placeholder="000000"
              className="otp-input"
              autoFocus
            />
          </div>

          <div className="otp-timer">
            {timeLeft > 0 ? (
              <span>Time remaining: {formatTime(timeLeft)}</span>
            ) : (
              <span className="expired">OTP expired</span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || otp.length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="resend-section">
          <p>Didn't receive the code?</p>
          <button 
            onClick={handleResendOTP}
            className="btn-link"
            disabled={resending}
          >
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
