import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import ScrollSequence from './components/ScrollSequence';

// Custom Cursor Component
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [class*="cursor-pointer"]')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-difference hidden md:block"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
    >
      <div className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white transition-all duration-300 ease-out ${isHovering ? 'w-16 h-16 bg-white/20' : 'w-8 h-8'}`} />
      <div className={`absolute -translate-x-1/2 -translate-y-1/2 bg-white rounded-full transition-all duration-300 ${isHovering ? 'w-1 h-1 opacity-0' : 'w-2 h-2 opacity-100'}`} />
    </div>
  );
};

function App() {
  const [progress, setProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    const onScroll = () => {
      const html = document.documentElement;
      const scrollHeight = html.scrollHeight - window.innerHeight;
      const currentProgress = Math.max(0, Math.min(1, html.scrollTop / scrollHeight));
      setProgress(currentProgress);
    };

    lenis.on('scroll', onScroll);
    onScroll();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Opacity helper
  const getOpacity = (start: number, end: number, fadeLen: number = 0.04) => {
    if (progress < start - fadeLen) return 0;
    if (progress >= start - fadeLen && progress < start) {
      return (progress - (start - fadeLen)) / fadeLen;
    }
    if (progress >= start && progress <= end) return 1;
    if (progress > end && progress <= end + fadeLen) {
      return 1 - ((progress - end) / fadeLen);
    }
    return 0;
  };

  // Kinetic Transform helper
  const getTransform = (start: number, end: number, fadeLen: number = 0.04, direction: 'y' | 'x-left' | 'x-right' = 'y', offset = 100) => {
    let p = 0;
    if (progress < start - fadeLen) {
      p = 1;
    } else if (progress >= start - fadeLen && progress < start) {
      p = 1 - (progress - (start - fadeLen)) / fadeLen;
    } else if (progress >= start && progress <= end) {
      p = 0;
    } else if (progress > end && progress <= end + fadeLen) {
      p = -(progress - end) / fadeLen; // Negative for continuous motion
    } else {
      p = -1;
    }

    if (direction === 'y') return `translateY(${p * offset}px)`;
    if (direction === 'x-left') return `translateX(${p * -offset}px)`; // Slide in from left, out to right
    if (direction === 'x-right') return `translateX(${p * offset}px)`; // Slide in from right, out to left
    return `translateY(${p * offset}px)`;
  };

  return (
    <div className="relative w-full bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black">
      
      {/* Visual Additions */}
      <CustomCursor />
      
      {/* Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-around opacity-[0.03]">
        <div className="w-[1px] h-full bg-white"></div>
        <div className="w-[1px] h-full bg-white hidden md:block"></div>
        <div className="w-[1px] h-full bg-white hidden md:block"></div>
        <div className="w-[1px] h-full bg-white hidden lg:block"></div>
        <div className="w-[1px] h-full bg-white hidden lg:block"></div>
        <div className="w-[1px] h-full bg-white"></div>
      </div>
      <div className="fixed inset-0 pointer-events-none z-0 flex flex-col justify-around opacity-[0.03]">
        <div className="w-full h-[1px] bg-white"></div>
        <div className="w-full h-[1px] bg-white hidden md:block"></div>
        <div className="w-full h-[1px] bg-white hidden md:block"></div>
        <div className="w-full h-[1px] bg-white hidden lg:block"></div>
        <div className="w-full h-[1px] bg-white hidden lg:block"></div>
        <div className="w-full h-[1px] bg-white"></div>
      </div>

      {/* --- UI FRAME (Always Fixed) --- */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl p-4 px-6 flex justify-between items-center z-[100] pointer-events-auto bg-[#0a0a0a]/70 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
        <div className="font-display font-bold text-xl tracking-tighter cursor-pointer uppercase hover:opacity-70 transition-opacity">Beyond.</div>
        
        {/* Improved Font for Center Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-light text-[11px] tracking-[0.4em] uppercase hidden md:block text-gray-300">
          THE NEW STANDARD
        </div>

        <div 
          className="flex gap-2 flex-col cursor-pointer p-2 z-[110]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={`w-6 h-[2px] bg-white transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></div>
          <div className={`w-6 h-[2px] bg-white transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></div>
        </div>
      </nav>

      {/* Fullscreen Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#050505] z-[90] flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <ul className="flex flex-col gap-12 text-center font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter">
          {['Models', 'Specifications', 'Gallery', 'Buy'].map((item, i) => (
            <li 
              key={item} 
              style={{ transitionDelay: isMenuOpen ? `${i * 100 + 100}ms` : '0ms' }} 
              className={`transition-all duration-500 hover:text-gray-400 cursor-pointer ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex-col gap-12 z-[100] pointer-events-none mix-blend-difference hidden md:flex">
        <div className="font-mono text-[10px] tracking-[0.3em] rotate-90 origin-right uppercase whitespace-nowrap">
          [ 48MP SYSTEM ]
        </div>
        <div className="font-mono text-[10px] tracking-[0.3em] rotate-90 origin-right uppercase whitespace-nowrap mt-24">
          ( A17 PRO )
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 w-full p-6 flex justify-between items-end z-[100] pointer-events-none mix-blend-difference text-white">
        <div className="font-mono text-xs tracking-widest uppercase text-gray-400">
          [ SCROLL TO EXPLORE ]
        </div>
        <div className="absolute left-1/2 bottom-6 -translate-x-1/2 font-mono text-xs tracking-widest hidden md:block">
          {Math.round(progress * 100)}%
        </div>
        <div className="font-mono text-xs tracking-widest uppercase text-right text-gray-400">
          AVAILABLE <br/> 2026
        </div>
      </footer>
      {/* --- END UI FRAME --- */}

      {/* 
        ========================================================
        SECTION 1: THE STICKY iPHONE SEQUENCE
        ========================================================
      */}
      <div className="relative z-10 h-[1400vh] w-full">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* CRITICAL FIX: relative wrapper so absolute children size correctly */}
          <div className="relative w-full h-full">
            
            <div className="absolute inset-0 w-full h-full">
              {/* iPhone animation from beginning to end */}
              <ScrollSequence progress={progress} />
            </div>

            {/* Kinetic Typography Overlays */}
            <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">
              
              {/* Intro (0.00 - 0.12) */}
              <div 
                className="absolute inset-0 flex flex-col justify-center px-6 md:px-16"
                style={{ 
                  opacity: getOpacity(0, 0.12),
                  transform: getTransform(0, 0.12, 0.04, 'x-left', 300)
                }}
              >
                <div className="font-mono text-sm tracking-[0.3em] uppercase mb-4 text-gray-400 mix-blend-difference">
                  [ INTRODUCTION ]
                </div>
                <h1 className="font-display text-7xl md:text-[10rem] font-bold tracking-tighter leading-[0.85] uppercase max-w-6xl mix-blend-difference mb-8 text-white">
                  Goes all in. <br/> Or not at all.
                </h1>
              </div>

              {/* Material (0.14 - 0.26) */}
              <div 
                className="absolute inset-0 flex flex-col justify-center items-end text-left px-6 md:px-24"
                style={{ 
                  opacity: getOpacity(0.14, 0.26),
                  transform: getTransform(0.14, 0.26, 0.04, 'x-right', 300)
                }}
              >
                <div className="w-full md:w-[45%] lg:w-[35%] mix-blend-difference border-l border-white/20 pl-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-6 h-[1px] bg-gray-500"></div>
                    <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500">
                      01 / MATERIAL
                    </div>
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter leading-[0.9] uppercase mb-6 text-white">
                    Forged <br/> Titanium.
                  </h2>
                  <p className="font-sans text-xs md:text-sm font-light text-gray-400 leading-loose tracking-wider">
                    Born in the crucible of extreme pressure, the aerospace-grade titanium chassis offers a structural integrity that defies its weight class. It's the same alloy used in missions to Mars, meticulously brushed and contoured to sit seamlessly in the palm of your hand.
                  </p>
                </div>
              </div>

              {/* Display (0.28 - 0.40) */}
              <div 
                className="absolute inset-0 flex flex-col justify-center px-6 md:px-24"
                style={{ 
                  opacity: getOpacity(0.28, 0.40),
                  transform: getTransform(0.28, 0.40, 0.04, 'x-left', 300)
                }}
              >
                <div className="w-full md:w-[45%] lg:w-[35%] mix-blend-difference border-l border-white/20 pl-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-6 h-[1px] bg-gray-500"></div>
                    <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500">
                      02 / DISPLAY
                    </div>
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter leading-[0.9] uppercase mb-6 text-white">
                    Brilliant <br/> Fluidity.
                  </h2>
                  <p className="font-sans text-xs md:text-sm font-light text-gray-400 leading-loose tracking-wider">
                    Your window into infinite possibilities. The Super Retina XDR display dances at a flawless 120Hz, bending light and color to match the cadence of your thoughts. It's not just a screen; it's an expansive canvas where every pixel breathes with breathtaking luminescence.
                  </p>
                </div>
              </div>

              {/* Performance (0.42 - 0.54) */}
              <div 
                className="absolute inset-0 flex flex-col justify-center items-end text-left px-6 md:px-24"
                style={{ 
                  opacity: getOpacity(0.42, 0.54),
                  transform: getTransform(0.42, 0.54, 0.04, 'x-right', 300)
                }}
              >
                <div className="w-full md:w-[45%] lg:w-[35%] mix-blend-difference border-l border-white/20 pl-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-6 h-[1px] bg-gray-500"></div>
                    <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500">
                      03 / PERFORMANCE
                    </div>
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter leading-[0.9] uppercase mb-6 text-white">
                    Defies <br/> Logic.
                  </h2>
                  <p className="font-sans text-xs md:text-sm font-light text-gray-400 leading-loose tracking-wider">
                    The heartbeat of a supercomputer, miniaturized. The A17 Pro chip orchestrates billions of operations in a fraction of a millisecond. With hardware-accelerated ray tracing, light and shadow play out in real-time, bringing console-tier immersion into the wild.
                  </p>
                </div>
              </div>

              {/* Sensor (0.56 - 0.68) */}
              <div 
                className="absolute inset-0 flex flex-col justify-center px-6 md:px-24"
                style={{ 
                  opacity: getOpacity(0.56, 0.68),
                  transform: getTransform(0.56, 0.68, 0.04, 'x-left', 300)
                }}
              >
                <div className="w-full md:w-[45%] lg:w-[35%] mix-blend-difference border-l border-white/20 pl-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-6 h-[1px] bg-gray-500"></div>
                    <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500">
                      04 / SENSOR
                    </div>
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter leading-[0.9] uppercase mb-6 text-white">
                    Capture <br/> Reality.
                  </h2>
                  <p className="font-sans text-xs md:text-sm font-light text-gray-400 leading-loose tracking-wider">
                    Time is fleeting, but light is eternal. An advanced 48-megapixel sensor drinks in photons with unprecedented greed, freezing microscopic details and fleeting emotions. It captures the world not just as it is, but as you remember it, raw, vivid, and unforgivingly real.
                  </p>
                </div>
              </div>

              {/* Optics (0.70 - 0.82) */}
              <div 
                className="absolute inset-0 flex flex-col justify-center items-end text-left px-6 md:px-24"
                style={{ 
                  opacity: getOpacity(0.70, 0.82),
                  transform: getTransform(0.70, 0.82, 0.04, 'x-right', 300)
                }}
              >
                <div className="w-full md:w-[45%] lg:w-[35%] mix-blend-difference border-l border-white/20 pl-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-6 h-[1px] bg-gray-500"></div>
                    <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500">
                      05 / OPTICS
                    </div>
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter leading-[0.9] uppercase mb-6 text-white">
                    Go <br/> Further.
                  </h2>
                  <p className="font-sans text-xs md:text-sm font-light text-gray-400 leading-loose tracking-wider">
                    Space is no longer a barrier. A revolutionary tetraprism lens folds light upon itself, delivering a flawless 5x optical zoom without the bulk. Stand back, and yet, stand closer. It's a masterclass in optical engineering that brings the horizon to your fingertips.
                  </p>
                </div>
              </div>

              {/* Connectivity (0.84 - 1.0) */}
              <div 
                className="absolute inset-0 flex flex-col justify-center px-6 md:px-24"
                style={{ 
                  opacity: getOpacity(0.84, 1.0),
                  transform: getTransform(0.84, 1.0, 0.04, 'x-left', 300)
                }}
              >
                <div className="w-full md:w-[45%] lg:w-[35%] mix-blend-difference border-l border-white/20 pl-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-6 h-[1px] bg-gray-500"></div>
                    <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500">
                      06 / CONNECTIVITY
                    </div>
                  </div>
                  <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tighter leading-[0.9] uppercase mb-6 text-white">
                    Universal <br/> Standard.
                  </h2>
                  <p className="font-sans text-xs md:text-sm font-light text-gray-400 leading-loose tracking-wider">
                    The era of waiting is over. Embrace the sheer velocity of USB-C and Wi-Fi 6E. Whether you are transferring gigabytes of ProRes cinematic footage or streaming uncompressed high-fidelity audio, the pipeline is wider, faster, and utterly uncompromising.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 
        ========================================================
        SECTION 2: SOLID CONTENT BLOCKS (NO iPHONE)
        ========================================================
      */}
      <div className="w-full bg-[#050505] relative z-20 flex flex-col items-center border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,1)]">
        
        {/* Block A */}
        <div className="w-full flex flex-col items-center text-center py-48 px-6 md:px-16">
           <h2 className="font-display text-5xl md:text-7xl leading-[0.9] font-bold tracking-tighter uppercase mb-6 text-white">
             NOT JUST<br/>A PHONE.
           </h2>
           <p className="font-sans text-xs md:text-sm font-light text-gray-400 max-w-2xl leading-loose tracking-wider">
             We completely re-engineered the logic board, battery chemistry, and thermal architecture to sustain peak performance longer than ever before. 
           </p>
        </div>

        {/* Block B (Finale CTA) */}
        <div className="w-full min-h-screen flex flex-col items-center justify-center pb-24 px-6 md:px-16">
           <h1 className="font-display text-[5rem] md:text-[13rem] font-bold tracking-tighter leading-none uppercase mb-16 text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.1)] mix-blend-screen text-center">
             BEYOND.
           </h1>
           <div className="flex flex-col md:flex-row gap-6 justify-center font-mono uppercase text-sm tracking-widest pointer-events-auto">
              <button className="px-12 py-6 bg-white text-black hover:bg-gray-200 transition-colors cursor-pointer rounded-none border border-white font-bold">
                Order Now
              </button>
              <button className="px-12 py-6 bg-transparent border border-white text-white hover:bg-white hover:text-black transition-colors cursor-pointer rounded-none">
                Discover More
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}

export default App;
