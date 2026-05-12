import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import './Sidebar.css'

const Sidebar = () => {

    const {getUsers, users, selectedUser, setSelectedUser, unseenMessages, setUnseenMessages, typingUsers} = useContext(ChatContext);

    const {logout, onlineUsers} = useContext(AuthContext);

    const [input, setInput] = useState(false);

    const navigate = useNavigate();

    const filteredUser = input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())) : users;

    useEffect(()=>{
        getUsers();
    },[onlineUsers, getUsers])

  return (
    <div className={`sidebar ${selectedUser ? "selected-user" : ""}`}>
        <div className='sidebar-header'>
            <div className='sidebar-logo-section'>
                <img src={assets.logo} alt="logo" className='sidebar-logo' />
                <div className='sidebar-menu'>
                    <img src={assets.menu_icon} alt="Menu" className='sidebar-menu-icon' />
                    <div className='sidebar-dropdown'>
                        <p onClick={() => navigate('/profile')} className='sidebar-dropdown-item'>Edit Profile</p>
                        <hr />
                        <p onClick={()=>logout()} className='sidebar-dropdown-item'>Logout</p>
                    </div>
                </div>
            </div>

            <div className='sidebar-search'>
                <img src={assets.search_icon} alt="Search" className='sidebar-search-icon'/>
                <input onChange={(e)=>setInput(e.target.value)} type="text" className='sidebar-search-input' placeholder='Search User...' />
            </div>

        </div>

        <div className='sidebar-users'>
            {filteredUser.map((user, index) =>(
                <div onClick={()=> {setSelectedUser(user); setUnseenMessages(prev=>({...prev, [user._id]:0}))}} key={index} className={`sidebar-user ${selectedUser?._id === user._id ? 'selected' : ''}`}>
                    <img src={user?.profilePic || assets.avatar_icon} alt="" className='sidebar-user-avatar' />
                    <div className='sidebar-user-info'>
                        <p>{user.fullName}</p>
                        {typingUsers[user._id] ? (
                            <span className='sidebar-user-status typing'>Typing...</span>
                        ) : (
                            <span className={`sidebar-user-status ${onlineUsers.includes(user._id) ? 'online' : 'offline'}`}>
                                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                            </span>
                        )}
                    </div>
                    {unseenMessages[user._id] > 0 && <p className='sidebar-unseen-count'>{unseenMessages[user._id]}</p> }
                </div>
            ) )}
        </div>

    </div>
  )
}

export default Sidebar