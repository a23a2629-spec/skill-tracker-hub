import { Brain } from "lucide-react";

// ── Brain Orb ────────────────────────────────────────────────────────────
export function BrainOrb() {
  return (
    <div className="relative w-32 h-32 sm:w-44 sm:h-44 shrink-0 hidden sm:flex items-center justify-center select-none">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600/20 to-blue-600/10 blur-2xl pointer-events-none" />
      <svg className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: "20s" }}>
        <ellipse cx="50%" cy="50%" rx="47%" ry="22%" fill="none" stroke="url(#og1)" strokeWidth="1" strokeDasharray="6 10" opacity="0.5" />
        <defs>
          <linearGradient id="og1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0" />
            <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <svg className="absolute inset-[12%] w-[76%] h-[76%] animate-spin" style={{ animationDuration: "14s", animationDirection: "reverse" }}>
        <ellipse cx="50%" cy="50%" rx="47%" ry="20%" fill="none" stroke="url(#og2)" strokeWidth="0.8" strokeDasharray="4 7" opacity="0.35" />
        <defs>
          <linearGradient id="og2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <div
        className="relative w-[56%] h-[56%] rounded-full bg-gradient-to-br from-[#2e1065]/80 via-[#1e3a8a]/60 to-[#0c4a6e]/40 border border-violet-400/25 flex items-center justify-center"
        style={{ boxShadow: "0 0 30px rgba(139,92,246,0.25), inset 0 0 20px rgba(99,102,241,0.1)" }}
      >
        <Brain size={36} className="text-violet-200/75" />
      </div>
      <div className="absolute top-[10%] right-[12%] w-4 h-4 rounded-full bg-blue-500/35 border border-blue-400/50 animate-pulse" />
      <div className="absolute bottom-[15%] left-[8%] w-3 h-3 rounded-sm bg-violet-500/35 border border-violet-400/50 animate-pulse" style={{ animationDelay: "0.8s" }} />
      <div className="absolute top-[38%] left-[4%] w-2.5 h-2.5 rounded-full bg-cyan-500/35 border border-cyan-400/50 animate-pulse" style={{ animationDelay: "1.5s" }} />
      <div className="absolute bottom-[4%] w-[55%] h-[8%] rounded-full bg-gradient-to-r from-violet-600/0 via-violet-500/30 to-violet-600/0 blur-lg pointer-events-none" />
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
      className="rounded-2xl p-4 relative overflow-hidden group hover:scale-[1.01] transition-transform cursor-default"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top right, ${iconColor}14, transparent 65%)` }}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{label}</p>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${iconColor}22` }}>
            <Icon size={14} style={{ color: iconColor }} />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-black text-white mb-1 leading-none">{value}</p>
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
