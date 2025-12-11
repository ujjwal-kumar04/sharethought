import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MobileNav from '../components/MobileNav';
import { getAuthHeaders, useAuth } from '../context/AuthContext';
import socketService from '../services/socket';
import '../styles/Chat.css';

const API_URL = 'http://localhost:5000/api';

function Chat() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    // Connect socket if not already connected
    const token = localStorage.getItem('token');
    if (token) {
      socketService.connect(token);
    }

    fetchConversations();
    
    // Setup socket listeners
    socketService.onReceiveMessage(handleReceiveMessage);
    socketService.onMessageSent(handleMessageSent);
    socketService.onUserTyping(handleUserTyping);
    socketService.onError((error) => {
      alert(error.message || 'Error sending message');
    });

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    if (userId) {
      selectUserById(userId);
    }
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages/conversations`, {
        headers: getAuthHeaders()
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectUserById = async (userId) => {
    try {
      const userResponse = await axios.get(`${API_URL}/users/${userId}`, {
        headers: getAuthHeaders()
      });
      setSelectedUser(userResponse.data);
      fetchMessages(userId);
    } catch (error) {
      console.error('Error selecting user:', error);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await axios.get(`${API_URL}/messages/${otherUserId}`, {
        headers: getAuthHeaders()
      });
      setMessages(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        alert('Only mutual followers can message');
        navigate('/dashboard');
      }
      console.error('Error fetching messages:', error);
    }
  };

  const handleReceiveMessage = (message) => {
    if (message.sender._id === selectedUser?._id) {
      setMessages(prev => [...prev, message]);
    }
    fetchConversations();
  };

  const handleMessageSent = (message) => {
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    fetchConversations();
  };

  const handleUserTyping = ({ userId, isTyping }) => {
    if (userId === selectedUser?._id) {
      setTyping(isTyping);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) {
      console.log('Cannot send: message empty or no user selected');
      return;
    }

    console.log('Sending message:', newMessage, 'to:', selectedUser._id);
    socketService.sendMessage(selectedUser._id, newMessage.trim());
    // Note: message will be cleared by handleMessageSent callback
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (selectedUser) {
      socketService.sendTyping(selectedUser._id, true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socketService.sendTyping(selectedUser._id, false);
      }, 1000);
    }
  };

  const selectConversation = (conversation) => {
    setSelectedUser(conversation.user);
    fetchMessages(conversation.user._id);
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
    setSelectedUser(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className={`chat-container ${showChat ? 'show-chat' : ''}`}>
      <div className="conversations-list">
        <h2>Messages</h2>
        {conversations.length === 0 ? (
          <p className="no-conversations">No conversations</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.user._id}
              className={`conversation-item ${selectedUser?._id === conv.user._id ? 'active' : ''}`}
              onClick={() => selectConversation(conv)}
            >
              <h4>@{conv.user.username}</h4>
              <p className="last-message">{conv.lastMessage}</p>
            </div>
          ))
        )}
      </div>

      <div className="chat-area">
        {selectedUser ? (
          <>
            <div className="chat-header">
              <button className="back-button" onClick={handleBackToList}>
                ← Back
              </button>
              <h3>@{selectedUser.username}</h3>
            </div>

            <div className="messages-container">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`message ${msg.sender._id === currentUser._id ? 'sent' : 'received'}`}
                >
                  <p>{msg.message}</p>
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString('hi-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
              {typing && (
                <div className="typing-indicator">
                  <span>Typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="message-input-form">
              <input
                type="text"
                value={newMessage}
                onChange={handleTyping}
                placeholder="Type a message..."
              />
              <button type="submit" className="btn-primary">
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-chat-selected">
            <p>No chat selected</p>
          </div>
        )}
      </div>
      <MobileNav onCreatePost={() => {}} />
    </div>
  );
}

export default Chat;
