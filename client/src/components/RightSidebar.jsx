import React, { useContext } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';
import './RightSidebar.css'

const RightSidebar = () => {

  const {selectedUser, messages} = useContext(ChatContext);
  const {logout, onlineUsers} = useContext(AuthContext);
  const msgImages = messages.filter(msg => msg.image);

  return selectedUser && (
    <div className={`right-sidebar ${selectedUser ? "selected-user" : ""}`}>
      <div className='right-sidebar-profile'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='right-sidebar-avatar' />
        <h1 className='right-sidebar-name'>
          {onlineUsers.includes(selectedUser._id) && <p className='right-sidebar-online'></p>}
          {selectedUser.fullName}
        </h1>
        <p className='right-sidebar-bio'>{selectedUser.bio}</p>
      </div>
      <hr className='right-sidebar-hr' />

      <div className='right-sidebar-media'>
        <p>Media</p>
        <div className='right-sidebar-media-grid'>
          {msgImages.map((msg, index) => (
            <div key={index} onClick={() => window.open(msg.image)} className='right-sidebar-media-item'>
              <img src={msg.image} alt="" />
            </div>
          ))}
        </div>
      </div>

      <button onClick={()=> logout()} className='right-sidebar-logout'>
        Logout
      </button>
    </div>
  )
}

export default RightSidebar