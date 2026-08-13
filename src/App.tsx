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
        <img src="/apple.svg" alt="Apple Logo" className="h-5 w-auto cursor-pointer hover:opacity-70 transition-opacity" />
        
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
                className="absolute inset-0 flex flex-col justify-end items-start px-6 md:px-16 pb-20 md:pb-32"
                style={{ 
                  opacity: getOpacity(0.14, 0.26, 0.02),
                  transform: getTransform(0.14, 0.26, 0.02, 'y', -30)
                }}
              >
                <div className="w-full md:w-[40%] mix-blend-difference border-t border-white/20 pt-6">
                  <div className="font-mono text-[10px] tracking-widest uppercase text-gray-400 mb-4 md:mb-6">01 — Material</div>
                  <h2 className="font-display text-5xl md:text-[5.5rem] font-bold tracking-tighter leading-none uppercase text-white mb-4 md:mb-6">
                    Forged <br/> <span className="text-gray-500">Titanium.</span>
                  </h2>
                  <p className="font-sans text-xs md:text-sm font-light text-gray-300 leading-relaxed tracking-wider">
                    Aerospace-grade titanium chassis. Structural integrity that defies its weight class, meticulously brushed and contoured.
                  </p>
                </div>
              </div>

              {/* Display & Performance Together (0.28 - 0.52) */}
              <div 
                className="absolute inset-0 flex flex-col md:flex-row justify-between items-start md:items-center px-6 md:px-12 pt-28 pb-20 md:py-0"
                style={{ 
                  opacity: getOpacity(0.28, 0.52, 0.02)
                }}
              >
                {/* Left: Display */}
                <div className="w-[80%] md:w-[35%] mix-blend-difference md:translate-y-[-20%] flex gap-4 md:gap-8 items-start mb-auto md:mb-0">
                  <div className="font-mono text-xl md:text-2xl tracking-[0.5em] uppercase text-gray-500 rotate-180 flex-shrink-0 hidden md:block" style={{ writingMode: 'vertical-rl' }}>
                    02 — Display
                  </div>
                  <div className="flex flex-col">
                    <div className="font-mono text-[10px] tracking-widest uppercase text-gray-500 mb-2 md:hidden">02 — Display</div>
                    <h2 className="font-display text-[3.5rem] md:text-[4.5rem] font-bold tracking-tighter leading-[0.8] uppercase text-white mb-3 md:mb-6">
                      Brilliant<br/><span className="italic font-light text-gray-400">Fluidity.</span>
                    </h2>
                    <p className="font-sans text-xs md:text-sm font-light text-gray-300 leading-relaxed mb-4">
                      Super Retina XDR at 120Hz. Light and color matching the cadence of your thoughts.
                    </p>
                  </div>
                </div>

                {/* Right: Performance */}
                <div className="w-[85%] md:w-[32%] mix-blend-difference text-left md:text-right md:translate-y-[25%] flex flex-col items-start md:items-end self-end">
                  <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-3 md:mb-6 border-b border-white/30 pb-2 md:pb-4 w-full">03 — Performance Architecture</div>
                  <h2 className="font-display text-[3.5rem] md:text-[5.5rem] font-black tracking-tighter leading-[0.85] uppercase text-white mb-3 md:mb-6">
                    Defies<br/>Logic.
                  </h2>
                  <div className="flex justify-start md:justify-end gap-3 w-full">
                    <div className="border border-white/20 p-2 md:p-4 w-1/2 text-center bg-white/5 backdrop-blur-sm">
                      <div className="font-display text-xl md:text-3xl font-bold text-white mb-1">6-Core</div>
                      <div className="text-[8px] md:text-[10px] text-gray-400 uppercase tracking-widest">GPU Design</div>
                    </div>
                    <div className="border border-white/20 p-2 md:p-4 w-1/2 text-center bg-white/5 backdrop-blur-sm">
                      <div className="font-display text-xl md:text-3xl font-bold text-white mb-1">4x Faster</div>
                      <div className="text-[8px] md:text-[10px] text-gray-400 uppercase tracking-widest">Ray Tracing</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sensor & Specs (0.55 - 0.70) */}
              <div 
                className="absolute inset-0 flex flex-col justify-center px-6 md:px-12"
                style={{ 
                  opacity: getOpacity(0.55, 0.70, 0.02)
                }}
              >
                <div className="w-full h-full mix-blend-difference flex flex-col md:flex-row justify-between items-start md:items-center relative pt-28 pb-20 md:py-0">
                  {/* Left: Sensor description */}
                  <div className="w-full md:w-[35%] flex flex-col mb-auto md:mb-0">
                    <div className="font-mono text-[10px] tracking-widest uppercase text-gray-500 mb-2 border-l-[3px] border-white pl-4">04 — Sensor</div>
                    <h2 className="font-display text-[4rem] md:text-[7rem] font-bold tracking-tighter leading-[0.85] uppercase text-white mb-3 md:mb-8">
                      Capture<br/><span className="text-gray-500 text-3xl md:text-5xl italic font-light">Reality.</span>
                    </h2>
                    <p className="font-sans text-xs md:text-sm font-light text-gray-300 leading-relaxed mb-4 md:mb-6 max-w-[80%] md:max-w-full">
                      An advanced 48-megapixel sensor drinks in photons with unprecedented greed, freezing microscopic details and fleeting emotions.
                    </p>
                  </div>

                  {/* Right: Specification Grid (Small, Far Right) */}
                  <div className="relative md:absolute md:right-4 w-full md:w-[28%] border-t border-white/20 pt-4 md:pt-6 md:transform md:translate-y-16 mt-auto md:mt-0">
                    <div className="font-mono text-[9px] tracking-[0.2em] text-gray-500 mb-4 md:mb-6 uppercase flex justify-between items-center">
                      <span>Specifications</span>
                      <span className="h-[1px] bg-gray-500 flex-1 mx-4 hidden md:block"></span>
                      <span>/ 04</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 md:gap-y-6 gap-x-4">
                      <div>
                        <div className="font-sans text-[8px] md:text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Main Sensor</div>
                        <div className="font-sans text-[10px] md:text-[11px] font-bold text-white uppercase">48 Megapixels</div>
                      </div>
                      <div>
                        <div className="font-sans text-[8px] md:text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Aperture</div>
                        <div className="font-sans text-[10px] md:text-[11px] font-bold text-white uppercase">f/1.78</div>
                      </div>
                      <div>
                        <div className="font-sans text-[8px] md:text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Pixel Size</div>
                        <div className="font-sans text-[10px] md:text-[11px] font-bold text-white uppercase">1.22µm Quad</div>
                      </div>
                      <div>
                        <div className="font-sans text-[8px] md:text-[9px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Stabilization</div>
                        <div className="font-sans text-[10px] md:text-[11px] font-bold text-white uppercase">Sensor-Shift</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optics (0.73 - 0.83) */}
              <div 
                className="absolute inset-0 flex flex-col justify-end md:justify-center items-start md:items-end px-6 md:px-12 pb-20 md:pb-0 overflow-hidden"
                style={{ 
                  opacity: getOpacity(0.73, 0.83, 0.02)
                }}
              >
                <div className="w-[90%] md:w-[35%] mix-blend-difference text-left md:text-right flex flex-col items-start md:items-end relative md:mr-12">
                  <div className="font-display font-black text-white/5 text-[8rem] md:text-[14rem] leading-[0.7] tracking-tighter absolute right-0 md:right-[-5%] top-1/2 -translate-y-1/2 -z-10 select-none pointer-events-none hidden md:block">
                    5X
                  </div>
                  
                  <div className="w-full border-b-[2px] border-white/20 pb-2 md:pb-3 mb-3 md:mb-6 flex justify-between items-end">
                    <h2 className="font-display text-[3.5rem] md:text-[5rem] font-bold tracking-tighter leading-[0.85] uppercase text-white m-0 text-left">
                      Go<br/>Further.
                    </h2>
                    <div className="font-mono text-[9px] tracking-widest uppercase text-gray-400 rotate-0 md:rotate-90 origin-bottom-right md:translate-y-[10px] mb-2 md:mb-0">05 — Optics</div>
                  </div>
                  
                  <div className="w-full flex flex-col md:flex-row gap-4 md:gap-6">
                    <div className="flex-1 text-left md:text-right">
                      <p className="font-sans text-[10px] md:text-xs font-light text-gray-300 leading-relaxed mb-3">
                        Space is no longer a barrier. A revolutionary tetraprism lens folds light upon itself four times over, delivering a flawless 5x optical zoom without the traditional bulk. 
                      </p>
                    </div>
                    <div className="w-[60%] md:w-[3px] bg-white h-[2px] md:h-auto rounded-full mt-2 md:mt-0"></div>
                  </div>
                </div>
              </div>

              {/* Connectivity (0.86 - 1.0) */}
              <div 
                className="absolute inset-0 flex flex-col justify-end md:justify-center items-start px-6 md:px-16 pb-20 md:pb-0"
                style={{ 
                  opacity: getOpacity(0.86, 1.0, 0.02)
                }}
              >
                <div className="w-[85%] md:w-[40%] mix-blend-difference border-l-[2px] md:border-l-[1px] border-white/30 pl-6 md:pl-8">
                  <div className="flex items-center gap-4 mb-3 md:mb-4">
                    <div className="font-mono text-[10px] tracking-[0.2em] text-gray-400 uppercase">06 / Connectivity</div>
                  </div>
                  <h2 className="font-display text-[3.2rem] md:text-[5.5rem] font-black tracking-tighter leading-[0.85] uppercase mb-4 md:mb-8 text-white">
                    UNIVERSAL<br/>STANDARD.
                  </h2>
                  <p className="font-sans text-[11px] md:text-sm font-light text-gray-300 leading-[1.8] md:leading-[2] tracking-wide">
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
      <div className="w-full bg-[#050505] relative z-20 flex flex-col items-center border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,1)] overflow-hidden">
        
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
          {/* Subtle slow pulsing glows */}
          <div className="absolute top-0 left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-500/5 blur-[150px] animate-pulse" style={{ animationDuration: '10s' }}></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-500/5 blur-[150px] animate-pulse" style={{ animationDuration: '14s', animationDelay: '3s' }}></div>
          <div className="absolute top-[40%] right-[30%] w-[40vw] h-[40vw] rounded-full bg-white/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
          
          {/* Premium Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px', backgroundPosition: 'center center' }}></div>
          
          {/* Vignette to fade edges to black */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#050505_100%)]"></div>
        </div>

        {/* Block A */}
        <div className="w-full flex flex-col items-center text-center py-48 px-6 md:px-16 relative z-10">
           <h2 className="font-display text-5xl md:text-7xl leading-[0.9] font-bold tracking-tighter uppercase mb-6 text-white drop-shadow-2xl">
             NOT JUST<br/>A PHONE.
           </h2>
           <p className="font-sans text-xs md:text-sm font-light text-gray-400 max-w-2xl leading-loose tracking-wider">
             We completely re-engineered the logic board, battery chemistry, and thermal architecture to sustain peak performance longer than ever before. 
           </p>
        </div>

        {/* Block B (Finale CTA) */}
        <div className="w-full min-h-screen flex flex-col items-center justify-center pb-24 px-6 md:px-16 relative z-10">
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
