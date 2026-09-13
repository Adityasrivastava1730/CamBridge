import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera as CameraIcon,
  Mic,
  MicOff,
  SwitchCamera,
  Flashlight,
  FlashlightOff,
  Copy,
  Check,
  Loader2,
  X,
  MonitorOff,
} from 'lucide-react';
import { createSession } from '@/services/session';
import { getSocket } from '@/services/socket';
import { useWebRTC } from '@/hooks/useWebRTC';
import StatusBadge from '@/components/StatusBadge';

export default function Camera() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [torchOn, setTorchOn] = useState(false);
  const [creating, setCreating] = useState(true);
  const [error, setError] = useState('');

  const { state, startCamera, toggleMic, switchCamera, toggleTorch, stop } =
    useWebRTC('camera', code, videoRef);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { code: sessionCode } = await createSession();
        if (!mounted) return;
        setCode(sessionCode);
        setCreating(false);
        const socket = getSocket();
        socket.emit('create-room', sessionCode, () => {
          startCamera('environment');
        });
      } catch {
        setError('Failed to create session. Is the server running?');
        setCreating(false);
      }
    })();
    return () => {
      mounted = false;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnd = () => {
    if (code) {
      const socket = getSocket();
      socket.emit('leave-room', { code });
    }
    stop();
    navigate('/dashboard');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-400 mb-4">
            <MonitorOff size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
          <p className="text-ink-300 mb-6">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CameraIcon size={22} className="text-brand-400" />
            <h1 className="font-display text-xl font-bold">Camera Node</h1>
            <StatusBadge status={state.status} />
          </div>
          <button onClick={handleEnd} className="btn-ghost text-red-400 hover:text-red-300">
            <X size={18} />
            End Session
          </button>
        </div>

        {creating ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={32} className="animate-spin text-brand-400 mb-4" />
            <p className="text-ink-300">Creating session...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Video preview */}
            <div className="lg:col-span-2">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {state.error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center px-6">
                      <p className="text-red-400 text-sm mb-2">
                        {state.error}
                      </p>
                      <p className="text-ink-400 text-xs">
                        Make sure camera permissions are granted
                      </p>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-red-500/90 px-2.5 py-1 text-xs font-semibold text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    LIVE
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
                <button
                  onClick={() => {
                    const next = !micOn;
                    setMicOn(next);
                    toggleMic(next);
                  }}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-all ${
                    micOn
                      ? 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                      : 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  }`}
                  title={micOn ? 'Mute microphone' : 'Unmute microphone'}
                >
                  {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>

                <button
                  onClick={switchCamera}
                  className="flex items-center justify-center w-12 h-12 rounded-xl border border-white/10 bg-white/5 text-white transition-all hover:bg-white/10"
                  title="Switch camera"
                >
                  <SwitchCamera size={20} />
                </button>

                <button
                  onClick={() => {
                    const next = !torchOn;
                    setTorchOn(next);
                    toggleTorch(next);
                  }}
                  className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-all ${
                    torchOn
                      ? 'border-accent-500/30 bg-accent-500/10 text-accent-400 hover:bg-accent-500/20'
                      : 'border-white/10 bg-white/5 text-white hover:bg-white/10'
                  }`}
                  title="Toggle torch"
                >
                  {torchOn ? <Flashlight size={20} /> : <FlashlightOff size={20} />}
                </button>
              </div>
            </div>

            {/* Pairing code panel */}
            <div className="lg:col-span-1">
              <div className="card h-full flex flex-col items-center justify-center text-center">
                <h3 className="text-sm font-medium text-ink-300 mb-4">
                  Pairing Code
                </h3>
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-500/10 blur-2xl rounded-full" />
                  <div className="relative font-display text-5xl font-extrabold tracking-[0.2em] text-brand-400 bg-brand-500/5 border border-brand-500/20 rounded-2xl px-8 py-6">
                    {code}
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  className="mt-4 btn-secondary text-sm"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy Code
                    </>
                  )}
                </button>
                <p className="mt-6 text-xs text-ink-400 leading-relaxed max-w-xs">
                  Enter this code on your viewer device to pair and start
                  watching the live stream.
                </p>
                {state.status === 'connected' && (
                  <div className="mt-4 flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Viewer connected
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
