import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import CreatePost from '../components/CreatePost';
import MobileNav from '../components/MobileNav';
import PostCard from '../components/PostCard';
import UserSearch from '../components/UserSearch';
import { getAuthHeaders, useAuth } from '../context/AuthContext';
import socketService from '../services/socket';
import '../styles/Dashboard.css';

const API_URL = 'https://sharethought-pyuh.onrender.com/api';

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { user } = useAuth();

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`, {
        headers: getAuthHeaders()
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    
    // Connect socket
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
    }

    return () => {
      socketService.disconnect();
    };
  }, [fetchPosts]);

  const handlePostCreated = useCallback((newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }, []);

  const handlePostDeleted = useCallback((postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
  }, []);

  const handlePostUpdated = useCallback((updatedPost) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="user-info">
            <h3>Welcome</h3>
            <p className="username">@{user.username}</p>
          </div>
          <button 
            className="btn-create-post" 
            onClick={() => setShowCreatePost(!showCreatePost)}
          >
            ✏️ {showCreatePost ? 'Hide' : 'Create New Post'}
          </button>
          <UserSearch />
        </aside>

        <main className="main-content">
          {showCreatePost && <CreatePost onPostCreated={handlePostCreated} />}
          
          <div className="posts-section">
            <h2>All Posts</h2>
            {posts.length === 0 ? (
              <p className="no-posts">No posts found</p>
            ) : (
              posts.map(post => (
                <PostCard
                  key={post._id}
                  post={post}
                  onDelete={handlePostDeleted}
                  onUpdate={handlePostUpdated}
                />
              ))
            )}
          </div>
        </main>
      </div>
      <MobileNav onCreatePost={() => setShowCreatePost(!showCreatePost)} />
    </div>
  );
}

export default Dashboard;
