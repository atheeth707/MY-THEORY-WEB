import { useState, useCallback, useEffect } from 'react';
import SimulationScene from './SimulationScene';
import MiniGraph from './MiniGraph';
import { computePhysics, formatScientific, generateDeltaVsMass, generateFreqVsMass } from '../lib/physics';
import { initAudio, playDeepBass, playRisingTone, playBurst, resumeAudio } from '../lib/audioEngine';

export default function SimulationLab() {
  const [mass, setMass] = useState(100);
  const [phi, setPhi] = useState(0.5);
  const [spin, setSpin] = useState(0.3);
  const [showCurvature, setShowCurvature] = useState(true);
  const [showInfoField, setShowInfoField] = useState(true);
  const [showGravWaves, setShowGravWaves] = useState(false);
  const [merging, setMerging] = useState(false);
  const [exploding, setExploding] = useState(false);
  const [audioInit, setAudioInit] = useState(false);
  const [screenShake, setScreenShake] = useState(false);

  const physics = computePhysics({ mass, phi, spin, showCurvature, showInfoField, showGravWaves, mode: 'modified' });
  const deltaData = generateDeltaVsMass(phi);
  const freqData = generateFreqVsMass(phi);

  const ensureAudio = useCallback(() => {
    if (!audioInit) {
      initAudio();
      setAudioInit(true);
    }
    resumeAudio();
  }, [audioInit]);

  const handleMerge = useCallback(() => {
    ensureAudio();
    setMerging(true);
    playRisingTone(60, 600, 3);
    setTimeout(() => {
      playBurst();
      setScreenShake(true);
      setShowGravWaves(true);
      setTimeout(() => {
        setScreenShake(false);
        setMerging(false);
      }, 1500);
    }, 3000);
  }, [ensureAudio]);

  const handleExplode = useCallback(() => {
    ensureAudio();
    setExploding(true);
    playBurst();
    setScreenShake(true);
    setShowGravWaves(true);
    setTimeout(() => {
      setScreenShake(false);
      setExploding(false);
    }, 2000);
  }, [ensureAudio]);

  const handleReset = useCallback(() => {
    setMass(100);
    setPhi(0.5);
    setSpin(0.3);
    setShowCurvature(true);
    setShowInfoField(true);
    setShowGravWaves(false);
    setMerging(false);
    setExploding(false);
  }, []);

  useEffect(() => {
    if (audioInit && mass > 500) {
      playDeepBass(20 + (mass / 1000) * 20, 0.5);
    }
  }, [mass, audioInit]);

  return (
    <section
      id="simulation-lab"
      className="min-h-screen py-6 px-2 sm:px-4"
      style={{ background: '#000005' }}
    >
      <h2 className="text-2xl sm:text-4xl font-black text-center mb-6"
        style={{ background: 'linear-gradient(90deg, #ff6600, #00ccff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        ⚡ Simulation Laboratory
      </h2>

      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-4">
        {/* LEFT PANEL */}
        <div className="w-full lg:w-64 shrink-0 space-y-3">
          <Panel title="Parameters">
            <SliderControl label={`Mass: ${mass} M☉`} value={mass} min={1} max={1000} step={1} onChange={setMass} color="#00ccff" />
            <SliderControl label={`Info Field φ: ${phi.toFixed(2)}`} value={phi} min={0} max={1} step={0.01} onChange={setPhi} color="#8800ff" />
            <SliderControl label={`Spin: ${spin.toFixed(2)}`} value={spin} min={0} max={0.99} step={0.01} onChange={setSpin} color="#ff6600" />
          </Panel>

          <Panel title="Visualization">
            <ToggleSwitch label="Spacetime Curvature" checked={showCurvature} onChange={setShowCurvature} color="#00ffcc" />
            <ToggleSwitch label="Information Field" checked={showInfoField} onChange={setShowInfoField} color="#8800ff" />
            <ToggleSwitch label="Gravitational Waves" checked={showGravWaves} onChange={setShowGravWaves} color="#ff6600" />
          </Panel>

          <Panel title="Actions">
            <ActionButton label="🌀 Merge Black Holes" onClick={handleMerge} color="#00ccff" />
            <ActionButton label="💥 Disturb System" onClick={handleExplode} color="#ff6600" />
            <ActionButton label="↺ Reset" onClick={handleReset} color="#666" />
          </Panel>
        </div>

        {/* CENTER - 3D Scene */}
        <div className="flex-1 min-h-[400px] lg:min-h-[600px] rounded-2xl overflow-hidden relative"
          style={{
            border: '1px solid rgba(0,204,255,0.15)',
            animation: screenShake ? 'shake 0.15s infinite' : 'none',
          }}>
          <SimulationScene
            mass={mass}
            phi={phi}
            spin={spin}
            showCurvature={showCurvature}
            showInfoField={showInfoField}
            showGravWaves={showGravWaves}
            merging={merging}
            exploding={exploding}
          />
          <div className="absolute top-3 left-3 text-[10px] font-mono text-white/30 pointer-events-none">
            DRAG TO ORBIT • SCROLL TO ZOOM
          </div>
          {merging && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse">
              MERGING...
            </div>
          )}
          {exploding && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-mono bg-orange-500/20 text-orange-400 border border-orange-500/30 animate-pulse">
              DISTURBANCE!
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full lg:w-72 shrink-0 space-y-3">
          <Panel title="Live Physics">
            <PhysicsReadout label="Schwarzschild Radius" value={formatScientific(physics.schwarzschildRadius)} unit="m" color="#00ccff" />
            <PhysicsReadout label="Horizon Shift δ" value={physics.horizonShift.toExponential(4)} unit="" color="#ff6600" />
            <PhysicsReadout label="Λ_eff" value={formatScientific(physics.lambdaEff)} unit="m⁻²" color="#8800ff" />
            <PhysicsReadout label="Δω/ω" value={physics.freqShift.toExponential(4)} unit="" color="#00ffcc" />
            <PhysicsReadout label="Δτ/τ" value={physics.dampingShift.toExponential(4)} unit="" color="#ff44aa" />
          </Panel>

          <Panel title="δ vs Mass">
            <MiniGraph data={deltaData} color="#ff6600" label="Horizon Shift" xLabel="Mass (M☉)" yLabel="δ" width={240} height={110} />
          </Panel>

          <Panel title="Δω/ω vs Mass">
            <MiniGraph data={freqData} color="#00ffcc" label="Freq Shift" xLabel="Mass (M☉)" yLabel="Δω/ω" width={240} height={110} />
          </Panel>
        </div>
      </div>
    </section>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <h3 className="text-xs font-mono font-bold text-white/40 uppercase tracking-widest mb-3">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SliderControl({ label, value, min, max, step, onChange, color }: {
  label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; color: string;
}) {
  return (
    <div>
      <label className="text-xs font-mono text-white/60 block mb-1">{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 100%)`,
          accentColor: color,
        }}
      />
    </div>
  );
}

function ToggleSwitch({ label, checked, onChange, color }: {
  label: string; checked: boolean; onChange: (v: boolean) => void; color: string;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-xs font-mono text-white/50 group-hover:text-white/70 transition-colors">{label}</span>
      <div
        className="w-9 h-5 rounded-full relative transition-colors duration-300 cursor-pointer"
        style={{ background: checked ? color + '40' : 'rgba(255,255,255,0.1)' }}
        onClick={() => onChange(!checked)}
      >
        <div
          className="w-4 h-4 rounded-full absolute top-0.5 transition-all duration-300"
          style={{
            left: checked ? '18px' : '2px',
            background: checked ? color : 'rgba(255,255,255,0.3)',
            boxShadow: checked ? `0 0 8px ${color}60` : 'none',
          }}
        />
      </div>
    </label>
  );
}

function ActionButton({ label, onClick, color }: { label: string; onClick: () => void; color: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all duration-300 cursor-pointer"
      style={{
        background: `${color}15`,
        border: `1px solid ${color}30`,
        color: color,
      }}
      onMouseEnter={e => {
        (e.target as HTMLElement).style.background = `${color}30`;
        (e.target as HTMLElement).style.boxShadow = `0 0 20px ${color}20`;
      }}
      onMouseLeave={e => {
        (e.target as HTMLElement).style.background = `${color}15`;
        (e.target as HTMLElement).style.boxShadow = 'none';
      }}
    >
      {label}
    </button>
  );
}

function PhysicsReadout({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-[10px] font-mono text-white/40">{label}</span>
      <span className="text-xs font-mono font-bold" style={{ color }}>
        {value} <span className="text-white/30">{unit}</span>
      </span>
    </div>
  );
}
