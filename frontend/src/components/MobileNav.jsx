import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/MobileNav.css';

function MobileNav({ onCreatePost }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mobile-nav">
      <button 
        className={`mobile-nav-btn ${location.pathname === '/chat' ? 'active' : ''}`}
        onClick={() => navigate('/chat')}
        title="Messages"
      >
        <span className="nav-icon">💬</span>
        <span className="nav-label">Messages</span>
      </button>

      <button 
        className={`mobile-nav-btn ${location.pathname === '/dashboard' ? 'active' : ''}`}
        onClick={() => navigate('/dashboard')}
        title="Home"
      >
        <span className="nav-icon">🏠</span>
        <span className="nav-label">Home</span>
      </button>

      <button 
        className="mobile-nav-btn create-btn"
        onClick={onCreatePost}
        title="Create Post"
      >
        <span className="nav-icon plus-icon">+</span>
      </button>

      <button 
        className={`mobile-nav-btn ${location.pathname === '/profile' ? 'active' : ''}`}
        onClick={() => navigate('/profile')}
        title="Profile"
      >
        <span className="nav-icon">👤</span>
        <span className="nav-label">Profile</span>
      </button>

      <button 
        className="mobile-nav-btn"
        onClick={() => navigate('/dashboard')}
        title="More"
      >
        <span className="nav-icon">⋯</span>
        <span className="nav-label">More</span>
      </button>
    </nav>
  );
}

export default MobileNav;
