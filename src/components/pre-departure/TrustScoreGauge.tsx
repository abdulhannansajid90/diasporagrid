import { cn } from "@/lib/utils";

interface TrustScoreGaugeProps {
  score: number;
  className?: string;
}

export function TrustScoreGauge({ score, className }: TrustScoreGaugeProps) {
  // Score is 0-100
  const normalizedScore = Math.min(100, Math.max(0, score));
  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;
  
  let colorClass = "text-emerald-500";
  let bgGlow = "shadow-[0_0_20px_rgba(16,185,129,0.3)]";
  let statusText = "Verified Agent";
  
  if (score < 40) {
    colorClass = "text-red-500";
    bgGlow = "shadow-[0_0_20px_rgba(239,68,68,0.3)]";
    statusText = "High Risk Fraud";
  } else if (score < 75) {
    colorClass = "text-amber-500";
    bgGlow = "shadow-[0_0_20px_rgba(245,158,11,0.3)]";
    statusText = "Needs Verification";
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-muted border-border"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          {/* Progress Circle */}
          <circle
            className={cn("transition-all duration-1000 ease-out drop-shadow-md", colorClass)}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
        </svg>
        <div className={cn("absolute inset-0 m-auto w-32 h-32 rounded-full flex flex-col items-center justify-center bg-card/40 backdrop-blur-sm border border-border/50", bgGlow)}>
          <span className="text-4xl font-bold font-mono text-white">{normalizedScore}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Score</span>
        </div>
      </div>
      <p className={cn("mt-4 font-semibold text-lg", colorClass)}>{statusText}</p>
    </div>
  );
}
