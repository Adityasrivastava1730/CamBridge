import { useNavigate } from 'react-router-dom';
import { Camera, Monitor, ArrowRight, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold">
            Welcome, {user?.username}
          </h1>
          <p className="text-ink-300 mt-1">
            Choose a role to start streaming. You can switch anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Camera Node */}
          <button
            onClick={() => navigate('/camera')}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-900/20 via-ink-900 to-ink-950 p-8 text-left transition-all hover:border-brand-500/30 hover:-translate-y-1"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl group-hover:bg-brand-500/20 transition-all" />
            <div className="relative">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-brand-500/10 text-brand-400 mb-4 group-hover:bg-brand-500/20 transition-colors">
                <Camera size={28} />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">
                Camera Node
              </h2>
              <p className="text-sm text-ink-300 leading-relaxed mb-4">
                Use this device's camera as the source. Generate a pairing code
                and stream live video and audio to a viewer.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-400 group-hover:text-brand-300">
                Start as Camera
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </div>
          </button>

          {/* Viewer Node */}
          <button
            onClick={() => navigate('/viewer')}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ink-800/20 via-ink-900 to-ink-950 p-8 text-left transition-all hover:border-white/20 hover:-translate-y-1"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
            <div className="relative">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 text-ink-200 mb-4 group-hover:bg-white/10 transition-colors">
                <Monitor size={28} />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">
                Viewer Node
              </h2>
              <p className="text-sm text-ink-300 leading-relaxed mb-4">
                Enter a pairing code from a camera node to view the live stream.
                Control audio, capture snapshots, and go fullscreen.
              </p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-200 group-hover:text-white">
                Start as Viewer
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </span>
            </div>
          </button>
        </div>

        {/* Info banner */}
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-ink-300">
          <Info size={18} className="text-brand-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-ink-200 font-medium mb-1">How pairing works</p>
            <p>
              Open CamBridge on your spare phone and select Camera Node to get a
              6-digit code. Then open the Viewer Node on any other device and
              enter that code to connect instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
