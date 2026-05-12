# Chat App

A full-stack real-time chat application built with **React**, **Node.js**, **Express**, and **MongoDB**. Features include user authentication, real-time messaging with Socket.IO, user profiles, and image uploads via Cloudinary.

## Features

- 🔐 **User Authentication** - Secure login/signup with JWT tokens
- 💬 **Real-time Messaging** - Instant message delivery using Socket.IO
- 👥 **User Profiles** - Create and manage user profiles
- 📸 **Image Uploads** - Upload and share images via Cloudinary integration
- 🎨 **Responsive UI** - Modern, responsive interface built with React
- 🔒 **Password Security** - Passwords hashed with bcryptjs

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Socket.IO Client** - Real-time communication
- **React Hot Toast** - Toast notifications
- **CSS** - Styling

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **MongoDB** - Database (with Mongoose ODM)
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage and management
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management

## Project Structure

```
chat-app/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── context/          # Context API (Auth, Chat)
│   │   ├── pages/            # Page components
│   │   ├── lib/              # Utility functions
│   │   ├── assets/           # Images and assets
│   │   └── App.jsx           # Main app component
│   ├── package.json
│   └── vite.config.js        # Vite configuration
│
└── server/                    # Express backend
    ├── controllers/          # Route handlers
    ├── models/              # MongoDB schemas
    ├── routes/              # API routes
    ├── middleware/          # Authentication middleware
    ├── lib/                 # Utilities (DB, Cloudinary)
    ├── server.js            # Server entry point
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary account (optional, for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-app
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

### Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/chat-app
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the Application

1. **Start the backend server**
   ```bash
   cd server
   npm run server    # With nodemon for development
   # OR
   npm start         # Standard Node.js
   ```
   The server will run on `http://localhost:5000`

2. **In a new terminal, start the frontend**
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173` (Vite default)

## Available Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server
- `npm run server` - Start server with nodemon (auto-reload on changes)
- `npm start` - Start server normally

## API Endpoints

### User Routes
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search users

### Message Routes
- `POST /api/messages` - Send a message
- `GET /api/messages/:conversationId` - Get conversation messages
- `DELETE /api/messages/:messageId` - Delete a message

## Socket.IO Events

### Client to Server
- `send_message` - Send a new message
- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `typing` - User is typing

### Server to Client
- `receive_message` - New message received
- `user_typing` - User typing notification
- `user_online` - User came online
- `user_offline` - User went offline

## Database Models

### User
- `username` - String (unique)
- `email` - String (unique)
- `password` - String (hashed)
- `profilePicture` - String (Cloudinary URL)
- `bio` - String
- `createdAt` - Date

### Message
- `sender` - ObjectId (reference to User)
- `receiver` - ObjectId (reference to User)
- `content` - String
- `image` - String (Cloudinary URL)
- `createdAt` - Date

## Features Implementation

### Authentication
- User registration with email validation
- Secure login with JWT tokens
- Token stored in localStorage
- Protected routes with middleware

### Real-time Chat
- Socket.IO connection management
- Real-time message delivery
- Typing indicators
- Online/offline status

### File Uploads
- Cloudinary integration for image uploads
- Profile picture management
- Image sharing in messages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support, email vikas02680@gmail.com or open an issue in the repository.

---

**Happy Chatting! 💬**
