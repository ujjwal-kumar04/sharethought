import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/Navbar.css';
import NotificationBell from './NotificationBell';

function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <h1>ShareThought</h1>
        </Link>

        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/chat">Messages</Link>
        </div>

        <div className="navbar-actions">
          <NotificationBell />
          <button onClick={toggleTheme} className="theme-toggle" title="Change theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <span className="user-badge">@{user?.username}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
