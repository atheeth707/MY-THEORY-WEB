// Web Audio API engine for immersive sound

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let bassOsc: OscillatorNode | null = null;
let bassGain: GainNode | null = null;
let isInitialized = false;

export function initAudio() {
  if (isInitialized) return;
  try {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(audioCtx.destination);
    isInitialized = true;
  } catch (e) {
    console.warn('Audio not available');
  }
}

export function playDeepBass(frequency: number = 40, duration: number = 2) {
  if (!audioCtx || !masterGain) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function playRisingTone(startFreq: number = 80, endFreq: number = 400, duration: number = 1.5) {
  if (!audioCtx || !masterGain) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function playBurst() {
  if (!audioCtx || !masterGain) return;
  // White noise burst
  const bufferSize = audioCtx.sampleRate * 0.5;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
  }
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
  source.connect(gain);
  gain.connect(masterGain);
  source.start();
  
  // Sub bass hit
  playDeepBass(25, 1);
}

export function startAmbientDrone(mass: number) {
  if (!audioCtx || !masterGain) return;
  if (bassOsc) {
    bassOsc.frequency.value = 20 + (mass / 1000) * 30;
    return;
  }
  bassOsc = audioCtx.createOscillator();
  bassGain = audioCtx.createGain();
  bassOsc.type = 'sine';
  bassOsc.frequency.value = 20 + (mass / 1000) * 30;
  bassGain.gain.value = 0.04;
  bassOsc.connect(bassGain);
  bassGain.connect(masterGain);
  bassOsc.start();
}

export function stopAmbientDrone() {
  if (bassOsc) {
    bassOsc.stop();
    bassOsc = null;
    bassGain = null;
  }
}

export function resumeAudio() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}
