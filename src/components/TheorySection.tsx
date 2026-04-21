import { useState, useEffect, useRef } from 'react';

const concepts = [
  {
    title: 'Gravity as Spacetime Curvature',
    description: 'In General Relativity, massive objects curve the fabric of spacetime. Objects follow geodesics — the straightest possible paths through curved geometry.',
    icon: '🌀',
    color: '#00ccff',
  },
  {
    title: 'Information as a Physical Entity',
    description: 'Information is not merely abstract — it has physical consequences. The information content of a system can be described by a scalar field φ that permeates spacetime.',
    icon: '📡',
    color: '#8800ff',
  },
  {
    title: 'The Information Field φ',
    description: 'The scalar field φ couples to gravity through an effective cosmological constant Λ_eff, introducing corrections to the standard gravitational equations.',
    icon: '⚛️',
    color: '#ff6600',
  },
  {
    title: 'Modified Black Hole Horizons',
    description: 'The information field shifts the event horizon radius by δ, modifies quasinormal mode frequencies, and alters the ringdown signal of black hole mergers.',
    icon: '🕳️',
    color: '#00ffcc',
  },
];

const equations = [
  { latex: 'r_s = 2GM / c²', label: 'Schwarzschild Radius', color: '#00ccff' },
  { latex: 'Λ_eff = (4πG / c⁴) m² φ²', label: 'Effective Cosmological Constant', color: '#8800ff' },
  { latex: 'δ = (Λ_eff / 3) r_s²', label: 'Horizon Shift', color: '#ff6600' },
  { latex: 'Δω/ω ≈ −δ', label: 'Frequency Shift', color: '#00ffcc' },
  { latex: 'Δτ/τ ≈ +δ', label: 'Damping Time Shift', color: '#ff44aa' },
];

export default function TheorySection() {
  const [activeEq, setActiveEq] = useState<number | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const idx = Number(entry.target.getAttribute('data-idx'));
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.3 }
    );

    cardsRef.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="min-h-screen py-20 px-4 sm:px-8" style={{ background: 'linear-gradient(180deg, #000005 0%, #050015 50%, #000005 100%)' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-black text-center mb-4"
          style={{ background: 'linear-gradient(90deg, #00ccff, #8800ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Theoretical Framework
        </h2>
        <p className="text-center text-white/40 mb-16 max-w-2xl mx-auto">
          How information fields modify gravitational dynamics — from spacetime curvature to observable signatures
        </p>

        {/* Concept Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {concepts.map((concept, i) => (
            <div
              key={i}
              ref={el => { cardsRef.current[i] = el; }}
              data-idx={i}
              className="rounded-2xl p-6 transition-all duration-700"
              style={{
                background: `linear-gradient(135deg, ${concept.color}08, ${concept.color}03)`,
                border: `1px solid ${concept.color}20`,
                opacity: visibleCards.has(i) ? 1 : 0,
                transform: visibleCards.has(i) ? 'translateY(0)' : 'translateY(40px)',
              }}
            >
              <div className="text-4xl mb-3">{concept.icon}</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: concept.color }}>{concept.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{concept.description}</p>
            </div>
          ))}
        </div>

        {/* Flow Diagram */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
          {['Information φ', '→', 'Scalar Field', '→', 'Λ_eff', '→', 'Modified Gravity'].map((item, i) => (
            <div key={i} className={i % 2 === 1 ? 'text-2xl text-cyan-500/50' : ''}>
              {i % 2 === 1 ? (
                <span>{item}</span>
              ) : (
                <div className="px-5 py-3 rounded-xl text-sm font-mono font-bold"
                  style={{
                    background: 'rgba(0,204,255,0.06)',
                    border: '1px solid rgba(0,204,255,0.2)',
                    color: '#00ccff',
                  }}>
                  {item}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Equations */}
        <h3 className="text-2xl font-bold text-center mb-8 text-white/70">Key Equations</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {equations.map((eq, i) => (
            <div
              key={i}
              className="rounded-xl p-5 cursor-pointer transition-all duration-300"
              style={{
                background: activeEq === i ? `${eq.color}15` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${activeEq === i ? eq.color + '60' : 'rgba(255,255,255,0.06)'}`,
                boxShadow: activeEq === i ? `0 0 30px ${eq.color}20` : 'none',
              }}
              onMouseEnter={() => setActiveEq(i)}
              onMouseLeave={() => setActiveEq(null)}
            >
              <div className="font-mono text-lg mb-2 font-bold" style={{ color: eq.color }}>
                {eq.latex}
              </div>
              <div className="text-xs text-white/40">{eq.label}</div>
            </div>
          ))}
        </div>

        {/* Hover hint */}
        <p className="text-center text-white/20 text-xs mt-6 font-mono">
          ↑ Hover equations to highlight • These modify the 3D simulation in the lab ↑
        </p>
      </div>
    </section>
  );
}
