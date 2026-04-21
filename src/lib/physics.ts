// Physics engine for Information-Induced Modifications to Gravity

export const G = 6.674e-11; // gravitational constant
export const c = 3e8; // speed of light
export const M_SUN = 1.989e30; // solar mass in kg
export const PI = Math.PI;

export interface PhysicsState {
  mass: number; // in solar masses
  phi: number; // information field strength 0-1
  spin: number; // 0-0.99
  showCurvature: boolean;
  showInfoField: boolean;
  showGravWaves: boolean;
  mode: 'gr' | 'modified';
}

export interface PhysicsResults {
  schwarzschildRadius: number;
  lambdaEff: number;
  horizonShift: number;
  freqShift: number;
  dampingShift: number;
  massKg: number;
}

export function computePhysics(state: PhysicsState): PhysicsResults {
  const massKg = state.mass * M_SUN;
  
  // Schwarzschild radius: r_s = 2GM/c²
  const r_s = (2 * G * massKg) / (c * c);
  
  // Information field mass parameter (normalized)
  const m_phi = state.phi * 1e-10; // effective information field mass
  
  // Effective cosmological constant: Λ_eff = (4πG/c⁴) * m² * φ²
  const lambdaEff = (4 * PI * G / Math.pow(c, 4)) * Math.pow(m_phi, 2) * Math.pow(state.phi, 2);
  
  // Horizon shift: δ = (Λ_eff/3) * r_s²
  const delta = (lambdaEff / 3) * Math.pow(r_s, 2);
  
  // Normalized delta for visualization (scaled up for visible effects)
  const deltaVis = state.phi * state.phi * state.mass * state.mass * 1e-6;
  
  // Frequency shift: Δω/ω ≈ −δ
  const freqShift = -deltaVis;
  
  // Damping time shift: Δτ/τ ≈ +δ
  const dampingShift = deltaVis;
  
  return {
    schwarzschildRadius: r_s,
    lambdaEff,
    horizonShift: deltaVis,
    freqShift,
    dampingShift,
    massKg,
  };
}

export function formatScientific(value: number, digits: number = 3): string {
  if (value === 0) return '0';
  if (Math.abs(value) < 1e-20) return '~0';
  const exp = Math.floor(Math.log10(Math.abs(value)));
  const mantissa = value / Math.pow(10, exp);
  if (exp === 0) return value.toFixed(digits);
  return `${mantissa.toFixed(digits)} × 10^${exp}`;
}

export function generateDeltaVsMass(phi: number, points: number = 50): {x: number, y: number}[] {
  const data: {x: number, y: number}[] = [];
  for (let i = 1; i <= points; i++) {
    const mass = (i / points) * 1000;
    const delta = phi * phi * mass * mass * 1e-6;
    data.push({ x: mass, y: delta });
  }
  return data;
}

export function generateFreqVsMass(phi: number, points: number = 50): {x: number, y: number}[] {
  const data: {x: number, y: number}[] = [];
  for (let i = 1; i <= points; i++) {
    const mass = (i / points) * 1000;
    const delta = phi * phi * mass * mass * 1e-6;
    data.push({ x: mass, y: -delta });
  }
  return data;
}
