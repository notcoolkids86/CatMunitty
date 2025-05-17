import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@shared/schema";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/home/hero-section";
import FeaturedCampaign from "@/components/campaign/featured-campaign";
import SuccessStories from "@/components/home/success-stories";
import TransparencySection from "@/components/transparency/transparency-section";
import CampaignCard from "@/components/campaign/campaign-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HomePage() {
  // Fetch featured campaign
  const { data: featuredCampaign, isLoading: isFeaturedLoading } = useQuery<Campaign>({
    queryKey: ['/api/campaigns', 'featured'],
    queryFn: async () => {
      const res = await fetch('/api/campaigns?featured=true&limit=1');
      if (!res.ok) throw new Error('Failed to fetch featured campaign');
      const data = await res.json();
      return data.campaigns[0];
    },
    // Fallback for initial rendering
    placeholderData: {
      id: 1,
      title: "Pangan Untuk Kucing Jalanan Ketintang",
      description: "Menyediakan pangan dan perawatan dasar bagi puluhan kucing jalanan di area Ketintang, Surabaya. Kucing-kucing ini hidup dalam kondisi yang memprihatinkan dan membutuhkan bantuan kita.",
      shortDescription: "Menyediakan pangan dan perawatan dasar bagi puluhan kucing jalanan di area Ketintang, Surabaya.",
      imageUrl: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      targetAmount: 8000000,
      currentAmount: 5420000,
      startDate: new Date('2023-05-01').toISOString(),
      endDate: new Date('2023-07-01').toISOString(),
      creatorId: 1,
      category: "feeding",
      location: "Surabaya",
      status: "active",
      featured: true
    }
  });

  // Fetch recent campaigns
  const { data: campaignsData, isLoading: isCampaignsLoading } = useQuery<{ campaigns: Campaign[], total: number }>({
    queryKey: ['/api/campaigns', 'recent'],
    queryFn: async () => {
      const res = await fetch('/api/campaigns?limit=3');
      if (!res.ok) throw new Error('Failed to fetch recent campaigns');
      return res.json();
    },
    // Fallback for initial rendering
    placeholderData: {
      campaigns: [
        {
          id: 2,
          title: "Pangan Kucing Jalanan Surabaya Timur",
          description: "Bantuan pangan untuk 25 kucing jalanan di area Surabaya Timur yang kekurangan makanan.",
          shortDescription: "Bantuan pangan untuk 25 kucing jalanan di area Surabaya Timur yang kekurangan makanan.",
          imageUrl: "https://images.unsplash.com/photo-1586042091284-bd35c8c1d917?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
          targetAmount: 3500000,
          currentAmount: 2500000,
          startDate: new Date('2023-06-01').toISOString(),
          endDate: new Date('2023-06-30').toISOString(),
          creatorId: 1,
          category: "feeding",
          location: "Surabaya Timur",
          status: "active",
          featured: false
        },
        {
          id: 3,
          title: "Perawatan Medis Kucing Jalanan Unesa",
          description: "Sterilisasi dan vaksinasi untuk kucing-kucing liar di sekitar kampus Unesa.",
          shortDescription: "Sterilisasi dan vaksinasi untuk kucing-kucing liar di sekitar kampus Unesa.",
          imageUrl: "https://images.unsplash.com/photo-1511044568932-338cba0ad803?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
          targetAmount: 7500000,
          currentAmount: 4200000,
          startDate: new Date('2023-06-01').toISOString(),
          endDate: new Date('2023-06-30').toISOString(),
          creatorId: 1,
          category: "healthcare",
          location: "Unesa",
          status: "active",
          featured: false
        },
        {
          id: 4,
          title: "Shelter Mini untuk Kucing Jalanan",
          description: "Membangun shelter sederhana sebagai tempat berteduh kucing jalanan saat hujan dan panas.",
          shortDescription: "Membangun shelter sederhana sebagai tempat berteduh kucing jalanan saat hujan dan panas.",
          imageUrl: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300",
          targetAmount: 5000000,
          currentAmount: 1800000,
          startDate: new Date('2023-06-01').toISOString(),
          endDate: new Date('2023-06-30').toISOString(),
          creatorId: 1,
          category: "shelter",
          location: "Surabaya",
          status: "active",
          featured: false
        }
      ],
      total: 3
    }
  });

  return (
    <>
      <Helmet>
        <title>Catmunitty - Bersama Peduli Makhluk Jalanan</title>
        <meta name="description" content="Gerakan patungan untuk pangan kucing terlantar. Setiap donasi memberi harapan baru bagi mereka yang tidak bersuara." />
      </Helmet>

      <Header />
      
      <main>
        <HeroSection />
        
        {featuredCampaign && <FeaturedCampaign campaign={featuredCampaign} />}
        
        {/* Campaign List */}
        <section id="kampanye" className="py-16">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Kampanye Terbaru</h2>
                <p className="text-cream-dark">Temukan kampanye terbaru yang sedang berjalan dan butuh dukunganmu</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" className="px-4 py-2 rounded-full bg-dark-lighter text-cream-DEFAULT hover:bg-primary/10 hover:text-primary transition">
                  Semua
                </Button>
                <Button variant="outline" className="px-4 py-2 rounded-full bg-dark-lighter text-cream-DEFAULT hover:bg-primary/10 hover:text-primary transition">
                  Pangan
                </Button>
                <Button variant="outline" className="px-4 py-2 rounded-full bg-dark-lighter text-cream-DEFAULT hover:bg-primary/10 hover:text-primary transition">
                  Kesehatan
                </Button>
                <Button variant="outline" className="px-4 py-2 rounded-full bg-dark-lighter text-cream-DEFAULT hover:bg-primary/10 hover:text-primary transition">
                  Shelter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaignsData?.campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button asChild variant="outline" className="bg-transparent border-2 border-primary text-primary hover:bg-primary/10 transition rounded-full px-8 py-3 font-medium">
                <Link href="/campaigns">Lihat Semua Kampanye</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Donation Process Section */}
        <section id="donasi" className="py-16 bg-primary/10">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Cara Berdonasi</h2>
              <p className="text-cream-dark">
                Proses donasi yang mudah dan transparan. Setiap rupiah yang Anda sumbangkan akan digunakan untuk memberi makan dan merawat kucing jalanan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-dark-lighter rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
                    <path d="M16.5 9.4 7.55 4.24"></path>
                    <polyline points="3.29 7 12 12 20.71 7"></polyline>
                    <line x1="12" y1="22" x2="12" y2="12"></line>
                    <circle cx="18.5" cy="15.5" r="2.5"></circle>
                    <path d="M20.27 17.27 22 19"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Pilih Nominal</h3>
                <p className="text-cream-dark text-sm">Pilih nominal donasi sesuai kemampuan atau masukkan nominal custom.</p>
              </div>
              
              <div className="bg-dark-lighter rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Pembayaran</h3>
                <p className="text-cream-dark text-sm">Pilih metode pembayaran yang tersedia seperti transfer bank, e-wallet, atau QRIS.</p>
              </div>
              
              <div className="bg-dark-lighter rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H2v-8Z"></path>
                    <path d="M6 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6V8Z"></path>
                    <path d="M10 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2V4Z"></path>
                    <path d="M14 12h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2v-8Z"></path>
                    <path d="M18 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2V8Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Lacak Dampak</h3>
                <p className="text-cream-dark text-sm">Dapatkan update tentang dampak donasi Anda dan bagaimana dana digunakan.</p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button asChild className="bg-primary hover:bg-primary-dark transition rounded-full px-8 py-3 font-medium">
                <Link href="/donate">Donasi Sekarang</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <SuccessStories />
        
        <TransparencySection />
      </main>
      
      <Footer />
    </>
  );
}
