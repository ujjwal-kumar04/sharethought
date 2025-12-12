import axios from 'axios';
import { useEffect, useState } from 'react';
import MobileNav from '../components/MobileNav';
import { getAuthHeaders, useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const API_URL = 'https://sharethought-pyuh.onrender.com/api';

function Profile() {
  const { user, setUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [bio, setBio] = useState(user?.bio || '');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts/user/${user._id}`, {
        headers: getAuthHeaders()
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleUpdateBio = async () => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, 
        { bio },
        { headers: getAuthHeaders() }
      );
      setUser(response.data.user);
      setEditing(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-info">
          <h1>{user.name}</h1>
          <h3 className="username-label">@{user.username}</h3>
          
          {editing ? (
            <div className="bio-edit">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell about yourself..."
                maxLength={200}
              />
              <div className="bio-actions">
                <button onClick={handleUpdateBio} className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditing(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="bio-display">
              <p className="bio">{user.bio || 'No bio'}</p>
              <button onClick={() => setEditing(true)} className="btn-secondary">
                Edit Bio
              </button>
            </div>
          )}
          
          <div className="profile-stats">
            <div className="stat">
              <strong>{posts.length}</strong>
              <span>Posts</span>
            </div>
            <div className="stat">
              <strong>{user.followers?.length || 0}</strong>
              <span>Followers</span>
            </div>
            <div className="stat">
              <strong>{user.following?.length || 0}</strong>
              <span>Following</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-posts">
        <h2>My Posts</h2>
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet</p>
        ) : (
          posts.map(post => (
            <div key={post._id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <div className="post-meta">
                <span>❤️ {post.likes.length} Likes</span>
                <span>💬 {post.comments.length} Comments</span>
                <span>{new Date(post.createdAt).toLocaleDateString('hi-IN')}</span>
              </div>
            </div>
          ))
        )}
      </div>
      <MobileNav onCreatePost={() => {}} />
    </div>
  );
}

export default Profile;
