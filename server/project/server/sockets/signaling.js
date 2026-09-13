import { Server } from 'socket.io';
import Session from '../models/Session.js';
import { verifyToken } from '../middleware/auth.js';

const activeRooms = new Map();

export function initSockets(server, corsOrigin) {
  const io = new Server(server, {
    cors: { origin: corsOrigin, methods: ['GET', 'POST'] },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      socket.userId = verifyToken(token).id;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (user: ${socket.userId})`);

    socket.on('create-room', async (code, callback) => {
      try {
        const session = await Session.findOne({ code });
        if (!session) return callback?.({ error: 'Session not found' });
        session.hostSocketId = socket.id;
        session.status = 'waiting';
        await session.save();
        socket.join(code);
        activeRooms.set(code, { host: socket.id, viewer: null });
        callback?.({ ok: true });
      } catch (err) {
        callback?.({ error: 'Server error' });
      }
    });

    socket.on('join-room', async (code, callback) => {
      try {
        const session = await Session.findOne({ code });
        if (!session) return callback?.({ error: 'Invalid session code' });
        if (session.status === 'paired') {
          return callback?.({ error: 'Session already paired' });
        }
        session.viewer = socket.userId;
        session.viewerSocketId = socket.id;
        session.status = 'paired';
        await session.save();
        socket.join(code);
        const room = activeRooms.get(code);
        if (room) room.viewer = socket.id;
        activeRooms.set(code, room || { host: null, viewer: socket.id });

        io.to(code).emit('user-joined', { viewerId: socket.id });
        callback?.({ ok: true });
      } catch (err) {
        callback?.({ error: 'Server error' });
      }
    });

    socket.on('offer', ({ code, sdp }) => {
      socket.to(code).emit('offer', { sdp, from: socket.id });
    });

    socket.on('answer', ({ code, sdp }) => {
      socket.to(code).emit('answer', { sdp, from: socket.id });
    });

    socket.on('ice-candidate', ({ code, candidate }) => {
      socket.to(code).emit('ice-candidate', { candidate, from: socket.id });
    });

    socket.on('toggle-mic', ({ code, enabled }) => {
      socket.to(code).emit('toggle-mic', { enabled });
    });

    socket.on('toggle-camera', ({ code, facingMode }) => {
      socket.to(code).emit('toggle-camera', { facingMode });
    });

    socket.on('toggle-torch', ({ code, enabled }) => {
      socket.to(code).emit('toggle-torch', { enabled });
    });

    socket.on('leave-room', async ({ code }) => {
      socket.leave(code);
      socket.to(code).emit('user-left', { socketId: socket.id });
      await Session.findOneAndUpdate(
        { code },
        { $set: { status: 'ended' } }
      ).catch(() => {});
      activeRooms.delete(code);
    });

    socket.on('disconnect', async () => {
      for (const [code, room] of activeRooms.entries()) {
        if (room.host === socket.id || room.viewer === socket.id) {
          socket.to(code).emit('user-left', { socketId: socket.id });
          activeRooms.delete(code);
          await Session.findOneAndUpdate({ code }, { $set: { status: 'ended' } }).catch(() => {});
        }
      }
    });
  });

  return io;
}
