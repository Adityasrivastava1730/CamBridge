const express = require("express");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");
const Camera = require("./models/Camera");
const authRoutes = require("./routes/authRoutes");
const cameraRoutes = require("./routes/cameraRoutes");

const app = express();
const allowedOrigin = process.env.CLIENT_URL || true;
app.use(cors({ origin:allowedOrigin, credentials:true }));
app.use(express.json({ limit:"1mb" }));
connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/cameras", cameraRoutes);
app.get("/", (req, res) => res.send("CamBridge Server Running"));
app.get("/health", (req, res) => res.json({ status:"ok" }));

const server = http.createServer(app);
const io = new Server(server, { cors:{ origin:allowedOrigin, credentials:true } });

io.use((socket, next) => {
    try {
        const identity = jwt.verify(socket.handshake.auth?.token, process.env.JWT_SECRET);
        if (!identity.role && identity.id) {
            identity.role = "viewer";
            identity.userId = identity.id;
        }
        if (!["viewer", "camera"].includes(identity.role)) throw new Error("Invalid role");
        socket.identity = identity;
        next();
    } catch (error) {
        next(new Error("Unauthorized socket"));
    }
});

io.on("connection", (socket) => {
    socket.on("join-room", async ({ room, type }) => {
        try {
            if (!room || socket.identity.role !== type) return socket.emit("signaling-error", "Invalid room role");
            const camera = await Camera.findById(room);
            if (!camera) return socket.emit("signaling-error", "Camera not found");

            const ownerId = socket.identity.userId || socket.identity.id;
            if (type === "viewer" && String(camera.userId) !== String(ownerId)) return socket.emit("signaling-error", "Camera access denied");
            if (type === "camera" && String(socket.identity.cameraId) !== String(camera._id)) return socket.emit("signaling-error", "Device access denied");

            socket.join(room);
            socket.room = room;
            socket.role = type;
            if (type === "camera") {
                camera.isConnected = true;
                camera.status = "online";
                camera.connectedDeviceId = socket.id;
                await camera.save();
                socket.to(room).emit("camera-online");
                const roomSockets = await io.in(room).fetchSockets();
                if (roomSockets.some((roomSocket) => roomSocket.role === "viewer")) {
                    socket.emit("viewer-ready");
                }
            } else {
                if (camera.isConnected && camera.status === "online") {
                    socket.emit("camera-online");
                }
                socket.to(room).emit("viewer-ready");
            }
            socket.emit("joined-room", { room, type });
        } catch (error) {
            socket.emit("signaling-error", "Unable to join camera");
        }
    });

    socket.on("offer", ({ room, offer }) => {
        if (socket.room === room && socket.role === "camera") socket.to(room).emit("offer", offer);
    });
    socket.on("answer", ({ room, answer }) => {
        if (socket.room === room && socket.role === "viewer") socket.to(room).emit("answer", answer);
    });
    socket.on("ice-candidate", ({ room, candidate }) => {
        if (socket.room === room) socket.to(room).emit("ice-candidate", candidate);
    });

    socket.on("disconnect", async () => {
        if (socket.role !== "camera" || !socket.room) return;
        const camera = await Camera.findOne({ _id:socket.room, connectedDeviceId:socket.id });
        if (!camera) return;
        camera.isConnected = false;
        camera.status = "offline";
        camera.connectedDeviceId = null;
        await camera.save();
        socket.to(socket.room).emit("camera-offline");
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => console.log(`CamBridge server running on ${PORT}`));