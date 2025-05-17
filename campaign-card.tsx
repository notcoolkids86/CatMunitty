import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Campaign } from "@shared/schema";
import { formatCurrency, calculateDaysLeft, calculateProgress } from "@/lib/utils";

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const daysLeft = calculateDaysLeft(campaign.endDate);
  const progress = calculateProgress(campaign.currentAmount, campaign.targetAmount);
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "feeding":
        return "bg-primary";
      case "healthcare":
        return "bg-[#FFA600]";
      case "shelter":
        return "bg-[#36D399]";
      default:
        return "bg-primary";
    }
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "feeding":
        return "Pangan";
      case "healthcare":
        return "Kesehatan";
      case "shelter":
        return "Shelter";
      case "sterilization":
        return "Sterilisasi";
      case "education":
        return "Edukasi";
      case "adoption":
        return "Adopsi";
      default:
        return category;
    }
  };

  return (
    <div className="campaign-card bg-dark-lighter rounded-xl overflow-hidden hover:shadow-lg transition duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={campaign.imageUrl} 
          alt={campaign.title} 
          className="w-full h-full object-cover transition group-hover:scale-105"
        />
        <div className={`absolute top-3 left-3 ${getCategoryColor(campaign.category)} px-3 py-1 rounded-full text-xs font-medium`}>
          {getCategoryLabel(campaign.category)}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">{campaign.title}</h3>
        <p className="text-cream-dark text-sm mb-4 line-clamp-2">
          {campaign.shortDescription}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{formatCurrency(campaign.currentAmount)}</span>
            <span className="text-cream-dark">dari {formatCurrency(campaign.targetAmount)}</span>
          </div>
          
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          
          <div className="flex justify-between text-xs text-cream-dark">
            <span>{progress.toFixed(0)}% Tercapai</span>
            <span>{daysLeft} Hari Tersisa</span>
          </div>
        </div>
        
        <Button 
          asChild
          variant="outline" 
          className="w-full bg-dark hover:bg-primary text-primary hover:text-white transition border border-primary rounded-full"
        >
          <Link href={`/donate/${campaign.id}`}>Donasi Sekarang</Link>
        </Button>
      </div>
    </div>
  );
}
