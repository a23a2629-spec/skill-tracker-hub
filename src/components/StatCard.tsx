import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  icon: LucideIcon;
  color?: string;
  description?: string;
}

const StatCard = ({ title, value, suffix = "", icon: Icon, color = "text-primary", description }: StatCardProps) => {
  return (
    <div className="glass-card p-5 hover:glow-border transition-all duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">
            <span className={color}>{value}</span>
            <span className="text-lg text-muted-foreground">{suffix}</span>
          </p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-secondary ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
