import axios from 'axios';
import { useState } from 'react';
import { getAuthHeaders } from '../context/AuthContext';
import '../styles/Post.css';

const API_URL = 'http://localhost:5000/api';

function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/posts`,
        { title, content },
        { headers: getAuthHeaders() }
      );
      
      setTitle('');
      setContent('');
      if (onPostCreated) onPostCreated(response.data.post);
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
            maxLength={200}
          />
        </div>
        
        <div className="form-group">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your story..."
            required
            rows={6}
            maxLength={5000}
          />
        </div>
        
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
