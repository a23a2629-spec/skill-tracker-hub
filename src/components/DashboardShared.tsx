import { Brain } from "lucide-react";

// ── Brain Orb ─────────────────────────────────────────────────────────────
export function BrainOrb() {
  return (
    <div className="relative w-36 h-36 sm:w-52 sm:h-52 shrink-0 hidden sm:flex items-center justify-center select-none">

      {/* ── Ambient glow ── */}
      <div className="absolute inset-[-15%] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.30) 0%, rgba(59,130,246,0.14) 45%, transparent 72%)", filter: "blur(10px)" }} />

      {/* ── Expanding pulse rings ── */}
      <div className="absolute inset-[18%] rounded-full border border-violet-400/30 animate-ping" style={{ animationDuration: "3s" }} />
      <div className="absolute inset-[10%] rounded-full border border-cyan-400/20 animate-ping" style={{ animationDuration: "4.2s", animationDelay: "1.4s" }} />

      {/* ── Ring 1: equatorial, violet, fast ── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "9s" }}>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="brg1" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0" />
                <stop offset="45%" stopColor="#A78BFA" stopOpacity="1" />
                <stop offset="65%" stopColor="#C4B5FD" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="50" rx="46" ry="13" fill="none" stroke="url(#brg1)" strokeWidth="1.4" />
          </svg>
        </div>
      </div>

      {/* ── Ring 2: tilted 58°, cyan, medium reverse ── */}
      <div className="absolute inset-0" style={{ transform: "rotate(58deg)" }}>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "15s", animationDirection: "reverse" }}>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="brg2" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
                <stop offset="50%" stopColor="#22D3EE" stopOpacity="1" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="50" rx="44" ry="15" fill="none" stroke="url(#brg2)" strokeWidth="1.1" />
          </svg>
        </div>
      </div>

      {/* ── Ring 3: tilted 116°, pink, slow ── */}
      <div className="absolute inset-0" style={{ transform: "rotate(116deg)" }}>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "23s" }}>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="brg3" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#EC4899" stopOpacity="0" />
                <stop offset="50%" stopColor="#F472B6" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
              </linearGradient>
            </defs>
            <ellipse cx="50" cy="50" rx="41" ry="11" fill="none" stroke="url(#brg3)" strokeWidth="0.9" />
          </svg>
        </div>
      </div>

      {/* ── Central sphere ── */}
      <div className="relative w-[46%] h-[46%] rounded-full flex items-center justify-center z-10"
        style={{
          background: "radial-gradient(circle at 33% 30%, #B45FFC, #7C3AED 42%, #4C1D95 75%, #1E1B4B 100%)",
          boxShadow: "0 0 0 1.5px rgba(196,181,253,0.45), 0 0 22px rgba(139,92,246,0.65), 0 0 55px rgba(139,92,246,0.22), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -2px 8px rgba(0,0,0,0.3)"
        }}>
        {/* gloss highlight */}
        <div className="absolute top-[10%] left-[14%] w-[38%] h-[25%] rounded-full bg-white/22 blur-[3px]" />
        <Brain size={22} className="relative text-white/95"
          style={{ filter: "drop-shadow(0 0 7px rgba(216,180,254,0.95)) drop-shadow(0 0 2px rgba(255,255,255,0.6))" }} />
      </div>

      {/* ── Orbiting nodes ── */}
      <div className="absolute rounded-full bg-cyan-300 w-3.5 h-3.5 top-[7%] right-[15%]"
        style={{ boxShadow: "0 0 10px rgba(103,232,249,1), 0 0 22px rgba(34,211,238,0.55)", animation: "pulse 2.1s ease-in-out infinite" }} />
      <div className="absolute rounded-full bg-violet-300 w-3 h-3 bottom-[13%] left-[11%]"
        style={{ boxShadow: "0 0 10px rgba(196,181,253,1), 0 0 20px rgba(139,92,246,0.55)", animation: "pulse 3.1s ease-in-out infinite 0.9s" }} />
      <div className="absolute rounded-full bg-blue-300 w-2.5 h-2.5 top-[37%] left-[3%]"
        style={{ boxShadow: "0 0 8px rgba(147,197,253,1), 0 0 16px rgba(96,165,250,0.5)", animation: "pulse 2.7s ease-in-out infinite 1.7s" }} />
      <div className="absolute rounded-full bg-fuchsia-300 w-2.5 h-2.5 bottom-[20%] right-[7%]"
        style={{ boxShadow: "0 0 8px rgba(240,171,252,1), 0 0 16px rgba(217,70,239,0.5)", animation: "pulse 3.5s ease-in-out infinite 0.4s" }} />
      <div className="absolute rounded-full bg-emerald-300 w-2 h-2 top-[22%] left-[16%]"
        style={{ boxShadow: "0 0 6px rgba(110,231,183,1), 0 0 12px rgba(52,211,153,0.45)", animation: "pulse 2.9s ease-in-out infinite 2.1s" }} />

      {/* ── Ground reflection glow ── */}
      <div className="absolute bottom-[-3%] left-1/2 -translate-x-1/2 w-[44%] h-[8%] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.45), transparent 70%)", filter: "blur(6px)" }} />
    </div>
  );
}

// ── Sparkline ─────────────────────────────────────────────────────────────
export function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 76, H = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 4) - 2}`).join(" ");
  const last = data[data.length - 1];
  const lx = W;
  const ly = H - ((last - min) / range) * (H - 4) - 2;
  return (
    <svg width={W} height={H} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
      <circle cx={lx} cy={ly} r="2.5" fill={color} opacity="0.9" />
    </svg>
  );
}

// ── Dark Stat Card ────────────────────────────────────────────────────────
export function DarkStatCard({
  label, value, icon: Icon, iconColor, trend, sparkData, sparkColor, trendUp,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
  trend: string;
  sparkData: number[];
  sparkColor: string;
  trendUp?: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden group hover:scale-[1.01] transition-transform cursor-default bg-card border border-border"
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${iconColor}14, transparent 65%)` }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{label}</p>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${iconColor}22` }}>
            <Icon size={14} style={{ color: iconColor }} />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-black text-foreground mb-1 leading-none">{value}</p>
        <p
          className="text-[10px] mb-3"
          style={{ color: trendUp === false ? "#EF4444" : trendUp === true ? "#10B981" : "#64748B" }}
        >
          {trendUp === true && "↑ "}{trendUp === false && "↓ "}{trend}
        </p>
        <Sparkline data={sparkData} color={sparkColor} />
      </div>
    </div>
  );
}
