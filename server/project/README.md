# CamBridge — Smart Phone Security Camera System

Transform any spare smartphone into a live, remote security camera with real-time low-latency streaming via WebRTC.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide React, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Real-Time**: Socket.IO (signaling) + WebRTC (P2P media streaming)
- **Auth**: JWT + bcryptjs

## Project Structure

```
cambridge/
├── src/                    # Frontend (React + Vite)
│   ├── components/          # Navbar, Logo, ProtectedRoute, StatusBadge
│   ├── context/            # AuthContext
│   ├── hooks/              # useWebRTC
│   ├── pages/              # Landing, Login, Register, Dashboard, Camera, Viewer
│   ├── services/           # api, socket, auth, session
│   └── utils/
├── server/                 # Backend (Node + Express)
│   ├── config/             # db connection
│   ├── controllers/
│   ├── middleware/         # JWT auth
│   ├── models/             # User, Session
│   ├── routes/             # auth, session
│   ├── sockets/            # Socket.IO signaling
│   └── server.js           # Entry point
├── .env                    # Frontend env vars
└── server/.env             # Backend env vars
```

## Setup Instructions

### 1. Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 2. Frontend Setup

```bash
# In the project root
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`

### 3. Backend Setup

Open a **second terminal**:

```bash
cd server
npm install
cp .env .env   # edit MONGO_URI if using Atlas
npm run dev
```

Backend runs on `http://localhost:5000`

### 4. Using the App

1. Register an account
2. On your spare phone: Login → Dashboard → **Camera Node**
3. Note the 6-digit pairing code
4. On your viewer device: Login → Dashboard → **Viewer Node**
5. Enter the code to connect

## WebRTC Connection Lifecycle

1. **Camera Node** creates a session and gets a 6-digit code
2. **Viewer Node** enters the code and joins the Socket.IO room
3. Camera receives `user-joined` event → creates **SDP Offer** → sends via Socket.IO
4. Viewer receives offer → creates **SDP Answer** → sends back via Socket.IO
5. Both sides exchange **ICE Candidates** through Socket.IO
6. P2P connection established → media streams flow directly between devices
7. STUN servers (Google) help with NAT traversal
8. If network drops, the connection state changes and UI shows reconnection status

## Environment Variables

### Frontend (`.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |
| VITE_SOCKET_URL | Socket.IO server URL | http://localhost:5000 |

### Backend (`server/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://127.0.0.1:27017/cambridge |
| JWT_SECRET | JWT signing secret | (set in .env) |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

## Features

- User authentication (JWT + bcrypt)
- Device role selection (Camera / Viewer)
- 6-digit pairing code system
- WebRTC P2P video/audio streaming
- Camera controls: front/back switch, mic toggle, torch toggle
- Viewer controls: mute, snapshot capture, fullscreen
- Connection status indicators
- Auto-reconnection on network drop
- Responsive design (mobile + desktop)
