import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({children})=>{

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
    const [typingUsers, setTypingUsers] = useState({});

    const {socket, axios, authUser} = useContext(AuthContext);

    // function to get all users for sidebar
    const getUsers = useCallback(async ()=>{
        try {
            const {data} = await axios.get("api/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [axios])

    // function to get messages for selected user
    const getMessages = useCallback(async (userId)=>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [axios]);

    // function to send message to selected user
    const sendMessage = useCallback(async (messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages, data.newMessage])
            }
            else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [axios, selectedUser]);

    useEffect(() => {
        if(!socket) return;

        const handleNewMessage = (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=> [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        }

        const handleTyping = ({ senderId, isTyping }) => {
            setTypingUsers((prevTypingUsers) => ({
                ...prevTypingUsers,
                [senderId]: isTyping
            }));
        }

        const handleMessagesSeen = ({ messageIds }) => {
            setMessages((prevMessages) => prevMessages.map((message) => (
                messageIds.includes(message._id) ? { ...message, seen: true } : message
            )));
        }

        socket.on("newMessage", handleNewMessage);
        socket.on("typing", handleTyping);
        socket.on("messagesSeen", handleMessagesSeen);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("typing", handleTyping);
            socket.off("messagesSeen", handleMessagesSeen);
        };
    },[socket, selectedUser, axios])

    const value = {
        messages, users, selectedUser, getUsers, getMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages, typingUsers
    }

    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}