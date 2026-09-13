import { Loader2, Wifi, WifiOff } from 'lucide-react';

interface Props {
  status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'failed';
}

export default function StatusBadge({ status }: Props) {
  const config = {
    idle: { label: 'Idle', color: 'text-ink-400 bg-ink-700', icon: WifiOff },
    connecting: {
      label: 'Connecting',
      color: 'text-accent-400 bg-accent-400/10',
      icon: Loader2,
    },
    connected: {
      label: 'Online',
      color: 'text-emerald-400 bg-emerald-400/10',
      icon: Wifi,
    },
    disconnected: {
      label: 'Disconnected',
      color: 'text-orange-400 bg-orange-400/10',
      icon: WifiOff,
    },
    failed: {
      label: 'Failed',
      color: 'text-red-400 bg-red-400/10',
      icon: WifiOff,
    },
  };

  const c = config[status];
  const Icon = c.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${c.color}`}
    >
      <Icon
        size={12}
        className={status === 'connecting' ? 'animate-spin' : ''}
      />
      {c.label}
    </span>
  );
}
