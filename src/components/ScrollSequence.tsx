import React, { useEffect, useRef, useState } from 'react';

interface ScrollSequenceProps {
  progress: number;
}

const ScrollSequence: React.FC<ScrollSequenceProps> = ({ progress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const totalFrames = 294;
  const images = useRef<HTMLImageElement[]>([]);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Preload images in parallel
    const loadImages = () => {
      let loaded = 0;
      images.current = new Array(totalFrames);

      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        const frameNumber = i.toString().padStart(3, '0');
        img.src = `/frames/ezgif-frame-${frameNumber}.jpg`;
        
        const index = i - 1;
        img.onload = () => {
          loaded++;
          setImagesLoaded(loaded);
          images.current[index] = img;
          
          if (loaded === totalFrames) {
            isLoaded.current = true;
          }
          
          // Draw the first frame as soon as it is loaded
          if (index === 0) {
            drawFrame(0);
          }
        };
        img.onerror = () => {
          loaded++;
          setImagesLoaded(loaded);
          // Put a dummy image with width 0 to signify error, preventing undefined reference issues
          images.current[index] = new Image();
        };
      }
    };
    loadImages();
  }, []);

  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find the closest loaded image
    let img = images.current[frameIndex];
    if (!img || img.naturalWidth === 0) {
      // Search backwards
      for (let i = frameIndex - 1; i >= 0; i--) {
        if (images.current[i] && images.current[i].naturalWidth > 0) {
          img = images.current[i];
          break;
        }
      }
    }
    // If still not found, search forwards
    if (!img || img.naturalWidth === 0) {
      for (let i = frameIndex + 1; i < totalFrames; i++) {
        if (images.current[i] && images.current[i].naturalWidth > 0) {
          img = images.current[i];
          break;
        }
      }
    }

    if (!img || img.naturalWidth === 0) return;

    // Handle high DPI displays for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    canvas.width = windowWidth * dpr;
    canvas.height = windowHeight * dpr;
    ctx.scale(dpr, dpr);

    // Calculate scaling to cover the whole canvas (object-fit: cover equivalent)
    const scale = Math.max(windowWidth / img.naturalWidth, windowHeight / img.naturalHeight);
    const x = (windowWidth / 2) - (img.naturalWidth / 2) * scale;
    const y = (windowHeight / 2) - (img.naturalHeight / 2) * scale;

    ctx.clearRect(0, 0, windowWidth, windowHeight);
    ctx.drawImage(img, x, y, img.naturalWidth * scale, img.naturalHeight * scale);
  };

  // Redraw when progress changes
  useEffect(() => {
    if (progress < 0) return;
    const frameIndex = Math.min(
      totalFrames - 1,
      Math.floor(progress * totalFrames)
    );
    drawFrame(frameIndex);
  }, [progress]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const frameIndex = Math.min(totalFrames - 1, Math.floor(progress * totalFrames));
      drawFrame(frameIndex);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [progress]);

  return (
    <div ref={containerRef} className="relative w-full h-full z-0 bg-black overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover mix-blend-screen"
        style={{ width: '100%', height: '100%' }}
      />
      {imagesLoaded < totalFrames && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-50 text-white transition-opacity duration-500">
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden mb-4">
            <div 
              className="h-full bg-white transition-all duration-300 ease-out rounded-full"
              style={{ width: `${(imagesLoaded / totalFrames) * 100}%` }}
            />
          </div>
          <span className="text-xs font-light tracking-[0.3em] uppercase text-white/70">
            Initializing Experience
          </span>
        </div>
      )}
    </div>
  );
};

export default ScrollSequence;
