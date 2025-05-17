import { Helmet } from "react-helmet-async";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@shared/schema";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DonationFormWrapper from "@/components/donations/donation-form";
import CampaignProgress from "@/components/campaign/campaign-progress";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DonationPage() {
  const { id } = useParams<{ id?: string }>();
  const campaignId = id ? parseInt(id) : undefined;
  
  // Fetch campaign details if id is provided
  const { data: campaign, isLoading, isError } = useQuery<Campaign>({
    queryKey: ['/api/campaigns', campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/campaigns/${campaignId}`);
      if (!res.ok) throw new Error('Failed to fetch campaign');
      return res.json();
    },
    enabled: !!campaignId // Only run query if campaign ID exists
  });
  
  return (
    <>
      <Helmet>
        <title>{campaign ? `Donasi untuk ${campaign.title}` : 'Donasi - Catmunitty'}</title>
        <meta 
          name="description" 
          content={campaign 
            ? `Bantu ${campaign.title} dengan donasi Anda. ${campaign.shortDescription}` 
            : 'Berikan dukungan untuk kucing terlantar melalui donasi di Catmunitty.'}
        />
      </Helmet>

      <Header />
      
      <main className="py-12 md:py-16 bg-dark">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {campaign ? `Donasi untuk "${campaign.title}"` : 'Donasi untuk Kucing Terlantar'}
            </h1>
            <p className="text-cream-dark max-w-2xl mx-auto">
              {campaign 
                ? campaign.shortDescription 
                : 'Setiap donasi yang Anda berikan akan membantu menyediakan pangan, perawatan, dan perlindungan bagi kucing-kucing terlantar.'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Campaign Preview (If campaign ID provided) */}
            {campaignId && (
              <div className="bg-dark-lighter rounded-xl overflow-hidden">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="mt-4 text-cream-dark">Memuat data kampanye...</p>
                  </div>
                ) : isError ? (
                  <div className="p-8 text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
                    <h3 className="text-xl font-bold mb-2">Kampanye tidak ditemukan</h3>
                    <p className="text-cream-dark mb-4">Maaf, kampanye yang Anda cari tidak ditemukan atau sudah tidak aktif.</p>
                    <Button asChild>
                      <Link href="/campaigns">Lihat Kampanye Lain</Link>
                    </Button>
                  </div>
                ) : campaign ? (
                  <>
                    <img 
                      src={campaign.imageUrl} 
                      alt={campaign.title} 
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-4">{campaign.title}</h3>
                      <CampaignProgress 
                        currentAmount={campaign.currentAmount}
                        targetAmount={campaign.targetAmount}
                        endDate={campaign.endDate}
                        className="mb-4"
                      />
                      <p className="text-cream-dark text-sm mb-4">{campaign.shortDescription}</p>
                    </div>
                  </>
                ) : null}
              </div>
            )}
            
            {/* General Donation Info (If no campaign ID) */}
            {!campaignId && (
              <div className="bg-dark-lighter rounded-xl p-6">
                <h2 className="text-xl font-bold mb-4">Donasi Untuk Catmunitty</h2>
                <p className="text-cream-dark mb-4">
                  Donasi Anda akan digunakan untuk membantu kucing-kucing terlantar dengan:
                </p>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex gap-3">
                    <div className="text-primary mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold">Pangan Kucing</h3>
                      <p className="text-cream-dark text-sm">Menyediakan makanan bergizi untuk kucing terlantar</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <div className="text-primary mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold">Perawatan Medis</h3>
                      <p className="text-cream-dark text-sm">Biaya vaksinasi, sterilisasi, dan perawatan kesehatan dasar</p>
                    </div>
                  </li>
                  
                  <li className="flex gap-3">
                    <div className="text-primary mt-1 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold">Shelter Mini</h3>
                      <p className="text-cream-dark text-sm">Membangun tempat berteduh bagi kucing jalanan</p>
                    </div>
                  </li>
                </ul>
                
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                    alt="Feeding stray cats" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
            
            {/* Donation Form */}
            <DonationFormWrapper campaignId={campaignId} />
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
