import express from 'express';
import cors from 'cors';
import http from 'node:http';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { initSockets } from './sockets/signaling.js';
import authRoutes from './routes/auth.js';
import sessionRoutes from './routes/session.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

initSockets(server, CLIENT_URL);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`CamBridge server running on port ${PORT}`);
  });
});
