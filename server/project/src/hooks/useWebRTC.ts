import { useRef, useState, useCallback, useEffect } from 'react';
import { getSocket } from '@/services/socket';

const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

interface WebRTCState {
  status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'failed';
  error: string | null;
}

export function useWebRTC(
  role: 'camera' | 'viewer',
  code: string | null,
  videoRef: React.RefObject<HTMLVideoElement>
) {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const socket = getSocket();
  const [state, setState] = useState<WebRTCState>({
    status: 'idle',
    error: null,
  });

  const setStatus = (status: WebRTCState['status']) =>
    setState((s) => ({ ...s, status }));

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    pc.onconnectionstatechange = () => {
      const st = pc.connectionState;
      if (st === 'connected') setStatus('connected');
      else if (st === 'connecting') setStatus('connecting');
      else if (st === 'disconnected') setStatus('disconnected');
      else if (st === 'failed') {
        setStatus('failed');
        setState((s) => ({ ...s, error: 'Connection failed' }));
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && code) {
        socket.emit('ice-candidate', { code, candidate: event.candidate });
      }
    };

    if (role === 'viewer') {
      pc.ontrack = (event) => {
        if (videoRef.current && event.streams[0]) {
          videoRef.current.srcObject = event.streams[0];
        }
      };
    }

    pcRef.current = pc;
    return pc;
  }, [code, role, socket, videoRef]);

  // Camera: start local media and create offer
  const startCamera = useCallback(
    async (facingMode: 'user' | 'environment' = 'environment') => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: true,
        });
        localStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        const pc = createPeerConnection();
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        setStatus('connecting');
      } catch (err) {
        setState((s) => ({
          ...s,
          error: 'Failed to access camera: ' + (err as Error).message,
        }));
      }
    },
    [createPeerConnection, videoRef]
  );

  // Camera: send offer when viewer joins
  const sendOffer = useCallback(async () => {
    const pc = pcRef.current;
    if (!pc || !code) return;
    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', { code, sdp: offer });
    } catch (err) {
      setState((s) => ({ ...s, error: 'Failed to create offer' }));
    }
  }, [code, socket]);

  // Viewer: handle incoming offer, create answer
  const handleOffer = useCallback(
    async (sdp: RTCSessionDescriptionInit) => {
      const pc = createPeerConnection();
      try {
        await pc.setRemoteDescription(sdp);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { code, sdp: answer });
        setStatus('connecting');
      } catch (err) {
        setState((s) => ({ ...s, error: 'Failed to handle offer' }));
      }
    },
    [code, createPeerConnection, socket]
  );

  // Handle incoming answer
  const handleAnswer = useCallback(async (sdp: RTCSessionDescriptionInit) => {
    const pc = pcRef.current;
    if (!pc) return;
    try {
      await pc.setRemoteDescription(sdp);
    } catch {
      setState((s) => ({ ...s, error: 'Failed to set remote description' }));
    }
  }, []);

  // Handle incoming ICE candidate
  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    const pc = pcRef.current;
    if (!pc) return;
    try {
      await pc.addIceCandidate(candidate);
    } catch {
      // candidate may arrive before remote description — ignore
    }
  }, []);

  // Toggle mic
  const toggleMic = useCallback((enabled: boolean) => {
    localStreamRef.current?.getAudioTracks().forEach((t) => (t.enabled = enabled));
    if (code) socket.emit('toggle-mic', { code, enabled });
  }, [code, socket]);

  // Switch camera
  const switchCamera = useCallback(async () => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    const oldFacing = videoTrack.getSettings().facingMode;
    const newFacing = oldFacing === 'user' ? 'environment' : 'user';
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: newFacing },
      audio: true,
    });
    const newTrack = newStream.getVideoTracks()[0];
    const sender = pcRef.current
      ?.getSenders()
      .find((s) => s.track?.kind === 'video');
    if (sender) sender.replaceTrack(newTrack);
    stream.removeTrack(videoTrack);
    stream.addTrack(newTrack);
    if (videoRef.current) videoRef.current.srcObject = stream;
    if (code) socket.emit('toggle-camera', { code, facingMode: newFacing });
  }, [code, socket, videoRef]);

  // Toggle torch (if supported)
  const toggleTorch = useCallback(async (enabled: boolean) => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    try {
      const capabilities = track.getCapabilities() as MediaTrackCapabilities & {
        torch?: boolean;
      };
      if (capabilities.torch) {
        await track.applyConstraints({
          advanced: [{ torch: enabled } as MediaTrackConstraintSet],
        } as MediaTrackConstraints);
      }
      if (code) socket.emit('toggle-torch', { code, enabled });
    } catch {
      // torch not supported
    }
  }, [code, socket]);

  // Stop everything
  const stop = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus('idle');
  }, [videoRef]);

  // Socket event listeners
  useEffect(() => {
    if (!code) return;

    const onOffer = (data: { sdp: RTCSessionDescriptionInit }) =>
      role === 'viewer' && handleOffer(data.sdp);
    const onAnswer = (data: { sdp: RTCSessionDescriptionInit }) =>
      role === 'camera' && handleAnswer(data.sdp);
    const onIce = (data: { candidate: RTCIceCandidateInit }) =>
      handleIceCandidate(data.candidate);
    const onUserJoined = () => role === 'camera' && sendOffer();
    const onUserLeft = () => setStatus('disconnected');

    socket.on('offer', onOffer);
    socket.on('answer', onAnswer);
    socket.on('ice-candidate', onIce);
    socket.on('user-joined', onUserJoined);
    socket.on('user-left', onUserLeft);

    return () => {
      socket.off('offer', onOffer);
      socket.off('answer', onAnswer);
      socket.off('ice-candidate', onIce);
      socket.off('user-joined', onUserJoined);
      socket.off('user-left', onUserLeft);
    };
  }, [code, role, socket, handleOffer, handleAnswer, handleIceCandidate, sendOffer]);

  return {
    state,
    startCamera,
    sendOffer,
    toggleMic,
    switchCamera,
    toggleTorch,
    stop,
  };
}
