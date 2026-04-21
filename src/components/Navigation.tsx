import { useState } from 'react';

interface NavigationProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const sections = [
  { id: 'home', label: 'Home', icon: '◉' },
  { id: 'theory', label: 'Theory', icon: '∿' },
  { id: 'simulation', label: 'Lab', icon: '⚡' },
  { id: 'observation', label: 'Observe', icon: '◎' },
  { id: 'about', label: 'About', icon: '◈' },
];

export default function Navigation({ activeSection, onNavigate }: NavigationProps) {
  const [hovering, setHovering] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="mx-auto max-w-4xl mt-4">
          <div className="flex items-center justify-center gap-1 px-2 py-2 rounded-full"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => onNavigate(s.id)}
                onMouseEnter={() => setHovering(s.id)}
                onMouseLeave={() => setHovering(null)}
                className="px-4 py-2 rounded-full text-xs font-mono font-bold transition-all duration-300 cursor-pointer"
                style={{
                  background: activeSection === s.id ? 'rgba(0,204,255,0.15)' : hovering === s.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  color: activeSection === s.id ? '#00ccff' : 'rgba(255,255,255,0.4)',
                  border: activeSection === s.id ? '1px solid rgba(0,204,255,0.2)' : '1px solid transparent',
                }}
              >
                <span className="mr-1">{s.icon}</span> {s.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="flex items-center justify-between px-4 py-3"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-sm font-mono font-bold text-cyan-400">IIMG</span>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white/60 text-xl cursor-pointer"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
        {mobileOpen && (
          <div className="px-4 py-3 space-y-1" style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => { onNavigate(s.id); setMobileOpen(false); }}
                className="block w-full text-left px-4 py-3 rounded-lg text-sm font-mono transition-all cursor-pointer"
                style={{
                  background: activeSection === s.id ? 'rgba(0,204,255,0.1)' : 'transparent',
                  color: activeSection === s.id ? '#00ccff' : 'rgba(255,255,255,0.4)',
                }}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
