# Beyond. Apple-Style Scroll Product Page

A cinematic, scroll-driven product landing page inspired by Apple's iPhone marketing pages. Built with **React**, **TypeScript**, and canvas-based frame-by-frame scrubbing to simulate a smooth 3D product animation entirely through scroll.

🔗 **Live Demo:** Coming soon

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38BDF8?logo=tailwindcss&logoColor=white)

---

## About the Project

**Beyond.** recreates the signature Apple product-reveal experience, where scrolling drives a video-like animation instead of triggering a video player. As the user scrolls through a **1400vh** sticky section, a canvas renders a sequence of **294 image frames** to simulate the phone rotating and transforming, perfectly synced with scroll progress.

Key features:
- **Scroll-Driven Frame Sequence**: 294 pre-rendered frames are preloaded and drawn onto an HTML5 canvas, scrubbed frame-by-frame based on scroll position (`ScrollSequence.tsx`)
- **Buttery Smooth Scrolling**: powered by [Lenis](https://github.com/darkroomengineering/lenis) for inertia-based smooth scroll
- **Kinetic Typography**: section copy (Material, Display, Performance, Sensor, Optics, Connectivity) fades and slides in/out in sync with scroll progress via custom opacity/transform helpers
- **Custom Cursor**: a blend-mode cursor that expands on hover over interactive elements
- **Fixed UI Frame**: floating pill navbar, side annotations (`48MP SYSTEM`, `A17 PRO`), and a footer with a live scroll-progress percentage
- **Fullscreen Menu Overlay**: animated navigation menu (Models, Specifications, Gallery, Buy)
- **Responsive Canvas Rendering**: frames are drawn with device-pixel-ratio scaling and `object-fit: cover`-style positioning for crisp visuals on any screen

## Tech Stack

| Category | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 8 |
| Styling | Tailwind CSS 4 |
| Smooth Scroll | Lenis |
| Rendering | HTML5 Canvas API |
| Linting | oxlint |

## Project Structure

```
Iphone/
├── public/
│   └── frames/                  # 294 sequential JPG frames for the scroll animation
├── src/
│   ├── components/
│   │   └── ScrollSequence.tsx   # Canvas frame preloader & scrubber
│   ├── assets/
│   ├── App.tsx                  # Layout, scroll progress, kinetic typography sections
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── tailwind.config.js
└── vite.config.ts
```

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/WarrenBillTT/Iphone.git
   cd Iphone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview the production build**
   ```bash
   npm run preview
   ```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server with HMR |
| `npm run build` | Type-checks and builds the project for production |
| `npm run lint` | Runs oxlint |
| `npm run preview` | Previews the production build locally |

## Notes

- The animation frames in `public/frames/` are sourced from a GIF-to-frames conversion (`ezgif-frame-XXX.jpg`) and total ~294 images keep this in mind for repo size and load performance.
- This project is a design/animation study inspired by Apple's marketing pages and is not affiliated with or endorsed by Apple Inc.

## License

This project was built for personal/educational use as a front-end animation study. Feel free to use it as a reference, but please don't copy it identically for your own portfolio.
