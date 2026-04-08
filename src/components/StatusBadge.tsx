import { SkillStatus, getStatusLabel } from "@/data/mockData";

interface StatusBadgeProps {
  status: SkillStatus;
  className?: string;
}

const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => {
  const base = "px-3 py-1 rounded-full text-xs font-semibold inline-block";
  const colors = {
    mastered: "bg-status-mastered text-status-mastered-foreground",
    developing: "bg-status-developing text-status-developing-foreground",
    intensive: "bg-status-intensive text-status-intensive-foreground",
  };

  return (
    <span className={`${base} ${colors[status]} ${className}`}>
      {getStatusLabel(status)}
    </span>
  );
};

export default StatusBadge;
