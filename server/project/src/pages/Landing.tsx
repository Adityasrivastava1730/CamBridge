import { Link } from 'react-router-dom';
import {
  Camera,
  Monitor,
  Shield,
  Zap,
  Eye,
  Smartphone,
  ArrowRight,
  Radio,
  Lock,
  RefreshCw,
  Volume2,
  Maximize,
  Check,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background grid + glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.12),transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/5 px-4 py-1.5 text-sm text-brand-300 mb-8 animate-fade-in">
            <Radio size={14} className="text-brand-400" />
            Real-time P2P streaming via WebRTC
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] animate-fade-in-up">
            Turn any spare phone into a
            <br />
            <span className="bg-gradient-to-r from-brand-300 via-brand-400 to-brand-500 bg-clip-text text-transparent">
              live security camera
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-300 leading-relaxed animate-fade-in-up">
            CamBridge transforms your old smartphone into a live, remote
            security camera. Stream video and audio in real-time with low
            latency to any device — desktop, laptop, or phone.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
            <Link to={user ? '/dashboard' : '/register'} className="btn-primary text-base px-8 py-4">
              {user ? 'Go to Dashboard' : 'Start Free'}
              <ArrowRight size={18} />
            </Link>
            <Link to={user ? '/dashboard' : '/login'} className="btn-secondary text-base px-8 py-4">
              {user ? 'View Stream' : 'Sign In'}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in">
            {[
              { label: 'Latency', value: '< 500ms' },
              { label: 'Setup Time', value: '30 sec' },
              { label: 'Cost', value: 'Free' },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-bold text-white">
                  {s.value}
                </div>
                <div className="text-sm text-ink-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold tracking-tight">
              How it works
            </h2>
            <p className="mt-3 text-ink-300 text-lg">
              Three simple steps. No technical knowledge required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Smartphone,
                step: '01',
                title: 'Pick a Camera Node',
                desc: 'Open CamBridge on your spare phone and select "Camera Node". It becomes your live security camera instantly.',
              },
              {
                icon: Lock,
                step: '02',
                title: 'Get a Pairing Code',
                desc: 'A unique 6-digit code is generated. Enter it on your viewer device — desktop, laptop, or another phone.',
              },
              {
                icon: Eye,
                step: '03',
                title: 'Stream in Real-Time',
                desc: 'See and hear the live feed with low latency via WebRTC peer-to-peer streaming. No cloud storage needed.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="card hover:border-brand-500/30 transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 group-hover:bg-brand-500/20 transition-colors">
                    <item.icon size={24} />
                  </div>
                  <span className="font-display text-3xl font-bold text-ink-700">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-ink-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold tracking-tight">
              Everything you need
            </h2>
            <p className="mt-3 text-ink-300 text-lg">
              A complete security camera system built with modern tech.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Zap,
                title: 'Low Latency Streaming',
                desc: 'WebRTC peer-to-peer technology delivers video with sub-second latency.',
              },
              {
                icon: Shield,
                title: 'Secure Authentication',
                desc: 'JWT-based auth with bcrypt password hashing keeps your sessions private.',
              },
              {
                icon: RefreshCw,
                title: 'Auto-Reconnection',
                desc: 'Network drops? CamBridge automatically reconnects when connectivity returns.',
              },
              {
                icon: Camera,
                title: 'Camera Controls',
                desc: 'Switch between front and back cameras, toggle mic, and control torch.',
              },
              {
                icon: Monitor,
                title: 'Viewer Dashboard',
                desc: 'Mute audio, capture snapshots, go fullscreen, and monitor connection status.',
              },
              {
                icon: Radio,
                title: 'Real-Time Signaling',
                desc: 'Socket.IO handles SDP offer/answer and ICE candidate exchange seamlessly.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="card hover:border-brand-500/20 transition-all"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 mb-3">
                  <f.icon size={20} />
                </div>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-sm text-ink-300 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold mb-4">
            Built with a modern stack
          </h2>
          <p className="text-ink-300 mb-12">
            MERN + WebRTC + Socket.IO — production-grade technologies working
            together.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              'React + Vite',
              'Node.js',
              'Express.js',
              'MongoDB',
              'Socket.IO',
              'WebRTC',
              'JWT Auth',
              'Tailwind CSS',
            ].map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium text-ink-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-900/30 via-ink-900 to-ink-950 p-12 text-center">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="font-display text-4xl font-bold mb-4">
                Ready to bridge your devices?
              </h2>
              <p className="text-ink-300 mb-8 text-lg">
                Join CamBridge and turn your spare phone into a security camera
                in under a minute.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={user ? '/dashboard' : '/register'}
                  className="btn-primary text-base px-8 py-4"
                >
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-ink-400">
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-brand-400" />
                  No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-brand-400" />
                  Setup in 30 seconds
                </span>
                <span className="flex items-center gap-1.5">
                  <Check size={14} className="text-brand-400" />
                  Open source stack
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-ink-400">
            CamBridge — Smart Phone Security Camera System
          </p>
          <div className="flex items-center gap-6 text-sm text-ink-400">
            <span className="flex items-center gap-1.5">
              <Volume2 size={14} /> Real-time audio
            </span>
            <span className="flex items-center gap-1.5">
              <Maximize size={14} /> Fullscreen viewer
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
