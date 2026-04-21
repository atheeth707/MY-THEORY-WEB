import { useState, useRef, useCallback, lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import HomeSection from './components/HomeSection';

const TheorySection = lazy(() => import('./components/TheorySection'));
const SimulationLab = lazy(() => import('./components/SimulationLab'));
const ObservationMode = lazy(() => import('./components/ObservationMode'));
const AboutSection = lazy(() => import('./components/AboutSection'));

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback((id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleEnter = useCallback(() => {
    scrollToSection('theory');
  }, [scrollToSection]);

  const Loader = () => (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#000005' }}>
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-mono text-white/30">Loading module...</p>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="bg-black text-white min-h-screen" style={{ scrollBehavior: 'smooth' }}>
      <Navigation activeSection={activeSection} onNavigate={scrollToSection} />
      
      <div id="home">
        <HomeSection onEnter={handleEnter} />
      </div>
      
      <div id="theory">
        <Suspense fallback={<Loader />}>
          <TheorySection />
        </Suspense>
      </div>
      
      <div id="simulation">
        <Suspense fallback={<Loader />}>
          <SimulationLab />
        </Suspense>
      </div>
      
      <div id="observation">
        <Suspense fallback={<Loader />}>
          <ObservationMode />
        </Suspense>
      </div>
      
      <div id="about">
        <Suspense fallback={<Loader />}>
          <AboutSection />
        </Suspense>
      </div>
    </div>
  );
}

export default App;
