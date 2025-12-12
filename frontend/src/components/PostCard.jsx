import axios from 'axios';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthHeaders, useAuth } from '../context/AuthContext';
import '../styles/Post.css';

const API_URL = 'https://sharethought-pyuh.onrender.com/api';

function PostCard({ post, onDelete, onUpdate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [localPost, setLocalPost] = useState(post);
  const [loading, setLoading] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    user.following?.some(f => f._id === localPost.author._id) || false
  );
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState({});

  const isLiked = useMemo(() => localPost.likes.includes(user._id), [localPost.likes, user._id]);
  const isOwner = useMemo(() => localPost.author._id === user._id, [localPost.author._id, user._id]);
  
  const { contentLines, shouldTruncate, displayContent } = useMemo(() => {
    const lines = localPost.content.split('\n');
    return {
      contentLines: lines,
      shouldTruncate: lines.length > 3,
      displayContent: showFullContent ? localPost.content : lines.slice(0, 3).join('\n')
    };
  }, [localPost.content, showFullContent]);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${localPost._id}/like`,
        {},
        { headers: getAuthHeaders() }
      );
      
      const updatedPost = {
        ...localPost,
        likes: isLiked 
          ? localPost.likes.filter(id => id !== user._id)
          : [...localPost.likes, user._id]
      };
      setLocalPost(updatedPost);
      if (onUpdate) onUpdate(updatedPost);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/posts/${localPost._id}/comment`,
        { text: comment },
        { headers: getAuthHeaders() }
      );
      setLocalPost(response.data.post);
      setComment('');
      if (onUpdate) onUpdate(response.data.post);
    } catch (error) {
      console.error('Error commenting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/posts/${localPost._id}`, {
        headers: getAuthHeaders()
      });
      if (onDelete) onDelete(localPost._id);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.post(`${API_URL}/users/${localPost.author._id}/unfollow`, {}, {
          headers: getAuthHeaders()
        });
      } else {
        await axios.post(`${API_URL}/users/${localPost.author._id}/follow`, {}, {
          headers: getAuthHeaders()
        });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

  const handleUsernameClick = () => {
    if (!isOwner) {
      navigate(`/user/${localPost.author._id}`);
    } else {
      navigate('/profile');
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const response = await axios.post(
        `${API_URL}/posts/${localPost._id}/comment/${commentId}/like`,
        {},
        { headers: getAuthHeaders() }
      );
      setLocalPost(response.data.post);
      if (onUpdate) onUpdate(response.data.post);
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;

    try {
      const response = await axios.post(
        `${API_URL}/posts/${localPost._id}/comment/${commentId}/reply`,
        { text: replyText },
        { headers: getAuthHeaders() }
      );
      setLocalPost(response.data.post);
      setReplyText('');
      setReplyingTo(null);
      setShowReplies({ ...showReplies, [commentId]: true });
      if (onUpdate) onUpdate(response.data.post);
    } catch (error) {
      console.error('Error replying:', error);
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies({ ...showReplies, [commentId]: !showReplies[commentId] });
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <h4 onClick={handleUsernameClick} className="username-link">
            @{localPost.author.username}
          </h4>
          <span className="post-date">
            {new Date(localPost.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
       
        
        <div className="post-header-actions">
          {!isOwner && (
            <button 
              onClick={handleFollow} 
              className={`btn-follow ${isFollowing ? 'following' : ''}`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          {isOwner && (
            <button onClick={handleDelete} className="btn-delete" title="Delete">
              🗑️
            </button>
          )}
           </div>
        </div>
      </div>

      <div className="post-content">
        <h3 className="post-title">{localPost.title}</h3>
        <p className="post-text">{displayContent}</p>
        {shouldTruncate && !showFullContent && (
          <button 
            onClick={() => setShowFullContent(true)} 
            className="btn-load-more"
          >
            Load more...
          </button>
        )}
        {showFullContent && shouldTruncate && (
          <button 
            onClick={() => setShowFullContent(false)} 
            className="btn-load-more"
          >
            Show less
          </button>
        )}
      </div>

      <div className="post-actions">
        <button onClick={handleLike} className={`btn-like ${isLiked ? 'liked' : ''}`}>
          {isLiked ? '❤️' : '🤍'} {localPost.likes.length}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="btn-comment">
          💬 {localPost.comments.length} Comments
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleComment} className="comment-form">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !comment.trim()}>
              Send
            </button>
          </form>

          <div className="comments-list">
            {localPost.comments.map((c) => (
              <div key={c._id} className="comment">
                <div className="comment-header">
                  <strong className="comment-username">@{c.user.username}</strong>
                  <span className="comment-time">
                    {new Date(c.createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <p className="comment-text">{c.text}</p>
                <div className="comment-actions">
                  <button 
                    className={`comment-action-btn ${c.likes?.includes(user._id) ? 'liked' : ''}`}
                    onClick={() => handleCommentLike(c._id)}
                  >
                    {c.likes?.includes(user._id) ? '❤️' : '🤍'} {c.likes?.length || 0}
                  </button>
                  <button 
                    className="comment-action-btn"
                    onClick={() => setReplyingTo(replyingTo === c._id ? null : c._id)}
                  >
                    Reply
                  </button>
                  {c.replies?.length > 1 && (
                    <button 
                      className="comment-action-btn"
                      onClick={() => toggleReplies(c._id)}
                    >
                      {showReplies[c._id] ? 'Hide replies' : `Show more replies (${c.replies.length - 1})`}
                    </button>
                  )}
                </div>

                {replyingTo === c._id && (
                  <div className="reply-form">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                    />
                    <button onClick={() => handleReply(c._id)}>Send</button>
                    <button onClick={() => setReplyingTo(null)}>Cancel</button>
                  </div>
                )}

                {c.replies?.length > 0 && (
                  <div className="replies-list">
                    <div className="reply">
                      <div className="reply-header">
                        <strong className="reply-username">@{c.replies[0].user.username}</strong>
                        <span className="reply-time">
                          {new Date(c.replies[0].createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="reply-text">{c.replies[0].text}</p>
                    </div>
                    
                    {showReplies[c._id] && c.replies.slice(1).map((reply) => (
                      <div key={reply._id} className="reply">
                        <div className="reply-header">
                          <strong className="reply-username">@{reply.user.username}</strong>
                          <span className="reply-time">
                            {new Date(reply.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="reply-text">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PostCard;
