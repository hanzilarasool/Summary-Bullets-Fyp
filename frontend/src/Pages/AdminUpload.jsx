import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Paperclip, Send, Copy, Trash2,SquarePen, Menu  } from "lucide-react";
import "../styles/AdminUpload.css";
import config from "../config";
import { useSelector } from "react-redux";


const AdminUpload = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isFetchingChats, setIsFetchingChats] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [newChatTitle, setNewChatTitle] = useState(""); // Title input
  const [titleError, setTitleError] = useState(""); // Title validation
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo"); // New state for model
  const [temperature, setTemperature] = useState(0.5);  // New state for temperature
  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);
  const chatBodyRef = useRef(null);
  const titleInputRef = useRef(null);

  // Debug currentUser
  useEffect(() => {
    console.log("Current User:", currentUser);
  }, [currentUser]);

  // Focus title input when modal opens
  useEffect(() => {
    if (isModalOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isModalOpen]);

  // Fetch chat history on mount
  useEffect(() => {
    if (currentUser?.user?._id) {
      setIsFetchingChats(true);
      fetchChats();
    }
  }, [currentUser]);

  // Load currentChatId from localStorage on mount
  useEffect(() => {
    const savedChatId = localStorage.getItem("currentChatId");
    if (savedChatId) {
      setCurrentChatId(savedChatId);
    }
  }, []);

  // Save currentChatId to localStorage when it changes
  useEffect(() => {
    if (currentChatId) {
      localStorage.setItem("currentChatId", currentChatId);
    }
  }, [currentChatId]);

  // Fetch chats when currentUser is available
  useEffect(() => {
    if (currentUser?.user?._id) {
      setIsFetchingChats(true);
      fetchChats();
    } else {
      setChats([]);
      setCurrentChatId(null);
      localStorage.removeItem("currentChatId");
    }
  }, [currentUser]);
  // Fetch messages for the current chat
  useEffect(() => {
    if (currentChatId) {
      fetchChatMessages(currentChatId);
    } else {
      setMessages([]);
    }
  }, [currentChatId]);

  // Scroll to bottom of chat body
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

const fetchChats = async () => {
    try {
      const { data } = await axios.get(`${config.API_URL}/api/summary/chats/${currentUser.user._id}`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }, // Include token if required
      });
      setChats(data);
      if (!currentChatId && data.length > 0) {
        setCurrentChatId(data[0]._id);
      }
    } catch (err) {
      setError("Failed to fetch chat history.");
      console.error("Fetch chats error:", err.response?.data || err.message);
    } finally {
      setIsFetchingChats(false);
    }
  };
  // handle model change
const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };
// handle temperature change
  const handleTemperatureChange = (e) => {
  setTemperature(parseFloat(e.target.value));
};
  const fetchChatMessages = async (chatId) => {
    try {
      setError(""); // Clear previous errors
      const { data } = await axios.get(`${config.API_URL}/api/summary/chats/${chatId}/messages`);
      setMessages(
        data.flatMap((msg) => [
          { type: "input", content: msg.originalText, id: msg._id },
          { type: "summary", content: msg.summary, id: `${msg._id}-summary` },
        ])
      );
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load chat messages.");
      console.error("Fetch chat messages error:", err.response?.data || err.message);
    }
  };

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleTextInput = (e) => {
    setTextInput(e.target.value);
    setError("");
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    alert("Copied to clipboard!");
  };

  
  const handleUpload = async () => {
    if (!file && !textInput) {
      setError("Please select a file or enter text to summarize.");
      return;
    }
    if (!currentChatId) {
      await handleNewChat();
    }

    setLoading(true);
    setError("");
    try {
      let text = textInput;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await axios.post(`${config.API_URL}/api/summary/upload`, formData);
        text = data.text;
      }

      setMessages((prev) => [...prev, { type: "input", content: text, id: Date.now() }]);

      const summaryRes = await axios.post(`${config.API_URL}/api/summary/generate-summary`, {
        text,
        chatId: currentChatId,
        userId: currentUser.user._id,
        model: selectedModel, // Include selected model
        temperature, // Include temperature
      });

      setMessages((prev) => [
        ...prev,
        { type: "summary", content: summaryRes.data.summary, id: Date.now() + 1 },
      ]);
      setTextInput("");
      setFile(null);
      fileInputRef.current.value = "";
      textInputRef.current.focus();
      fetchChats();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate summary.");
      console.error("Upload error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !loading && (file || textInput)) {
      e.preventDefault();
      handleUpload();
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setNewChatTitle("");
    setTitleError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewChatTitle("");
    setTitleError("");
  };

  const handleNewChat = async () => {
    if (!newChatTitle.trim()) {
      setTitleError("Title is required.");
      return;
    }
    if (newChatTitle.length < 4 || newChatTitle.length > 40) {
      setTitleError("Title must be 4-40 characters.");
      return;
    }

    try {
      const { data } = await axios.post(`${config.API_URL}/api/summary/chats`, {
        userId: currentUser.user._id,
        title: newChatTitle.trim(),
      });
      setCurrentChatId(data.chatId);
      setMessages([]);
      setChats((prev) => [{ _id: data.chatId, title: data.title, createdAt: new Date() }, ...prev]);
      closeModal();
    } catch (err) {
      setTitleError(err.response?.data?.error || "Failed to create new chat.");
      console.error("New chat error:", err.response?.data || err.message);
    }
  };

  const handleModalKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNewChat();
    }
  };

  const handleDeleteChat = async () => {
    if (!currentChatId) return;
    try {
      await axios.delete(`${config.API_URL}/api/summary/chats/${currentChatId}`);
      setMessages([]);
      setCurrentChatId(null);
      setChats((prev) => prev.filter((chat) => chat._id !== currentChatId));
      if (chats.length > 1) {
        setCurrentChatId(chats[0]._id);
      }
    } catch (err) {
      setError("Failed to delete chat.");
      console.error("Delete chat error:", err.response?.data || err.message);
    }
  };
  const toggleSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("active");
  };

  return (
    <div className="app-container">
      <div className="sidebar">
          <div className="sidebar-menu-icon" onClick={toggleSidebar}> <Menu size={20} className="menu-icon" /> </div>
      <div className="new-chat-button" onClick={openModal}  disabled={!currentUser?.user?._id}>
  <button >
          New Chat
          
        </button>
        <SquarePen size={20} />
      </div>
        <div className="chat-list">
          {isFetchingChats ? (
            <div className="loader">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="no-chats">No chats available. Start a new chat!</div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                className={`chat-item ${currentChatId === chat._id ? "active" : ""}`}
                onClick={() => setCurrentChatId(chat._id)}
              >
                <span>{chat.title}</span>
                <span className="chat-date">{new Date(chat.createdAt).toLocaleDateString()}</span>
              </div>
            ))
          )}
        </div>
      </div>
       <div className="sidebar-menu-icon" onClick={toggleSidebar}> <Menu size={20} className="menu-icon" /> </div>
      <div className="chat-container">
        
<div className="chat-header">
          <h2 className="chat-title">Book Summarizer</h2>
          <select
            value={selectedModel}
            onChange={handleModelChange}
            className="model-select"
            disabled={loading || !currentUser?.user?._id}
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
          </select>
          <div className="temperature-control">
      <label>Temperature: {temperature}</label>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={temperature}
        onChange={handleTemperatureChange}
        disabled={loading || !currentUser?.user?._id}
      />
    </div>
          {currentChatId && (
            <button
              onClick={handleDeleteChat}
              className="delete-chat-button"
              aria-label="Delete current chat"
              title="Delete chat"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
        <div className="chat-body" ref={chatBodyRef}>
          {!currentUser?.user?._id ? (
            <div className="message error">Please log in to use the summarizer.</div>
          ) : (
            <>
            
              
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.type === "input" ? "sent" : "received"}`}>
                  <div className="message-content">
                    {msg.type === "summary" && <h3>Summary</h3>}
                    <pre>{msg.content}</pre>
                    {msg.type === "summary" && (
                      <button
                        onClick={() => handleCopy(msg.content)}
                        className="copy-button"
                        aria-label="Copy message to clipboard"
                        title="Copy message"
                      >
                        <Copy size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message loading">
                  <div className="loader">Generating...</div>
                </div>
              )}
            </>
          )}
        </div>
{file && (
                <div className="file-preview">
                  Selected file: {file.name}
                  <button
                    onClick={() => {
                      setFile(null);
                      fileInputRef.current.value = "";
                    }}
                    className="clear-file"
                    aria-label="Clear selected file"
                  >
                    Clear
                  </button>
                </div>
              )}
              {error && (
                <div className="message error">
                  <div className="message-content">{error}</div>
                </div>
              )}
        <div className="chat-input-container">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="file-input-hidden"
            accept=".doc,.docx"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="attach-button" aria-label="Attach file">
            <Paperclip size={20} />
          </label>
          <textarea
            ref={textInputRef}
            value={textInput}
            onChange={handleTextInput}
            onKeyPress={handleKeyPress}
            placeholder="Paste book text or type a prompt..."
            className="text-input"
            rows="1"
            disabled={loading || !currentUser?.user?._id}
          />
          <button
            onClick={handleUpload}
            className="send-button"
            disabled={loading || (!file && !textInput) || !currentUser?.user?._id}
            aria-label="Generate summary"
          >
            {loading ? "..." : <Send size={20} />}
          </button>
        </div>
      </div>

      {/* Modal for new chat title */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 className="modal-title">New Chat</h3>
            <input
              ref={titleInputRef}
              type="text"
              value={newChatTitle}
              onChange={(e) => {
                setNewChatTitle(e.target.value);
                setTitleError("");
              }}
              onKeyPress={handleModalKeyPress}
              placeholder="Enter chat title (4-40 characters)"
              className="modal-input"
              maxLength={40}
            />
            {titleError && <p className="modal-error">{titleError}</p>}
            <div className="modal-buttons">
              <button onClick={closeModal} className="modal-cancel-button">
                Cancel
              </button>
              <button onClick={handleNewChat} className="modal-create-button">
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpload;