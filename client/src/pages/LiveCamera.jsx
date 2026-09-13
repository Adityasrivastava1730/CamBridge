import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import socket from "../socket/socket";

const rtcConfig = { iceServers:[{ urls:"stun:stun.l.google.com:19302" }] };

function LiveCamera(){
    const { id } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const peerRef = useRef(null);
    const pendingCandidates = useRef([]);
    const hasToken = Boolean(localStorage.getItem("token"));
    const [status, setStatus] = useState(hasToken ? "Connecting..." : "Offline");
    const [error, setError] = useState(hasToken ? "" : "Login required");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return undefined;
        const peer = new RTCPeerConnection(rtcConfig);
        peerRef.current = peer;
        const join = () => socket.emit("join-room", { room:id, type:"viewer" });
        const handleOffer = async (offer) => {
            try {
                await peer.setRemoteDescription(new RTCSessionDescription(offer));
                for (const candidate of pendingCandidates.current) await peer.addIceCandidate(candidate);
                pendingCandidates.current = [];
                const answer = await peer.createAnswer();
                await peer.setLocalDescription(answer);
                socket.emit("answer", { room:id, answer });
            } catch (viewerError) { setError(viewerError.message || "Could not connect to camera"); setStatus("Connection failed"); }
        };
        const handleIce = async (candidate) => {
            const ice = new RTCIceCandidate(candidate);
            if (peer.remoteDescription) await peer.addIceCandidate(ice);
            else pendingCandidates.current.push(ice);
        };
        const handleSignalError = (message) => { setError(message); setStatus("Offline"); };
        const handleConnectError = (connectError) => {
            setError(connectError.message || "Could not connect to signaling server");
            setStatus("Connection failed");
        };
        peer.ontrack = ({ streams }) => { if (videoRef.current) videoRef.current.srcObject = streams[0]; setStatus("Live"); setError(""); };
        peer.onicecandidate = ({ candidate }) => candidate && socket.emit("ice-candidate", { room:id, candidate });
        peer.onconnectionstatechange = () => {
            if (["failed", "disconnected"].includes(peer.connectionState)) setStatus("Offline");
        };
        socket.auth = { token };
        socket.on("connect", join);
        socket.on("offer", handleOffer);
        socket.on("ice-candidate", handleIce);
        socket.on("camera-online", () => setStatus("Camera online. Connecting..."));
        socket.on("camera-offline", () => setStatus("Offline"));
        socket.on("signaling-error", handleSignalError);
        socket.on("connect_error", handleConnectError);
        if (socket.connected) join();
        else socket.connect();
        return () => {
            socket.off("connect", join);
            socket.off("offer", handleOffer);
            socket.off("ice-candidate", handleIce);
            socket.off("camera-online");
            socket.off("camera-offline");
            socket.off("signaling-error", handleSignalError);
            socket.off("connect_error", handleConnectError);
            peer.close();
            socket.disconnect();
        };
    }, [id]);

    const retry = () => window.location.reload();
    const fullscreen = () => videoRef.current?.requestFullscreen?.();
    return <main className="min-h-screen bg-slate-950 text-white p-6">
        <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">
            <div><h1 className="text-3xl font-bold">Live Camera</h1><p className="text-slate-400">{status}</p></div>
            <button onClick={() => navigate("/dashboard")} className="px-4 py-2 rounded-lg bg-slate-800">Dashboard</button>
        </header>
        <section className="max-w-6xl mx-auto">
            {error && <div className="mb-4 rounded-lg border border-red-800 bg-red-950/60 p-4 flex justify-between gap-4"><span>{error}</span><button onClick={retry} className="underline">Retry</button></div>}
            <video ref={videoRef} autoPlay playsInline controls className="w-full aspect-video rounded-2xl bg-black object-contain" />
            <button onClick={fullscreen} className="mt-4 px-5 py-3 rounded-lg bg-blue-600">Fullscreen</button>
        </section>
    </main>;
}

export default LiveCamera;