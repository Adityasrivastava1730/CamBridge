import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../socket/socket";

const rtcConfig = {
    iceServers:[
        { urls:"stun:stun.l.google.com:19302" },
        { urls:"stun:stun.cloudflare.com:3478" }
    ],
    iceCandidatePoolSize:10
};

function PhoneCamera(){
    const { id } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const peerRef = useRef(null);
    const streamRef = useRef(null);
    const pendingCandidates = useRef([]);
    const [status, setStatus] = useState("Starting camera...");
    const [facingMode, setFacingMode] = useState("environment");
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        let cleanup = () => {};

        const start = async () => {
            try {
                const token = localStorage.getItem("deviceToken");
                if (!token) throw new Error("Pair this phone before starting the camera");
                if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
                    throw new Error("Camera needs HTTPS. Open CamBridge using an https:// link on your phone.");
                }
                const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode }, audio:false });
                streamRef.current = stream;
                if (videoRef.current) videoRef.current.srcObject = stream;

                const peer = new RTCPeerConnection(rtcConfig);
                peerRef.current = peer;
                stream.getTracks().forEach((track) => peer.addTrack(track, stream));
                peer.onicecandidate = ({ candidate }) => candidate && socket.emit("ice-candidate", { room:id, candidate });
                peer.onconnectionstatechange = () => {
                    if (["failed", "disconnected", "closed"].includes(peer.connectionState)) setStatus("Viewer disconnected");
                };

                const handleViewerReady = async () => {
                    if (!active || peer.signalingState !== "stable") return;
                    try {
                        const offer = await peer.createOffer();
                        await peer.setLocalDescription(offer);
                        socket.emit("offer", { room:id, offer });
                        setStatus("Streaming to browser");
                    } catch (offerError) {
                        setError(offerError.message || "Could not start video stream");
                    }
                };
                const handleAnswer = async (answer) => {
                    if (peer.signalingState === "have-local-offer") {
                        await peer.setRemoteDescription(new RTCSessionDescription(answer));
                        for (const candidate of pendingCandidates.current) await peer.addIceCandidate(candidate);
                        pendingCandidates.current = [];
                    }
                };
                const handleIce = async (candidate) => {
                    const ice = new RTCIceCandidate(candidate);
                    if (peer.remoteDescription) {
                        await peer.addIceCandidate(ice);
                    } else {
                        pendingCandidates.current.push(ice);
                    }
                };
                const handleSocketError = (message) => setError(message);
                const join = () => socket.emit("join-room", { room:id, type:"camera" });
                const handleConnectError = (connectError) => {
                    setError(connectError.message || "Could not connect to signaling server");
                    setStatus("Connection failed");
                };
                socket.auth = { token };
                socket.on("connect", join);
                socket.on("viewer-ready", handleViewerReady);
                socket.on("answer", handleAnswer);
                socket.on("ice-candidate", handleIce);
                socket.on("signaling-error", handleSocketError);
                socket.on("connect_error", handleConnectError);
                if (socket.connected) join();
                else socket.connect();
                setStatus("Camera ready. Waiting for viewer...");

                cleanup = () => {
                    active = false;
                    socket.off("connect", join);
                    socket.off("viewer-ready", handleViewerReady);
                    socket.off("answer", handleAnswer);
                    socket.off("ice-candidate", handleIce);
                    socket.off("signaling-error", handleSocketError);
                    socket.off("connect_error", handleConnectError);
                    peer.close();
                    stream.getTracks().forEach((track) => track.stop());
                    socket.disconnect();
                };
            } catch (cameraError) {
                setError(cameraError.message || "Camera permission was denied");
                setStatus("Camera unavailable");
            }
        };

        start();
        return () => cleanup();
    }, [id, facingMode]);

    return <main className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center gap-5">
        <div className="w-full max-w-3xl flex items-center justify-between">
            <div><h1 className="text-3xl font-bold">Phone Camera</h1><p className="text-slate-400">{status}</p></div>
            <button onClick={() => navigate("/connect-camera")} className="px-4 py-2 rounded-lg bg-slate-800">Change camera</button>
        </div>
        {error && <p className="w-full max-w-3xl rounded-lg bg-red-950/60 border border-red-800 p-4 text-red-200">{error}</p>}
        <video ref={videoRef} autoPlay muted playsInline className="w-full max-w-3xl aspect-video rounded-2xl bg-black object-cover" />
        <button onClick={() => setFacingMode((mode) => mode === "environment" ? "user" : "environment")} className="px-5 py-3 rounded-lg bg-blue-600">Switch front/back camera</button>
    </main>;
}

export default PhoneCamera;