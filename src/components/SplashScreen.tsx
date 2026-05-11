import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2.5,
  duration: 4 + Math.random() * 6,
  delay: Math.random() * 5,
  opacity: 0.15 + Math.random() * 0.45,
}));

const DATA_NODES = [
  { x: 12, y: 22, label: "Skill Analysis", value: "94%", color: "#06B6D4" },
  { x: 82, y: 18, label: "At-Risk Students", value: "3", color: "#EF4444" },
  { x: 8, y: 72, label: "Interventions", value: "12", color: "#10B981" },
  { x: 88, y: 75, label: "Avg Score", value: "78%", color: "#8B5CF6" },
  { x: 48, y: 85, label: "Attendance", value: "91%", color: "#06B6D4" },
];

const CHART_POINTS = [
  [8, 60], [18, 52], [28, 58], [38, 42], [48, 48],
  [58, 35], [68, 40], [78, 28], [88, 32], [95, 22],
];

function polyline(pts: number[][]) {
  return pts.map(([x, y]) => `${x},${y}`).join(" ");
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<
    "intro" | "text1" | "text2" | "reveal" | "exit"
  >("intro");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timers = [
      setTimeout(() => setPhase("text1"), 600),
      setTimeout(() => setPhase("text2"), 3200),
      setTimeout(() => setPhase("reveal"), 5600),
      setTimeout(() => setPhase("exit"), 8200),
      setTimeout(() => onComplete(), 9000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const vis = (target: typeof phase, extra = "") => {
    const isVisible = phase === target;
    return `transition-all duration-700 ${
      isVisible
        ? `opacity-100 translate-y-0 ${extra}`
        : "opacity-0 translate-y-3 pointer-events-none"
    }`;
  };

  return (
    <>
      <style>{`
        @keyframes float-particle {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-18px) translateX(8px); }
          66% { transform: translateY(10px) translateX(-6px); }
        }
        @keyframes pulse-node {
          0%, 100% { box-shadow: 0 0 0 0 currentColor, 0 0 12px 2px currentColor; opacity: 0.8; }
          50% { box-shadow: 0 0 0 8px transparent, 0 0 24px 6px currentColor; opacity: 1; }
        }
        @keyframes draw-line {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes glow-logo {
          0%, 100% { filter: drop-shadow(0 0 12px #2563EB88) drop-shadow(0 0 24px #06B6D444); }
          50% { filter: drop-shadow(0 0 24px #2563EBbb) drop-shadow(0 0 48px #06B6D466); }
        }
        @keyframes shimmer-text {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes bar-grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes ping-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes scan-line {
          0% { top: 0%; opacity: 0.5; }
          100% { top: 100%; opacity: 0; }
        }
        .splash-bg {
          background: radial-gradient(ellipse at 30% 20%, #0f2957 0%, #0F172A 55%, #060d1f 100%);
        }
        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #93C5FD 35%, #06B6D4 65%, #ffffff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-text 3s linear infinite;
        }
        .tagline-text {
          background: linear-gradient(90deg, #06B6D4, #2563EB, #06B6D4);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-text 2s linear infinite;
        }
        .logo-glow { animation: glow-logo 2.5s ease-in-out infinite; }
        .chart-line {
          stroke-dasharray: 1000;
          animation: draw-line 1.8s ease-out forwards;
        }
        .ping-ring {
          animation: ping-ring 1.4s cubic-bezier(0,0,0.2,1) infinite;
        }
        .scan-line {
          position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, #06B6D480, transparent);
          animation: scan-line 2s linear infinite;
        }
        .exit-fade {
          transition: opacity 0.8s ease-in-out;
        }
      `}</style>

      <div
        className={`fixed inset-0 z-[200] flex items-center justify-center overflow-hidden splash-bg exit-fade ${
          phase === "exit" ? "opacity-0" : "opacity-100"
        } ${mounted ? "" : "opacity-0"}`}
      >
        {/* Scan line */}
        <div className="scan-line" />

        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-blue-400"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animation: `float-particle ${p.duration}s ${p.delay}s ease-in-out infinite`,
            }}
          />
        ))}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl bg-blue-600 pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl bg-cyan-500 pointer-events-none" />

        {/* Data nodes — visible in reveal phase */}
        {DATA_NODES.map((node, i) => (
          <div
            key={i}
            className="absolute transition-all duration-700"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              opacity: phase === "reveal" || phase === "exit" ? 1 : 0,
              transform:
                phase === "reveal" || phase === "exit"
                  ? "scale(1)"
                  : "scale(0.6)",
              transitionDelay: `${i * 120}ms`,
            }}
          >
            <div
              className="relative flex flex-col items-center gap-1"
              style={{ color: node.color }}
            >
              <div className="ping-ring absolute w-3 h-3 rounded-full bg-current opacity-60" />
              <div
                className="w-3 h-3 rounded-full relative z-10"
                style={{
                  backgroundColor: node.color,
                  boxShadow: `0 0 10px ${node.color}`,
                }}
              />
              <div
                className="text-[10px] font-bold leading-tight text-center whitespace-nowrap px-2 py-1 rounded-lg border"
                style={{
                  backgroundColor: `${node.color}18`,
                  borderColor: `${node.color}40`,
                  color: node.color,
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="text-sm font-black">{node.value}</div>
                <div className="text-[9px] opacity-80 font-semibold">{node.label}</div>
              </div>
            </div>
          </div>
        ))}

        {/* Analytics chart — reveal phase */}
        <div
          className="absolute bottom-[18%] left-[5%] right-[5%] transition-all duration-1000"
          style={{
            opacity: phase === "reveal" || phase === "exit" ? 0.35 : 0,
            transitionDelay: "200ms",
          }}
        >
          <svg
            viewBox="0 0 100 70"
            className="w-full"
            style={{ height: "80px" }}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="chartGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563EB" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points={`${polyline(CHART_POINTS)} 95,70 0,70`}
              fill="url(#fillGrad)"
            />
            <polyline
              points={polyline(CHART_POINTS)}
              fill="none"
              stroke="url(#chartGrad)"
              strokeWidth="0.8"
              className="chart-line"
            />
            {CHART_POINTS.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="0.8"
                fill="#06B6D4"
                opacity="0.9"
              />
            ))}
          </svg>
        </div>

        {/* ── CENTER STAGE ── */}
        <div className="absolute inset-0 z-10">

          {/* Phase: text1 */}
          <div
            className={`absolute left-0 right-0 px-6 text-center max-w-2xl mx-auto transition-all duration-700 ${
              phase === "text1" ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{
              top: "50%",
              transform: phase === "text1" ? "translateY(-50%)" : "translateY(calc(-50% + 12px))",
            }}
          >
            <p className="text-[13px] uppercase tracking-[0.35em] text-cyan-400/70 font-semibold mb-5">
              In-Campus Skills Gap Tracker
            </p>
            <h1 className="gradient-text text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight">
              Every student has potential.
            </h1>
          </div>

          {/* Phase: text2 */}
          <div
            className={`absolute left-0 right-0 px-6 text-center max-w-2xl mx-auto transition-all duration-700 ${
              phase === "text2" ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{
              top: "50%",
              transform: phase === "text2" ? "translateY(-50%)" : "translateY(calc(-50% + 12px))",
            }}
          >
            <p className="text-[13px] uppercase tracking-[0.35em] text-cyan-400/70 font-semibold mb-5">
              The challenge is
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-snug tracking-tight text-white">
              But not every struggle{" "}
              <span className="gradient-text">is detected early.</span>
            </h1>
          </div>

          {/* Phase: reveal — logo + tagline */}
          <div
            className={`absolute left-0 right-0 px-6 flex flex-col items-center text-center max-w-2xl mx-auto transition-all duration-700 ${
              phase === "reveal" ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{
              top: "50%",
              transform: phase === "reveal" ? "translateY(-50%)" : "translateY(calc(-50% + 12px))",
            }}
          >
            {/* Logo */}
            <div className="logo-glow mb-5">
              <img
                src="/logo.png"
                alt="In-Campus"
                className="h-20 sm:h-24 object-contain"
                style={{ filter: "brightness(1.15)" }}
              />
            </div>

            {/* Platform name */}
            <div className="mb-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                In-Campus
              </h2>
              <p className="text-base sm:text-lg font-semibold text-blue-300/80 tracking-wide">
                Skills Gap Tracker
              </p>
            </div>

            {/* Divider */}
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-4" />

            {/* Tagline */}
            <p className="tagline-text text-lg sm:text-xl font-bold tracking-widest uppercase">
              Early Detection. Smarter Intervention.
            </p>

            {/* Loading dots */}
            <div className="flex items-center gap-2 mt-8">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                  style={{
                    animation: `ping-ring 1s ${i * 0.2}s ease-in-out infinite`,
                    animationName: "none",
                    opacity: 0.5 + i * 0.15,
                  }}
                />
              ))}
              <span className="text-xs text-cyan-400/60 ml-2 tracking-widest">
                Loading platform…
              </span>
            </div>
          </div>
        </div>

        {/* Bottom brand mark */}
        <div
          className="absolute bottom-6 left-0 right-0 flex justify-center transition-opacity duration-700"
          style={{ opacity: phase === "text1" || phase === "text2" ? 0.4 : 0 }}
        >
          <div className="flex items-center gap-2 text-white/30 text-xs tracking-widest uppercase">
            <div className="w-6 h-px bg-white/20" />
            University Management Platform
            <div className="w-6 h-px bg-white/20" />
          </div>
        </div>
      </div>
    </>
  );
}
