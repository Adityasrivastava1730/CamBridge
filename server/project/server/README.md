# CamBridge Server

## Setup

```bash
cd server
npm install
cp .env.example .env   # edit if needed
npm run dev
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://127.0.0.1:27017/cambridge |
| JWT_SECRET | JWT signing secret | (set in .env) |
| CLIENT_URL | Frontend URL for CORS | http://localhost:5173 |

## API Endpoints

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user (requires JWT)
- `POST /api/sessions/create` — Create a new camera session (returns 6-digit code)
- `GET /api/sessions/status/:code` — Check session status

## Socket.IO Events

- `create-room` / `join-room` — Room management
- `offer` / `answer` — WebRTC SDP exchange
- `ice-candidate` — ICE candidate exchange
- `toggle-mic` / `toggle-camera` / `toggle-torch` — Camera controls
- `user-joined` / `user-left` — Presence events
