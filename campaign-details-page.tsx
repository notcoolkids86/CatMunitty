import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Campaign, Donation, User } from "@shared/schema";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CampaignProgress from "@/components/campaign/campaign-progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Share, BarChart3, Clock, MapPin, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate, calculateDaysLeft } from "@/lib/utils";

export default function CampaignDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const campaignId = parseInt(id);
  const [activeTab, setActiveTab] = useState("details");
  
  // Fetch campaign details
  const { data: campaign, isLoading, isError } = useQuery<Campaign>({
    queryKey: ['/api/campaigns', campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/campaigns/${campaignId}`);
      if (!res.ok) throw new Error('Failed to fetch campaign');
      return res.json();
    }
  });
  
  // Fetch campaign donations
  const { data: donations } = useQuery<Donation[]>({
    queryKey: ['/api/donations', campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/donations?campaignId=${campaignId}`);
      if (!res.ok) throw new Error('Failed to fetch donations');
      return res.json();
    },
    enabled: !!campaign
  });
  
  // Fetch campaign creator
  const { data: creator } = useQuery<User>({
    queryKey: ['/api/users', campaign?.creatorId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${campaign?.creatorId}`);
      if (!res.ok) throw new Error('Failed to fetch creator');
      return res.json();
    },
    enabled: !!campaign
  });
  
  // Fetch campaign transactions
  const { data: transactions } = useQuery({
    queryKey: ['/api/transactions', campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/transactions?campaignId=${campaignId}`);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      return res.json();
    },
    enabled: !!campaign
  });
  
  if (isLoading) {
    return (
      <>
        <Header />
        <main className="py-12 min-h-screen">
          <div className="container mx-auto text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-cream-dark">Memuat kampanye...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (isError || !campaign) {
    return (
      <>
        <Header />
        <main className="py-12 min-h-screen">
          <div className="container mx-auto text-center">
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <AlertCircle className="h-16 w-16 text-destructive mb-4" />
              <h1 className="text-2xl font-bold mb-2">Kampanye Tidak Ditemukan</h1>
              <p className="text-cream-dark mb-6">Kampanye yang Anda cari tidak ditemukan atau sudah tidak aktif.</p>
              <Button asChild>
                <Link href="/campaigns">Lihat Semua Kampanye</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  const daysLeft = calculateDaysLeft(campaign.endDate);
  
  // Helper function to get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "feeding": return "Pangan";
      case "healthcare": return "Kesehatan";
      case "shelter": return "Shelter";
      case "sterilization": return "Sterilisasi";
      case "education": return "Edukasi";
      default: return category;
    }
  };
  
  return (
    <>
      <Helmet>
        <title>{campaign.title} - Catmunitty</title>
        <meta name="description" content={campaign.shortDescription} />
      </Helmet>

      <Header />
      
      <main className="py-12">
        <div className="container mx-auto">
          {/* Campaign Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="bg-dark-lighter text-primary">
                {getCategoryLabel(campaign.category)}
              </Badge>
              {campaign.location && (
                <Badge variant="outline" className="bg-dark-lighter flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {campaign.location}
                </Badge>
              )}
              <Badge variant="outline" className="bg-dark-lighter flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {daysLeft} Hari Tersisa
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {campaign.title}
            </h1>
            
            <p className="text-cream-dark text-lg mb-6">
              {campaign.shortDescription}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Campaign Content - 2/3 width */}
            <div className="lg:col-span-2">
              {/* Campaign Image */}
              <div className="rounded-xl overflow-hidden mb-8">
                <img 
                  src={campaign.imageUrl} 
                  alt={campaign.title}
                  className="w-full h-auto"
                />
              </div>
              
              {/* Campaign Tabs */}
              <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mb-8">
                <TabsList className="bg-dark-lighter">
                  <TabsTrigger value="details">Detail Kampanye</TabsTrigger>
                  <TabsTrigger value="donors">Donatur</TabsTrigger>
                  <TabsTrigger value="updates">Laporan Penggunaan</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-6">
                  <div className="prose prose-invert max-w-none prose-headings:text-cream-DEFAULT prose-p:text-cream-dark">
                    <div dangerouslySetInnerHTML={{ __html: campaign.description.replace(/\n/g, '<br/>') }} />
                  </div>
                </TabsContent>
                
                <TabsContent value="donors" className="mt-6">
                  {donations && donations.length > 0 ? (
                    <div className="space-y-4">
                      {donations.map((donation) => (
                        <div key={donation.id} className="bg-dark-lighter rounded-lg p-4">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarFallback>{donation.anonymous ? 'A' : donation.donorName?.charAt(0) || 'D'}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{donation.anonymous ? 'Anonim' : donation.donorName}</p>
                              <p className="text-primary font-medium">{formatCurrency(donation.amount)}</p>
                              {donation.message && (
                                <p className="text-sm text-cream-dark mt-2">{donation.message}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-dark-lighter rounded-lg">
                      <p className="text-cream-dark">Belum ada donasi untuk kampanye ini.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="updates" className="mt-6">
                  {transactions && transactions.length > 0 ? (
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="bg-dark-lighter rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-primary font-medium">{formatCurrency(transaction.amount)}</p>
                          </div>
                          <div className="flex justify-between text-sm text-cream-dark">
                            <p>{getCategoryLabel(transaction.category)}</p>
                            <p>{formatDate(transaction.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-dark-lighter rounded-lg">
                      <p className="text-cream-dark">Belum ada laporan penggunaan dana untuk kampanye ini.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              {/* Campaign Creator */}
              <div className="bg-dark-lighter rounded-xl p-6 mb-8">
                <h3 className="text-lg font-bold mb-4">Dibuat oleh</h3>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={creator?.profileImage} alt={creator?.fullName} />
                    <AvatarFallback>{creator?.fullName?.charAt(0) || 'C'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{creator?.fullName || 'Catmunitty Team'}</p>
                    <p className="text-sm text-cream-dark">Dibuat pada {formatDate(campaign.startDate)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Campaign Sidebar - 1/3 width */}
            <div className="lg:col-span-1">
              <div className="bg-dark-lighter rounded-xl p-6 sticky top-24">
                <CampaignProgress
                  currentAmount={campaign.currentAmount}
                  targetAmount={campaign.targetAmount}
                  endDate={campaign.endDate}
                  className="mb-6"
                />
                
                <div className="space-y-4">
                  <Button asChild className="w-full bg-primary hover:bg-primary-dark rounded-lg">
                    <Link href={`/donate/${campaign.id}`}>Donasi Sekarang</Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full bg-transparent border border-cream-DEFAULT/30 hover:border-cream-DEFAULT gap-2 rounded-lg">
                    <Share className="h-4 w-4" />
                    Bagikan
                  </Button>
                  
                  {campaign.status === "completed" && (
                    <div className="bg-dark p-4 rounded-lg text-center">
                      <Badge variant="outline" className="bg-accent-green text-black mb-2">
                        Tercapai
                      </Badge>
                      <p className="text-sm text-cream-dark">
                        Kampanye ini telah mencapai target dan telah selesai.
                      </p>
                    </div>
                  )}
                  
                  {daysLeft <= 5 && campaign.status === "active" && (
                    <div className="bg-dark p-4 rounded-lg text-center">
                      <Badge variant="outline" className="bg-[#FFA600] text-black mb-2">
                        Segera Berakhir
                      </Badge>
                      <p className="text-sm text-cream-dark">
                        Kampanye akan berakhir dalam {daysLeft} hari
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
