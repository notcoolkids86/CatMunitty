import { formatCurrency, calculateDaysLeft, calculateProgress } from "@/lib/utils";

interface CampaignProgressProps {
  currentAmount: number;
  targetAmount: number;
  endDate: string | Date;
  className?: string;
}

export default function CampaignProgress({
  currentAmount,
  targetAmount,
  endDate,
  className = ""
}: CampaignProgressProps) {
  const daysLeft = calculateDaysLeft(endDate);
  const progress = calculateProgress(currentAmount, targetAmount);
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between">
        <span className="font-medium">{formatCurrency(currentAmount)}</span>
        <span className="text-sm text-cream-dark">dari {formatCurrency(targetAmount)}</span>
      </div>
      
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>
      
      <div className="flex justify-between text-sm">
        <span>{progress.toFixed(0)}% Tercapai</span>
        <span>{daysLeft} Hari Tersisa</span>
      </div>
    </div>
  );
}
