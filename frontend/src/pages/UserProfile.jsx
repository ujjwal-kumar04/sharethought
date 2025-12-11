import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { getAuthHeaders, useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const API_URL = 'http://localhost:5000/api';

function UserProfile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: getAuthHeaders()
      });
      setUser(response.data);
      setIsFollowing(response.data.followers.some(f => f._id === currentUser._id));
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/user/${userId}`, {
        headers: getAuthHeaders()
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.post(`${API_URL}/users/${userId}/unfollow`, {}, {
          headers: getAuthHeaders()
        });
      } else {
        await axios.post(`${API_URL}/users/${userId}/follow`, {}, {
          headers: getAuthHeaders()
        });
      }
      setIsFollowing(!isFollowing);
      fetchUserData();
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

  const handleMessage = () => {
    const isMutualFollower = user.followers.some(f => f._id === currentUser._id) &&
                            user.following.some(f => f._id === currentUser._id);
    
    if (isMutualFollower) {
      navigate(`/chat/${userId}`);
    } else {
      alert('Only mutual followers can message');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <h1>{user.name}</h1>
          <h3 className="username-label">@{user.username}</h3>
          <p className="bio">{user.bio || 'No bio'}</p>
          
          <div className="profile-stats">
            <div className="stat">
              <strong>{posts.length}</strong>
              <span>Posts</span>
            </div>
            <div className="stat">
              <strong>{user.followers.length}</strong>
              <span>Followers</span>
            </div>
            <div className="stat">
              <strong>{user.following.length}</strong>
              <span>Following</span>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              onClick={handleFollow}
              className={isFollowing ? 'btn-secondary' : 'btn-primary'}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            <button onClick={handleMessage} className="btn-secondary">
              Message
            </button>
          </div>
        </div>
      </div>

      <div className="profile-posts">
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <p className="no-posts">No posts</p>
        ) : (
          posts.map(post => (
            <PostCard key={post._id} post={post} onUpdate={fetchUserPosts} />
          ))
        )}
      </div>
    </div>
  );
}

export default UserProfile;
