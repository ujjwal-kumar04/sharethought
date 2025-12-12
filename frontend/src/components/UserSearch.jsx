import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthHeaders, useAuth } from '../context/AuthContext';
import '../styles/UserSearch.css';

const API_URL = 'https://sharethought-pyuh.onrender.com/api';

function UserSearch() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search) {
        searchUsers();
      } else {
        setUsers([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const searchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users?search=${search}`, {
        headers: getAuthHeaders()
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
    setSearch('');
    setUsers([]);
  };

  return (
    <div className="user-search">
      <h3>Search Users</h3>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name..."
        className="search-input"
      />
      
      {loading && <p className="loading-text">Searching...</p>}
      
      {users.length > 0 && (
        <div className="search-results">
          {users.map((user) => {
            const isFollowing = currentUser.following.some(f => f._id === user._id);
            return (
              <div
                key={user._id}
                className="user-item"
                onClick={() => handleUserClick(user._id)}
              >
                <div className="user-info">
                  <strong>@{user.username}</strong>
                  <span className="user-stats">
                    {user.followers.length} followers
                  </span>
                </div>
                {isFollowing && <span className="following-badge">Following</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserSearch;
