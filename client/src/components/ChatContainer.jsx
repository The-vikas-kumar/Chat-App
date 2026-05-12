import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import './ChatContainer.css'

const ChatContainer = () => {

  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages, typingUsers } = useContext(ChatContext);
  const { authUser, onlineUsers, socket } = useContext(AuthContext);

  const scrollEnd = useRef()
  const chatMessagesRef = useRef(null)
  const autoScrollRef = useRef(true)
  const typingTimeoutRef = useRef(null)
  const [input, setInput] = useState('');
  const [isSendingImage, setIsSendingImage] = useState(false);

  const selectedUserTyping = selectedUser && typingUsers[selectedUser._id];

  const scrollToBottom = (behavior = "smooth") => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior, block: "end" });
    }
  }

  const handleScroll = () => {
    const container = chatMessagesRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    autoScrollRef.current = scrollHeight - scrollTop - clientHeight <= 100;
  }

  // handle sending a message
  const stopTyping = () => {
    if(selectedUser && socket?.connected){
      socket.emit("typing", { receiverId: selectedUser._id, isTyping: false });
    }
  }

  const handleSendMessage = async (e)=>{
    e.preventDefault();
    if(input.trim() === "") return null;
    autoScrollRef.current = true;
    await sendMessage({text: input.trim()});
    setInput("");
    clearTimeout(typingTimeoutRef.current);
    stopTyping();
  }

  // handle sending an image
  const handleSendImage = async (e)=>{
    const file = e.target.files[0];
    if(!file || !file.type.startsWith("image/")){
      toast.error("select an image file")
      return;
    }
    setIsSendingImage(true);
    const reader = new FileReader();

    reader.onload = async ()=>{
      autoScrollRef.current = true;
      await sendMessage({image: reader.result});
      e.target.value = "";
      setIsSendingImage(false);
      clearTimeout(typingTimeoutRef.current);
      stopTyping();
    }
    reader.readAsDataURL(file);
  }

  useEffect(()=>{
    if(selectedUser){
      autoScrollRef.current = true;
      getMessages(selectedUser._id);
    }
  },[selectedUser, getMessages])

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);
      stopTyping();
    }
  }, [selectedUser]);

  useLayoutEffect(() => {
    if (autoScrollRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  return selectedUser ? (
    <div className='chat-container'>

      {/* ------- header ------- */}
      <div className='chat-header'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="" className='chat-header-avatar' />
        <div className='chat-header-name'>
          <span>{selectedUser.fullName}</span>
          {selectedUserTyping ? (
            <span className='chat-header-status'>Typing...</span>
          ) : (
            onlineUsers.includes(selectedUser._id) && <span className='chat-header-online'></span>
          )}
        </div>
        <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="" className='chat-header-close' />
        <img src={assets.help_icon} alt="" className='chat-header-help' />
      </div>

      {/* ------- chat area ------- */}
      <div className='chat-messages' ref={chatMessagesRef} onScroll={handleScroll}>
        {messages.map((msg, index) => (
          <div key={msg._id || index} className={`chat-message ${msg.senderId !== authUser._id ? 'received' : ''}`}>
            {msg.image ? (
              <img src={msg.image} alt="" className='chat-message-image' />
            ) : (
              <p className={`chat-message-text ${msg.senderId === authUser._id ? 'sent' : 'received'}`}>{msg.text}</p>
            )}
            <div className='chat-message-info'>
              <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className='chat-message-avatar' />
              <p className='chat-message-time'>{formatMessageTime(msg.createdAt)}</p>
              {msg.senderId === authUser._id && (
                <span className={`chat-message-seen ${msg.seen ? 'seen' : 'delivered'}`}>
                  {msg.seen ? 'Seen' : 'Delivered'}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* ------- bottom area ------- */}
      <div className='chat-input-area'>
        <div className='chat-input-container'>
          <input onChange={(e)=> {
              setInput(e.target.value);
              if(selectedUser && socket?.connected){
                socket.emit("typing", { receiverId: selectedUser._id, isTyping: true });
                clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = setTimeout(()=>{
                  socket.emit("typing", { receiverId: selectedUser._id, isTyping: false });
                }, 1200);
              }
            }} value={input} onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder='Send a message' className='chat-input' />
          <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg' hidden />
          <label htmlFor="image" className='chat-gallery-icon-container'>
            {isSendingImage ? (
              <div className='chat-loader'>
                {/* Sending... */}
              </div>
            ) : (
              <img src={assets.gallery_icon} alt="" className='chat-gallery-icon' />
            )}
          </label>
        </div>
        <img onClick={handleSendMessage} src={assets.send_button} alt="" className='chat-send-button' />
      </div>

    </div>
  ) : (
    <div className='chat-placeholder'>
      <img src={assets.logo_icon} alt="" className='chat-placeholder-icon' />
      <p className='chat-placeholder-text'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer