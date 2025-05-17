import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Campaign } from "@shared/schema";
import { Share } from "lucide-react";
import { formatCurrency, calculateDaysLeft, calculateProgress } from "@/lib/utils";

interface FeaturedCampaignProps {
  campaign: Campaign;
}

export default function FeaturedCampaign({ campaign }: FeaturedCampaignProps) {
  const daysLeft = calculateDaysLeft(campaign.endDate);
  const progress = calculateProgress(campaign.currentAmount, campaign.targetAmount);
  
  return (
    <section className="py-16 bg-dark-lighter">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Kampanye Utama</h2>
          <p className="text-cream-dark max-w-2xl mx-auto">
            Bantu kami memberi makan dan merawat kucing-kucing jalanan yang membutuhkan perhatian dan kasih sayang kita.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Featured Campaign Image */}
          <div className="rounded-xl overflow-hidden">
            <img 
              src={campaign.imageUrl} 
              alt={campaign.title} 
              className="w-full h-auto transition duration-300 hover:scale-105"
            />
          </div>

          {/* Campaign Info */}
          <div className="space-y-6">
            <div className="bg-dark inline-block px-4 py-1 rounded-full text-sm text-primary font-medium">
              Kampanye Utama
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold">{campaign.title}</h3>
            
            <p className="text-cream-dark">{campaign.shortDescription}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">{formatCurrency(campaign.currentAmount)}</span>
                <span className="text-sm text-cream-dark">dari {formatCurrency(campaign.targetAmount)}</span>
              </div>
              
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>{progress.toFixed(0)}% Tercapai</span>
                <span>{daysLeft} Hari Tersisa</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {campaign.location && (
                <Badge variant="outline" className="bg-dark px-3 py-1 rounded-full text-xs">
                  {campaign.location}
                </Badge>
              )}
              <Badge variant="outline" className="bg-dark px-3 py-1 rounded-full text-xs">
                {campaign.category === 'feeding' ? 'Pangan Kucing' : 
                 campaign.category === 'healthcare' ? 'Perawatan' : 
                 campaign.category === 'shelter' ? 'Shelter' : campaign.category}
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                asChild
                className="bg-primary hover:bg-primary-dark transition rounded-full px-6 py-3 font-medium flex-1"
              >
                <Link href={`/donate/${campaign.id}`}>Donasi Sekarang</Link>
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-transparent border border-cream-DEFAULT/30 hover:border-cream-DEFAULT transition rounded-full px-4 py-3"
                aria-label="Bagikan"
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
