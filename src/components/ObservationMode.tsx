import { useState, useMemo } from 'react';
import { computePhysics, generateDeltaVsMass, generateFreqVsMass } from '../lib/physics';
import MiniGraph from './MiniGraph';

export default function ObservationMode() {
  const [mode, setMode] = useState<'gr' | 'modified'>('modified');
  const [compMass, setCompMass] = useState(100);

  const grPhysics = computePhysics({ mass: compMass, phi: 0, spin: 0.3, showCurvature: true, showInfoField: false, showGravWaves: false, mode: 'gr' });
  const modPhysics = computePhysics({ mass: compMass, phi: 0.5, spin: 0.3, showCurvature: true, showInfoField: true, showGravWaves: false, mode: 'modified' });

  const grDelta = generateDeltaVsMass(0);
  const modDelta = generateDeltaVsMass(0.5);
  const grFreq = generateFreqVsMass(0);
  const modFreq = generateFreqVsMass(0.5);

  const differenceSignal = useMemo(() => {
    return modDelta.map((d, i) => ({
      x: d.x,
      y: d.y - grDelta[i].y,
    }));
  }, [modDelta, grDelta]);

  return (
    <section className="min-h-screen py-20 px-4 sm:px-8" style={{ background: 'linear-gradient(180deg, #000005, #050010, #000005)' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-black text-center mb-4"
          style={{ background: 'linear-gradient(90deg, #00ffcc, #ff6600)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Observation Mode
        </h2>
        <p className="text-center text-white/40 mb-12 max-w-2xl mx-auto">
          Compare predictions between standard General Relativity and the information-modified model
        </p>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full p-1" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => setMode('gr')}
              className="px-6 py-2 rounded-full text-sm font-mono font-bold transition-all duration-300 cursor-pointer"
              style={{
                background: mode === 'gr' ? 'rgba(0,204,255,0.2)' : 'transparent',
                color: mode === 'gr' ? '#00ccff' : 'rgba(255,255,255,0.4)',
              }}
            >
              General Relativity
            </button>
            <button
              onClick={() => setMode('modified')}
              className="px-6 py-2 rounded-full text-sm font-mono font-bold transition-all duration-300 cursor-pointer"
              style={{
                background: mode === 'modified' ? 'rgba(136,0,255,0.2)' : 'transparent',
                color: mode === 'modified' ? '#8800ff' : 'rgba(255,255,255,0.4)',
              }}
            >
              Modified Model
            </button>
          </div>
        </div>

        {/* Mass slider */}
        <div className="max-w-md mx-auto mb-12">
          <label className="text-xs font-mono text-white/40 block mb-2 text-center">Comparison Mass: {compMass} M☉</label>
          <input
            type="range"
            min={1}
            max={1000}
            value={compMass}
            onChange={e => setCompMass(Number(e.target.value))}
            className="w-full h-1 rounded-full appearance-none cursor-pointer"
            style={{ background: 'linear-gradient(to right, #00ccff, #8800ff)', accentColor: '#00ccff' }}
          />
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* GR Panel */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(0,204,255,0.03)', border: '1px solid rgba(0,204,255,0.15)' }}>
            <h3 className="text-lg font-bold text-cyan-400 mb-4 font-mono">General Relativity</h3>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between"><span className="text-white/40">r_s</span><span className="text-cyan-400">{grPhysics.schwarzschildRadius.toExponential(3)} m</span></div>
              <div className="flex justify-between"><span className="text-white/40">δ</span><span className="text-cyan-400">0 (no modification)</span></div>
              <div className="flex justify-between"><span className="text-white/40">Δω/ω</span><span className="text-cyan-400">0</span></div>
              <div className="flex justify-between"><span className="text-white/40">Δτ/τ</span><span className="text-cyan-400">0</span></div>
            </div>
            <div className="mt-4">
              <MiniGraph data={grDelta} color="#00ccff" label="δ (GR)" xLabel="Mass" width={280} height={100} />
            </div>
          </div>

          {/* Modified Panel */}
          <div className="rounded-2xl p-6" style={{ background: 'rgba(136,0,255,0.03)', border: '1px solid rgba(136,0,255,0.15)' }}>
            <h3 className="text-lg font-bold text-purple-400 mb-4 font-mono">Information-Modified</h3>
            <div className="space-y-2 text-sm font-mono">
              <div className="flex justify-between"><span className="text-white/40">r_s</span><span className="text-purple-400">{modPhysics.schwarzschildRadius.toExponential(3)} m</span></div>
              <div className="flex justify-between"><span className="text-white/40">δ</span><span className="text-purple-400">{modPhysics.horizonShift.toExponential(4)}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Δω/ω</span><span className="text-purple-400">{modPhysics.freqShift.toExponential(4)}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Δτ/τ</span><span className="text-purple-400">{modPhysics.dampingShift.toExponential(4)}</span></div>
            </div>
            <div className="mt-4">
              <MiniGraph data={modDelta} color="#8800ff" label="δ (Modified)" xLabel="Mass" width={280} height={100} />
            </div>
          </div>
        </div>

        {/* Difference Signal */}
        <div className="rounded-2xl p-6 max-w-2xl mx-auto" style={{ background: 'rgba(255,102,0,0.03)', border: '1px solid rgba(255,102,0,0.15)' }}>
          <h3 className="text-lg font-bold text-orange-400 mb-2 font-mono text-center">Difference Signal (Modified − GR)</h3>
          <p className="text-xs text-white/30 text-center mb-4">This residual signal is what future gravitational wave detectors could measure</p>
          <div className="flex justify-center">
            <MiniGraph data={differenceSignal} color="#ff6600" label="Δδ" xLabel="Mass (M☉)" yLabel="Signal" width={400} height={150} />
          </div>
        </div>

        {/* Reference */}
        <div className="mt-12 text-center">
          <p className="text-xs text-white/20 font-mono mb-2">Reference Paper</p>
          <a
            href="https://drive.google.com/file/d/1O1RBMJvNzVrwBaTUDup4_dcKFTVajJ5J/view?usp=drive_linkhttps://drive.google.com/file/d/1O1RBMJvNzVrwBaTUDup4_dcKFTVajJ5J/preview"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-xl text-sm font-mono transition-all duration-300"
            style={{
              background: 'rgba(0,204,255,0.08)',
              border: '1px solid rgba(0,204,255,0.25)',
              color: '#00ccff',
            }}
          >
            📄 View on Academia.edu →
          </a>
        </div>
      </div>
    </section>
  );
}
