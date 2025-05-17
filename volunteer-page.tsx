import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import VolunteerForm from "@/components/volunteer/volunteer-form";
import { IceCreamBowl, Cross, Megaphone } from "lucide-react";

export default function VolunteerPage() {
  return (
    <>
      <Helmet>
        <title>Jadi Relawan - Catmunitty</title>
        <meta name="description" content="Bergabunglah menjadi relawan Catmunitty untuk membantu kucing terlantar. Jadilah bagian dari komunitas yang peduli pada makhluk jalanan." />
      </Helmet>

      <Header />
      
      <section id="relawan" className="py-16 relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1598188306155-25e400eb5078?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')", 
              backgroundPosition: "center", 
              backgroundSize: "cover" 
            }} 
            className="h-full w-full opacity-20"
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/90 to-dark/70"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-4">Jadilah Relawan</h1>
              <p className="text-cream-dark mb-6">
                Gabung menjadi relawan dan bantu kami memberi makan dan merawat kucing jalanan. 
                Kamu juga bisa membantu dalam kegiatan kampanye, edukasi, dan fundraising.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="text-primary text-xl mt-1">
                    <IceCreamBowl />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Feeding Program</h3>
                    <p className="text-cream-dark text-sm">
                      Membantu memberi makan kucing jalanan secara rutin di berbagai titik kota.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="text-primary text-xl mt-1">
                    <Cross />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Perawatan Medis</h3>
                    <p className="text-cream-dark text-sm">
                      Membantu dalam program vaksinasi, sterilisasi, dan perawatan medis dasar.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="text-primary text-xl mt-1">
                    <Megaphone />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Kampanye & Edukasi</h3>
                    <p className="text-cream-dark text-sm">
                      Menyebarkan kesadaran tentang kesejahteraan kucing jalanan melalui media sosial dan kegiatan edukasi.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 bg-dark-lighter rounded-lg p-6">
                <h3 className="font-bold mb-2">Testimoni Relawan</h3>
                <p className="text-cream-dark italic text-sm mb-4">
                  "Menjadi relawan di Catmunitty membuat saya lebih menghargai kehidupan. Melihat kucing-kucing yang tadinya kelaparan bisa mendapatkan makanan yang layak memberikan kepuasan tersendiri."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                    D
                  </div>
                  <div>
                    <p className="font-medium text-sm">Dina Setiawan</p>
                    <p className="text-xs text-cream-dark">Relawan sejak 2022</p>
                  </div>
                </div>
              </div>
            </div>
            
            <VolunteerForm />
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-dark-lighter">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">FAQ Relawan</h2>
            <p className="text-cream-dark">Jawaban atas pertanyaan umum tentang program relawan</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-dark p-6 rounded-lg">
              <h3 className="font-bold mb-2">Apa saja syarat menjadi relawan?</h3>
              <p className="text-cream-dark text-sm">
                Anda harus berusia minimal 17 tahun, memiliki kepedulian terhadap kucing, dan bersedia meluangkan waktu minimal 4 jam per minggu.
              </p>
            </div>
            
            <div className="bg-dark p-6 rounded-lg">
              <h3 className="font-bold mb-2">Berapa lama komitmen sebagai relawan?</h3>
              <p className="text-cream-dark text-sm">
                Kami mengharapkan komitmen minimal 3 bulan, tetapi Anda bisa menyesuaikan jadwal dengan ketersediaan waktu Anda.
              </p>
            </div>
            
            <div className="bg-dark p-6 rounded-lg">
              <h3 className="font-bold mb-2">Apakah ada pelatihan untuk relawan?</h3>
              <p className="text-cream-dark text-sm">
                Ya, kami menyediakan pelatihan dasar tentang cara menangani kucing, pemberian makanan, dan prosedur dasar kesehatan kucing.
              </p>
            </div>
            
            <div className="bg-dark p-6 rounded-lg">
              <h3 className="font-bold mb-2">Dimana lokasi kegiatan relawan?</h3>
              <p className="text-cream-dark text-sm">
                Kegiatan relawan tersebar di berbagai titik di Surabaya, terutama di sekitar area kampus Unesa dan Ketintang.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
}
