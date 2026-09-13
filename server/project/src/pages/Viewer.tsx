import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Monitor,
  Volume2,
  VolumeX,
  Maximize,
  Camera as CameraIcon,
  X,
  Loader2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { getSocket } from '@/services/socket';
import { useWebRTC } from '@/hooks/useWebRTC';
import StatusBadge from '@/components/StatusBadge';

export default function Viewer() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [code, setCode] = useState('');
  const [paired, setPaired] = useState(false);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);
  const [muted, setMuted] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);

  const { state, stop } = useWebRTC('viewer', paired ? code : null, videoRef);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Enter a valid 6-digit code');
      return;
    }
    setError('');
    setJoining(true);
    const socket = getSocket();
    socket.emit('join-room', code, (res: { ok?: boolean; error?: string }) => {
      setJoining(false);
      if (res.error) {
        setError(res.error);
      } else {
        setPaired(true);
      }
    });
  };

  const handleMute = () => {
    const next = !muted;
    setMuted(next);
    if (videoRef.current) videoRef.current.muted = next;
  };

  const handleSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    setSnapshot(dataUrl);
    setTimeout(() => setSnapshot(null), 3000);
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const handleEnd = () => {
    if (paired && code) {
      const socket = getSocket();
      socket.emit('leave-room', { code });
    }
    stop();
    navigate('/dashboard');
  };

  useEffect(() => {
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!paired) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 text-ink-200 mb-4">
              <Monitor size={32} />
            </div>
            <h1 className="font-display text-2xl font-bold">Viewer Node</h1>
            <p className="text-ink-300 mt-2">
              Enter the 6-digit code from your camera device
            </p>
          </div>

          <div className="glass-strong rounded-2xl p-8">
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-200 mb-1.5">
                  Pairing Code
                </label>
                <div className="relative">
                  <KeyRound
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                  />
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, ''))
                    }
                    placeholder="000000"
                    className="input-field pl-10 text-center text-2xl tracking-[0.5em] font-bold"
                    style={{ letterSpacing: '0.5em' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={joining || code.length !== 6}
                className="btn-primary w-full py-3.5 disabled:opacity-50"
              >
                {joining ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect to Camera'
                )}
              </button>
            </form>

            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 btn-ghost w-full"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Monitor size={22} className="text-brand-400" />
            <h1 className="font-display text-xl font-bold">Viewer Node</h1>
            <StatusBadge status={state.status} />
          </div>
          <button
            onClick={handleEnd}
            className="btn-ghost text-red-400 hover:text-red-300"
          >
            <X size={18} />
            Disconnect
          </button>
        </div>

        {/* Video stream */}
        <div
          ref={containerRef}
          className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />

          {/* Overlay states */}
          {state.status === 'connecting' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <Loader2
                size={32}
                className="animate-spin text-brand-400 mb-3"
              />
              <p className="text-ink-200 text-sm">
                Establishing connection...
              </p>
            </div>
          )}

          {state.status === 'disconnected' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <p className="text-orange-400 text-sm mb-2">
                Camera disconnected
              </p>
              <p className="text-ink-400 text-xs">
                Waiting for reconnection...
              </p>
            </div>
          )}

          {state.status === 'failed' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
              <AlertCircle size={32} className="text-red-400 mb-3" />
              <p className="text-red-400 text-sm mb-1">Connection failed</p>
              <p className="text-ink-400 text-xs">
                {state.error || 'Please try reconnecting'}
              </p>
            </div>
          )}

          {/* Snapshot flash */}
          {snapshot && (
            <div className="absolute inset-0 bg-white animate-fade-in pointer-events-none" />
          )}

          {/* Controls bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-3 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <button
              onClick={handleMute}
              className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 bg-black/50 backdrop-blur text-white transition-all hover:bg-black/70"
              title={muted ? 'Unmute audio' : 'Mute audio'}
            >
              {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <button
              onClick={handleSnapshot}
              className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 bg-black/50 backdrop-blur text-white transition-all hover:bg-black/70"
              title="Capture snapshot"
            >
              <CameraIcon size={20} />
            </button>
            <button
              onClick={handleFullscreen}
              className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 bg-black/50 backdrop-blur text-white transition-all hover:bg-black/70"
              title="Fullscreen"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>

        {/* Session info */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm">
          <div className="flex items-center gap-2 text-ink-300">
            <span className="text-ink-400">Session Code:</span>
            <span className="font-mono font-bold text-brand-400 tracking-widest">
              {code}
            </span>
          </div>
          <div className="flex items-center gap-4 text-ink-400">
            <span>Latency: {state.status === 'connected' ? '~200ms' : '—'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
