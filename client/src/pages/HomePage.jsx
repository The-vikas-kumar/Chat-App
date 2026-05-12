import React, { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'
import './HomePage.css'

const HomePage = () => {
  const {selectedUser} = useContext(ChatContext);

  return (
    <div className='home-page'>
      <div className={`home-page-container ${ selectedUser ? 'selected-user' : ''}`}>
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  )
}

export default HomePage