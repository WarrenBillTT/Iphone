import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import ScrollSequence from './components/ScrollSequence';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHovering(!!(e.target as HTMLElement).closest('button, a, [class*="cursor-pointer"]'));
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
      setProgress(Math.max(0, Math.min(1, html.scrollTop / scrollHeight)));
    };

    lenis.on('scroll', onScroll);
    onScroll();

    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => { lenis.destroy(); };
  }, []);

  // Easing
  const ease = (t: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

  // Fade in/out opacity + enter/exit values
  const getState = (start: number, end: number, fade = 0.035) => {
    let opacity = 0, enter = 0, exit = 0;
    if (progress < start - fade) {
      /* hidden */
    } else if (progress < start) {
      enter = ease((progress - (start - fade)) / fade);
      opacity = enter;
    } else if (progress <= end) {
      enter = 1; opacity = 1;
    } else if (progress <= end + fade) {
      enter = 1;
      exit = ease((progress - end) / fade);
      opacity = 1 - exit;
    } else {
      enter = 1; exit = 1;
    }
    return { opacity, enter, exit };
  };

  // For STICKY sections: subtle parallax float (small movement)
  const getFloat = (start: number, end: number, px = 30) => {
    if (progress <= start) return px;
    if (progress >= end) return -px;
    return px - ((progress - start) / (end - start)) * px * 2;
  };

  // For SCROLL sections: simulates natural page scrolling inside sticky container
  // Text travels from below viewport → visible → above viewport
  const getScroll = (start: number, end: number, travel = 500) => {
    const mid = (start + end) / 2;
    const half = (end - start) / 2;
    const t = Math.max(-1, Math.min(1, (progress - mid) / half));
    return -t * travel;
  };

  const intro = getState(0,    0.12, 0.03);
  const s1    = getState(0.14, 0.27, 0.035);
  const s2    = getState(0.28, 0.52, 0.035);
  const s3    = getState(0.30, 0.52, 0.035);
  const s4    = getState(0.54, 0.70, 0.035);
  const s5    = getState(0.72, 0.82, 0.035);
  const s6    = getState(0.83, 0.96, 0.035);

  return (
    <div className="relative w-full bg-[#0a0a0a] text-[#f0f0f0] font-body selection:bg-white selection:text-black">

      <div className="noise-overlay fixed inset-0 pointer-events-none z-[60] opacity-[0.03]"></div>
      <CustomCursor />

      <div className="fixed inset-0 pointer-events-none z-0 flex justify-around opacity-[0.04]">
        {[...Array(5)].map((_, i) => <div key={i} className="w-[1px] h-full bg-white"></div>)}
      </div>

      {/* NAV */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl p-4 px-6 flex justify-between items-center z-[100] pointer-events-auto bg-[#0a0a0a]/70 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
        <img src="/apple.svg" alt="Apple Logo" className="h-5 w-auto cursor-pointer hover:opacity-70 transition-opacity" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-light text-[11px] tracking-[0.4em] uppercase hidden md:block text-gray-300">
          IPHONE 11 PRO MAX
        </div>
        <div className="flex gap-2 flex-col cursor-pointer p-2 z-[110]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={`w-6 h-[2px] bg-white transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[5px]' : ''}`}></div>
          <div className={`w-6 h-[2px] bg-white transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}></div>
        </div>
      </nav>

      {/* Menu overlay */}
      <div className={`fixed inset-0 bg-[#050505] z-[90] flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <ul className="flex flex-col gap-12 text-center font-display text-4xl md:text-6xl font-bold uppercase tracking-tighter">
          {['Overview', 'Camera System', 'A13 Bionic', 'Display', 'Tech Specs'].map((item, i) => (
            <li key={item} style={{ transitionDelay: isMenuOpen ? `${i * 80 + 100}ms` : '0ms' }}
              className={`transition-all duration-500 hover:text-white/40 cursor-pointer ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
              onClick={() => setIsMenuOpen(false)}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Side indicators */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-16 z-[100] pointer-events-none mix-blend-difference hidden md:flex">
        <div className="font-heading text-[9px] tracking-[0.3em] font-medium rotate-90 origin-right uppercase whitespace-nowrap text-white/40">TRIPLE 12MP SYSTEM</div>
        <div className="font-heading text-[9px] tracking-[0.3em] font-medium rotate-90 origin-right uppercase whitespace-nowrap mt-28 text-white/40">A13 BIONIC CHIP</div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full p-6 px-8 md:px-12 flex justify-between items-end z-[100] pointer-events-none mix-blend-difference text-white">
        <div className="font-heading text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-white/50 font-medium">SCROLL TO EXPLORE</div>
        <div className="absolute left-1/2 bottom-6 -translate-x-1/2 font-heading text-[10px] tracking-[0.2em] font-medium hidden md:block text-white/60">
          {Math.round(progress * 100)}%
        </div>
        <div className="font-heading text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-right text-white/50 font-medium">PRO MAX EDITION</div>
      </footer>

      {/* ═══ SECTION 1: STICKY iPHONE SEQUENCE ═══ */}
      <div className="relative z-10 h-[1400vh] w-full">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="relative w-full h-full">

            <div className="absolute inset-0 w-full h-full">
              <ScrollSequence progress={progress} />
            </div>

            <div className="absolute inset-0 w-full h-full z-50 pointer-events-none">

              {/* ═══ INTRO (0.00–0.12) ═══  MODE: STICKY — slides in from left, stays */}
              <div
                className="absolute inset-0 flex flex-col justify-center px-6 md:px-16"
                style={{
                  opacity: intro.opacity,
                  transform: `translate3d(${(1 - intro.enter) * -300 - intro.exit * 200}px, 0, 0)`,
                }}
              >
                <div className="font-heading text-xs md:text-sm tracking-[0.3em] uppercase text-white/50 font-medium mb-6 mix-blend-difference">
                  IPHONE 11 PRO MAX
                </div>
                <h1 className="font-display text-7xl md:text-[10rem] font-bold tracking-tighter leading-[0.85] uppercase max-w-5xl mix-blend-difference mb-8 text-white select-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
                  Goes all in. <br/> Or not at all.
                </h1>
                <div className="w-16 h-[2px] bg-gradient-to-r from-white to-transparent mb-6 mix-blend-difference"></div>
                <p className="font-heading text-sm md:text-base font-light text-white/70 max-w-sm tracking-wide leading-relaxed mix-blend-difference">
                  The first iPhone powerful enough to be called Pro.
                  Re-engineered from the inside out.
                </p>
              </div>


              {/* ═══ 01 MATERIAL (0.14–0.27) ═══  MODE: SCROLL — text moves with page like regular website */}
              <div
                className="absolute inset-0 flex flex-col justify-center items-start px-8 md:px-16"
                style={{ opacity: s1.opacity }}
              >
                <div
                  className="mix-blend-difference max-w-[320px] md:max-w-[360px]"
                  style={{ transform: `translateY(${getScroll(0.14, 0.27, 180)}px)` }}
                >
                  <div className="font-heading text-xs md:text-sm tracking-[0.25em] uppercase text-white/50 font-medium mb-3">
                    01 &ensp; ARCHITECTURE
                  </div>
                  {/* Title Style 1: Metallic Stainless Steel Sheen */}
                  <h2 className="font-display uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
                    <span className="block text-5xl md:text-6xl lg:text-7xl font-black text-white">SURGICAL</span>
                    <span className="block text-6xl md:text-7xl lg:text-[7.5rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500">STEEL.</span>
                  </h2>
                  <p className="font-heading text-sm md:text-base font-light text-white/70 leading-relaxed tracking-wide mb-6">
                    Precision-milled from a single sheet of dual-ion exchange glass with a textured matte finish. Seamlessly bonded to a surgical-grade stainless steel band.
                  </p>
                  <div className="flex gap-8 border-t border-white/20 pt-5">
                    <div>
                      <div className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">IP68</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider font-medium mt-1">4M Water Depth</div>
                    </div>
                    <div>
                      <div className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">Matte</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider font-medium mt-1">Dual-Ion Glass</div>
                    </div>
                  </div>
                </div>
              </div>


              {/* ═══ 02 DISPLAY + 03 SILICON (0.28–0.52) ═══  MODE: STICKY — two panels float in place */}
              <div
                className="absolute inset-0 flex flex-col md:flex-row justify-between items-end md:items-center px-8 md:px-14 pb-16 md:pb-0 pt-28 md:pt-0"
                style={{ opacity: Math.max(s2.opacity, s3.opacity) }}
              >
                {/* LEFT: 03 Silicon — STICKY with subtle float UP */}
                <div
                  className="mix-blend-difference flex flex-col max-w-[320px] md:max-w-[380px] mb-10 md:mb-0 md:self-start md:mt-[10vh]"
                  style={{
                    opacity: s3.opacity,
                    transform: `translate3d(${(1 - s3.enter) * -60}px, ${getFloat(0.28, 0.52, 25)}px, 0)`,
                  }}
                >
                  <div className="font-heading text-xs md:text-sm tracking-[0.25em] uppercase text-white/50 font-medium mb-3">
                    03 &ensp; SILICON
                  </div>
                  {/* Title Style 3: Architectural Monolith with Monospace Tech Accent */}
                  <h2 className="font-display uppercase tracking-tighter leading-[0.82] mb-4 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                    <span className="block text-7xl md:text-8xl lg:text-[8.5rem] font-black text-white tracking-tighter">A13</span>
                    <span className="block text-2xl md:text-3xl lg:text-4xl font-mono font-bold tracking-[0.2em] text-neutral-400">BIONIC.</span>
                  </h2>
                  <p className="font-heading text-sm md:text-base font-light text-white/70 leading-relaxed mb-6">
                    The fastest chip ever in a smartphone. Built on 7-nanometer architecture, fusing machine learning with unprecedented power efficiency.
                  </p>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-white/20 pt-5">
                    <div>
                      <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">8.5B</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider font-medium mt-1">Transistors</div>
                    </div>
                    <div>
                      <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">6-Core</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider font-medium mt-1">CPU Compute</div>
                    </div>
                    <div>
                      <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">4-Core</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider font-medium mt-1">Metal GPU</div>
                    </div>
                    <div>
                      <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">40%</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider font-medium mt-1">Lower Power</div>
                    </div>
                  </div>
                </div>

                {/* RIGHT: 02 Display — STICKY with subtle float DOWN */}
                <div
                  className="mix-blend-difference flex flex-col max-w-[320px] md:max-w-[380px] text-right items-end md:self-end md:mb-[10vh]"
                  style={{
                    opacity: s2.opacity,
                    transform: `translate3d(${(1 - s2.enter) * 60}px, ${getFloat(0.28, 0.52, -25)}px, 0)`,
                  }}
                >
                  <div className="font-heading text-xs md:text-sm tracking-[0.25em] uppercase text-white/50 font-medium mb-3">
                    02 &ensp; DISPLAY
                  </div>
                  {/* Title Style 2: Luminous OLED Bloom Headline */}
                  <h2 className="font-display uppercase tracking-tighter leading-[0.88] mb-4 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
                    <span className="block text-3xl md:text-4xl lg:text-5xl font-extrabold text-neutral-300 tracking-tight">SUPER RETINA</span>
                    <span className="block text-6xl md:text-7xl lg:text-[7.5rem] font-black text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.35)]">XDR.</span>
                  </h2>
                  <p className="font-heading text-sm md:text-base font-light text-white/70 leading-relaxed mb-6">
                    A custom OLED engineered for extreme dynamic range. 2,000,000:1 contrast ratio with color precision that dazzles in direct sunlight.
                  </p>
                  <div className="flex gap-8 justify-end border-t border-white/20 pt-5">
                    <div className="text-right">
                      <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">1,200</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider font-medium mt-1">Nits Peak</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">458</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider font-medium mt-1">PPI Density</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">6.5"</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider font-medium mt-1">OLED Panel</div>
                    </div>
                  </div>
                </div>
              </div>


              {/* ═══ 04 CAMERA (0.54–0.70) ═══  MODE: SCROLL — text scrolls up naturally like regular website */}
              <div
                className="absolute inset-0 flex flex-col justify-center px-8 md:px-16"
                style={{ opacity: s4.opacity }}
              >
                <div
                  className="mix-blend-difference max-w-[320px] md:max-w-[360px]"
                  style={{ transform: `translateY(${getScroll(0.54, 0.70, 200)}px)` }}
                >
                  <div className="font-heading text-xs md:text-sm tracking-[0.25em] uppercase text-white/50 font-medium mb-3">
                    04 &ensp; PRO CAMERA SYSTEM
                  </div>
                  {/* Title Style 4: Optical Contrast — Solid Bold meets Feather-Light Depth */}
                  <h2 className="font-display uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
                    <span className="block text-5xl md:text-6xl lg:text-7xl font-black text-white">THREE</span>
                    <span className="block text-5xl md:text-6xl lg:text-7xl font-light tracking-wider text-white/65">LENSES.</span>
                  </h2>
                  <p className="font-heading text-sm md:text-base font-light text-white/70 leading-relaxed mb-6">
                    The first triple-camera system to combine pro versatility with effortless simplicity. Shoot 4K video at 60 fps across every camera.
                  </p>
                  {/* Clean Apple-style Lens Breakdown */}
                  <div className="flex flex-col border-t border-white/20 divide-y divide-white/10">
                    <div className="py-3 flex justify-between items-baseline">
                      <div>
                        <div className="font-display text-base md:text-lg font-bold text-white uppercase tracking-tight">13mm Ultra Wide</div>
                        <div className="text-xs text-white/50 mt-0.5">120° Field of View • ƒ2.4</div>
                      </div>
                      <div className="font-display text-sm font-semibold text-white/70">12MP</div>
                    </div>
                    <div className="py-3 flex justify-between items-baseline">
                      <div>
                        <div className="font-display text-base md:text-lg font-bold text-white uppercase tracking-tight">26mm Wide</div>
                        <div className="text-xs text-white/50 mt-0.5">100% Focus Pixels • ƒ1.8 • OIS</div>
                      </div>
                      <div className="font-display text-sm font-semibold text-white/70">12MP</div>
                    </div>
                    <div className="py-3 flex justify-between items-baseline">
                      <div>
                        <div className="font-display text-base md:text-lg font-bold text-white uppercase tracking-tight">52mm Telephoto</div>
                        <div className="text-xs text-white/50 mt-0.5">2x Optical Zoom • ƒ2.0 • OIS</div>
                      </div>
                      <div className="font-display text-sm font-semibold text-white/70">12MP</div>
                    </div>
                  </div>
                </div>
              </div>


              {/* ═══ 05 OPTICS (0.72–0.82) ═══  MODE: STICKY — fades in on right side, stays */}
              <div
                className="absolute inset-0 flex flex-col justify-center items-end px-8 md:px-16"
                style={{
                  opacity: s5.opacity,
                  transform: `translateY(${getFloat(0.72, 0.82, -20)}px)`,
                }}
              >
                <div className="mix-blend-difference flex flex-col max-w-[320px] md:max-w-[360px] text-right items-end relative">
                  {/* Huge dynamic watermark */}
                  <div className="font-display font-black text-white/[0.05] text-[9rem] md:text-[15rem] leading-none tracking-tighter absolute -right-6 top-1/2 -translate-y-1/2 select-none pointer-events-none hidden md:block">
                    4X
                  </div>
                  <div className="font-heading text-xs md:text-sm tracking-[0.25em] uppercase text-white/50 font-medium mb-3">
                    05 &ensp; OPTICS
                  </div>
                  {/* Title Style 5: Kinetic Zoom Multiplier */}
                  <h2 className="font-display uppercase tracking-tighter leading-[0.85] mb-6 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
                    <span className="block text-7xl md:text-8xl lg:text-[8.5rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">4X</span>
                    <span className="block text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-neutral-300">OPTICAL ZOOM.</span>
                  </h2>
                  <p className="font-heading text-sm md:text-base font-light text-white/70 leading-relaxed mb-6">
                    From 13mm Ultra Wide to 52mm Telephoto. Seamlessly transition across a continuous 4x optical zoom range with zero quality compromise.
                  </p>
                  {/* Clean Apple-style Zoom Callouts */}
                  <div className="flex gap-8 justify-end border-t border-white/20 pt-5">
                    <div className="text-right">
                      <div className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">0.5x</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider font-medium mt-1">Ultra Wide</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">1x</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider font-medium mt-1">Wide</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">2x</div>
                      <div className="text-xs text-white/50 uppercase tracking-wider font-medium mt-1">Telephoto</div>
                    </div>
                  </div>
                </div>
              </div>


              {/* ═══ 06 BATTERY (0.83–0.96) ═══  MODE: SCROLL — Elevated vertical position & smooth glide */}
              <div
                className="absolute inset-0 flex flex-col justify-start pt-14 md:pt-16 items-start px-8 md:px-16"
                style={{ opacity: s6.opacity }}
              >
                <div
                  className="mix-blend-difference max-w-[320px] md:max-w-[360px]"
                  style={{ transform: `translateY(${getScroll(0.83, 0.96, 40)}px)` }}
                >
                  <div className="font-heading text-xs md:text-sm tracking-[0.25em] uppercase text-white/50 font-medium mb-2">
                    06 &ensp; ENDURANCE
                  </div>
                  {/* Title Style 6: Radiant Energy Gradient Headline */}
                  <h2 className="font-display uppercase tracking-tighter leading-[0.88] mb-4 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
                    <span className="block text-5xl md:text-6xl lg:text-[4.8rem] font-black text-white">ALL-DAY</span>
                    <span className="block text-5xl md:text-6xl lg:text-[4.8rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-white to-neutral-300">POWER.</span>
                  </h2>

                  {/* Clean Apple Keynote-style Headline Stat */}
                  <div className="mb-4">
                    <div className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter leading-none">
                      +5 Hours.
                    </div>
                    <div className="font-heading text-xs md:text-sm font-light text-white/80 mt-1">
                      More battery life than iPhone XS Max.
                    </div>
                  </div>

                  <p className="font-heading text-xs md:text-sm font-light text-white/70 leading-relaxed tracking-wide mb-4">
                    Fast-charge up to 50% in 30 minutes with the 18W adapter in the box. Wi-Fi 6 and Apple U1 Ultra Wideband chip built-in.
                  </p>

                  <div className="flex gap-6 border-t border-white/20 pt-3">
                    <div>
                      <div className="font-display text-xl md:text-2xl font-bold text-white tracking-tight">20h</div>
                      <div className="text-[9px] md:text-[10px] text-white/50 uppercase tracking-widest font-medium mt-0.5">Video Playback</div>
                    </div>
                    <div>
                      <div className="font-display text-xl md:text-2xl font-bold text-white tracking-tight">18W</div>
                      <div className="text-[9px] md:text-[10px] text-white/50 uppercase tracking-widest font-medium mt-0.5">Fast Charging</div>
                    </div>
                    <div>
                      <div className="font-display text-xl md:text-2xl font-bold text-white tracking-tight">U1</div>
                      <div className="text-[9px] md:text-[10px] text-white/50 uppercase tracking-widest font-medium mt-0.5">Ultra Wideband</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ═══ SECTION 2: STATIC BLOCKS ═══ */}
      <div className="w-full bg-[#050505] relative z-20 flex flex-col items-center border-t border-white/10 overflow-hidden">

        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-[-10%] w-[70vw] h-[70vw] rounded-full bg-blue-500/5 blur-[150px] animate-pulse" style={{ animationDuration: '10s' }}></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-500/5 blur-[150px] animate-pulse" style={{ animationDuration: '14s', animationDelay: '3s' }}></div>
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#050505_100%)]"></div>
        </div>

        <div className="w-full flex flex-col items-center text-center py-48 px-6 md:px-16 relative z-10">
          <h2 className="font-display text-5xl md:text-7xl leading-[0.9] font-bold tracking-tighter uppercase mb-6 text-white">
            NOT JUST<br/>A PHONE.
          </h2>
          <p className="font-heading text-xs md:text-sm font-light text-white/50 max-w-2xl leading-loose tracking-wider">
            A transformative triple-camera system that adds capability without complexity. An unprecedented leap in battery life. A chip that doubles down on machine learning and redefines what a smartphone can do.
          </p>
        </div>

        <div className="w-full min-h-screen flex flex-col items-center justify-center pb-24 px-6 md:px-16 relative z-10">
          <h1 className="font-display text-[5rem] md:text-[13rem] font-bold tracking-tighter leading-none uppercase mb-16 text-white drop-shadow-[0_0_50px_rgba(255,255,255,0.1)] mix-blend-screen text-center">
            BEYOND.
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto">
            <button className="bg-white text-black px-8 py-3.5 rounded-full font-heading font-semibold text-xs md:text-sm tracking-wider shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 ease-out cursor-pointer">
              Order iPhone 11 Pro Max
            </button>
            <button className="bg-transparent border border-white/30 text-white px-8 py-3.5 rounded-full font-heading font-medium text-xs md:text-sm tracking-wider hover:bg-white hover:text-black hover:border-white transition-all duration-300 ease-out cursor-pointer">
              View All Specifications
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
