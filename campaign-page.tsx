import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@shared/schema";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CampaignCard from "@/components/campaign/campaign-card";
import { Button } from "@/components/ui/button";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface CampaignParams {
  id?: string;
}

export default function CampaignPage() {
  const [location, setLocation] = useLocation();
  const params = useParams<CampaignParams>();
  const campaignId = params.id ? parseInt(params.id) : undefined;
  
  // Extract query parameters
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const [page, setPage] = useState<number>(parseInt(searchParams.get('page') || '1'));
  const [limit] = useState<number>(6);
  
  // Fetch campaign by ID if provided
  const { data: campaign, isLoading: isCampaignLoading, isError: isCampaignError } = useQuery<Campaign>({
    queryKey: ['/api/campaigns', campaignId],
    queryFn: async () => {
      if (!campaignId) throw new Error('No campaign ID provided');
      const res = await fetch(`/api/campaigns/${campaignId}`);
      if (!res.ok) throw new Error('Failed to fetch campaign');
      return res.json();
    },
    enabled: !!campaignId
  });
  
  // Fetch campaigns for related/similar campaigns
  const { data: campaignsData, isLoading: isCampaignsLoading, isError: isCampaignsError } = useQuery<{ campaigns: Campaign[], total: number }>({
    queryKey: ['/api/campaigns', { page, limit, related: campaignId }],
    queryFn: async () => {
      const category = campaign?.category;
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      if (category) {
        queryParams.append('category', category);
      }
      
      const res = await fetch(`/api/campaigns?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch campaigns');
      return res.json();
    },
    enabled: !!campaign
  });
  
  const totalPages = campaignsData ? Math.ceil(campaignsData.total / limit) : 0;
  
  // Function to handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setLocation(`/campaign/${campaignId}?${params.toString()}`);
  };
  
  // Filter out the current campaign from related campaigns
  const relatedCampaigns = campaignsData?.campaigns.filter(c => c.id !== campaignId) || [];
  
  return (
    <>
      <Helmet>
        <title>{campaign ? `${campaign.title} - Catmunitty` : 'Kampanye - Catmunitty'}</title>
        <meta 
          name="description" 
          content={campaign?.shortDescription || 'Kampanye peduli kucing terlantar di Catmunitty. Berikan bantuan untuk makanan, perawatan, dan shelter bagi kucing jalanan.'} 
        />
      </Helmet>

      <Header />
      
      <main className="py-12 md:py-16">
        <div className="container mx-auto">
          {campaignId && (
            <>
              {isCampaignLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : isCampaignError ? (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold mb-4">Kampanye tidak ditemukan</h2>
                  <p className="text-cream-dark mb-6">Maaf, kampanye yang Anda cari tidak tersedia atau telah berakhir.</p>
                  <Button asChild className="bg-primary hover:bg-primary-dark">
                    <a href="/campaigns">Lihat Kampanye Lainnya</a>
                  </Button>
                </div>
              ) : campaign ? (
                <div className="mb-16">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Campaign Image */}
                    <div className="lg:col-span-2">
                      <img 
                        src={campaign.imageUrl} 
                        alt={campaign.title} 
                        className="w-full h-auto rounded-xl"
                      />
                    </div>
                    
                    {/* Campaign Details */}
                    <div className="bg-dark-lighter rounded-xl p-6">
                      <h1 className="text-2xl font-bold mb-3">{campaign.title}</h1>
                      <p className="text-cream-dark mb-4">{campaign.shortDescription}</p>
                      
                      <div className="mb-6">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(campaign.currentAmount)}</span>
                          <span className="text-cream-dark">dari {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(campaign.targetAmount)}</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-bar-fill" 
                            style={{ width: `${Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <Button asChild className="w-full bg-primary hover:bg-primary-dark mb-4">
                        <a href={`/donate/${campaign.id}`}>Donasi Sekarang</a>
                      </Button>
                      
                      <div className="bg-dark rounded-lg p-4">
                        <h3 className="font-bold mb-2">Informasi Kampanye</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-cream-dark">Kategori</span>
                            <span>
                              {campaign.category === 'feeding' ? 'Pangan' :
                               campaign.category === 'healthcare' ? 'Kesehatan' :
                               campaign.category === 'shelter' ? 'Shelter' :
                               campaign.category === 'sterilization' ? 'Sterilisasi' :
                               campaign.category === 'education' ? 'Edukasi' :
                               campaign.category}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cream-dark">Lokasi</span>
                            <span>{campaign.location || 'Surabaya'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cream-dark">Tanggal Mulai</span>
                            <span>{new Date(campaign.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-cream-dark">Tanggal Berakhir</span>
                            <span>{new Date(campaign.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Campaign Description */}
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Tentang Kampanye</h2>
                    <div className="bg-dark-lighter rounded-xl p-6">
                      <div className="prose prose-invert max-w-none">
                        {campaign.description.split('\n').map((paragraph, idx) => (
                          <p key={idx} className="text-cream-dark mb-4">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Related Campaigns */}
                  {relatedCampaigns.length > 0 && (
                    <div className="mt-16">
                      <h2 className="text-2xl font-bold mb-6">Kampanye Serupa</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedCampaigns.slice(0, 3).map((relatedCampaign) => (
                          <CampaignCard key={relatedCampaign.id} campaign={relatedCampaign} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </>
          )}
          
          {/* If no campaign ID, show all campaigns */}
          {!campaignId && (
            <>
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold mb-4">Kampanye Peduli Kucing</h1>
                <p className="text-cream-dark max-w-2xl mx-auto">
                  Temukan dan dukung kampanye-kampanye untuk membantu kucing jalanan yang membutuhkan perhatian dan kasih sayang.
                </p>
              </div>
              
              {isCampaignsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : isCampaignsError ? (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold mb-4">Gagal memuat kampanye</h2>
                  <p className="text-cream-dark mb-6">Maaf, terjadi kesalahan saat memuat kampanye. Silakan coba lagi nanti.</p>
                  <Button className="bg-primary hover:bg-primary-dark" onClick={() => window.location.reload()}>
                    Coba Lagi
                  </Button>
                </div>
              ) : campaignsData?.campaigns && campaignsData.campaigns.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {campaignsData.campaigns.map((campaign) => (
                      <CampaignCard key={campaign.id} campaign={campaign} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="mt-12">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page - 1);
                            }}
                            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <PaginationItem key={pageNum}>
                            <PaginationLink 
                              href="#" 
                              onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(pageNum);
                              }}
                              isActive={pageNum === page}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(page + 1);
                            }}
                            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold mb-4">Belum ada kampanye</h2>
                  <p className="text-cream-dark mb-6">Belum ada kampanye yang tersedia saat ini. Silakan kembali lagi nanti.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
