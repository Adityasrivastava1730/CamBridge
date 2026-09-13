import { Link } from 'react-router-dom';
import { Camera } from 'lucide-react';

export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { icon: 20, text: 'text-base' },
    md: { icon: 24, text: 'text-lg' },
    lg: { icon: 32, text: 'text-2xl' },
  };
  const s = sizes[size];
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative">
        <div className="absolute inset-0 bg-brand-500/30 blur-lg rounded-full group-hover:bg-brand-400/40 transition-all" />
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/20">
          <Camera size={s.icon} className="text-ink-950" strokeWidth={2.5} />
        </div>
      </div>
      <span className={`font-display font-bold tracking-tight ${s.text}`}>
        Cam<span className="text-brand-400">Bridge</span>
      </span>
    </Link>
  );
}
