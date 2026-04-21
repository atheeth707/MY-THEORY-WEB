import { useEffect, useState } from 'react';

interface AboutData {
  id: number;
  author: string;
  title: string;
  summary: string;
  paper_url: string;
  statement: string;
}

export default function AboutSection() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/about')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setAbout(data[0]);
        else if (data && !Array.isArray(data)) setAbout(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center" style={{ background: '#000005' }}>
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  if (!about) return null;

  return (
    <section className="min-h-screen py-20 px-4 sm:px-8" style={{ background: 'linear-gradient(180deg, #000005, #030012, #000005)' }}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-black text-center mb-16"
          style={{ background: 'linear-gradient(90deg, #00ccff, #8800ff, #ff6600)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          About This Research
        </h2>

        {/* Author Card */}
        <div className="rounded-2xl p-8 mb-8" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0,204,255,0.15)' }}>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg, rgba(0,204,255,0.15), rgba(136,0,255,0.15))', border: '2px solid rgba(0,204,255,0.3)' }}>
              🧑‍🔬
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-white mb-1">{about.author}</h3>
              <p className="text-cyan-400/60 text-sm font-mono">Independent Researcher</p>
            </div>
          </div>
        </div>

        {/* Research Title */}
        <div className="rounded-2xl p-8 mb-8" style={{ background: 'rgba(136,0,255,0.03)', border: '1px solid rgba(136,0,255,0.15)' }}>
          <h3 className="text-xs font-mono text-purple-400/60 uppercase tracking-widest mb-3">Research Title</h3>
          <p className="text-xl sm:text-2xl font-bold text-white/90">{about.title}</p>
        </div>

        {/* Summary */}
        <div className="rounded-2xl p-8 mb-8" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Summary</h3>
          <p className="text-white/60 leading-relaxed">{about.summary}</p>
        </div>

        {/* Statement */}
        <div className="rounded-2xl p-8 mb-8" style={{ background: 'rgba(0,204,255,0.03)', border: '1px solid rgba(0,204,255,0.1)' }}>
          <h3 className="text-xs font-mono text-cyan-400/60 uppercase tracking-widest mb-4">Statement</h3>
          <p className="text-white/50 leading-relaxed italic">"{about.statement}"</p>
        </div>

        {/* Paper Link */}
        <div className="text-center">
          <a
            href={about.paper_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 group"
            style={{
              background: 'linear-gradient(135deg, rgba(0,204,255,0.1), rgba(136,0,255,0.1))',
              border: '1px solid rgba(0,204,255,0.3)',
              color: '#00ccff',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px rgba(0,204,255,0.2)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,204,255,0.6)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,204,255,0.3)';
            }}
          >
            📄 Read Full Paper on Academia.edu
            <span className="text-white/40 group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center">
          <div className="w-16 h-px mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,204,255,0.3), transparent)' }} />
          <p className="text-xs text-white/20 font-mono">
            Information-Induced Modifications to Gravity — Interactive Research Platform
          </p>
          <p className="text-xs text-white/10 font-mono mt-1">
            Built with Three.js • Web Audio API • React
          </p>
        </div>
      </div>
    </section>
  );
}
