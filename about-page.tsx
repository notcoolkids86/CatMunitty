import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PawIcon from "@/components/ui/paw-icon";

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>Tentang Kami - Catmunitty</title>
        <meta name="description" content="Catmunitty adalah platform crowdfunding untuk membantu kucing terlantar melalui kampanye donasi masyarakat. Pelajari visi, misi, dan tujuan kami." />
      </Helmet>

      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 relative overflow-hidden">
          {/* Background image with overlay */}
          <div className="absolute inset-0 z-0">
            <div 
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')", 
                backgroundPosition: "center", 
                backgroundSize: "cover" 
              }} 
              className="h-full w-full opacity-10"
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/95 to-dark"></div>
          </div>
          
          <div className="container mx-auto text-center relative z-10">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="text-primary w-16 h-16 flex items-center justify-center">
                <PawIcon className="text-5xl" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Tentang Catmunitty
            </h1>
            <p className="text-lg max-w-3xl mx-auto text-cream-dark opacity-90">
              Mengenal lebih dalam tentang gerakan kepedulian terhadap kucing jalanan yang kami inisiasi.
            </p>
          </div>
        </section>
        
        {/* About Section */}
        <section className="py-16 bg-dark-lighter">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Visi & Misi</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-primary mb-2">Visi</h3>
                      <p className="text-cream-dark">
                        Menciptakan lingkungan yang aman dan sehat bagi kucing-kucing jalanan melalui kepedulian dan dukungan masyarakat.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-primary mb-2">Misi</h3>
                      <ul className="text-cream-dark space-y-2 list-disc pl-5">
                        <li>Menyediakan pangan dan perawatan dasar untuk kucing jalanan</li>
                        <li>Melakukan sterilisasi untuk mengendalikan populasi kucing liar secara manusiawi</li>
                        <li>Mengedukasi masyarakat tentang pentingnya kesejahteraan kucing jalanan</li>
                        <li>Membangun jaringan relawan dan komunitas peduli kucing</li>
                      </ul>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-6 mt-10">Tujuan SDGs</h2>
                  <div className="space-y-6">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-amber-500 rounded flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-black">SDG 2</span>
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">SDG 2: Zero Hunger</h3>
                        <p className="text-cream-dark text-sm">
                          Kepedulian terhadap kelaparan tidak terbatas pada manusia, tapi juga makhluk hidup lainnya. Kucing jalanan juga berhak mendapatkan makanan yang cukup.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-black">SDG 11</span>
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">SDG 11: Sustainable Cities</h3>
                        <p className="text-cream-dark text-sm">
                          Menciptakan lingkungan kota yang lebih sehat dan seimbang dengan pengelolaan populasi hewan liar. Kota yang ramah terhadap semua makhluk hidup.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-black">SDG 15</span>
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">SDG 15: Life on Land</h3>
                        <p className="text-cream-dark text-sm">
                          Perlindungan dan kesejahteraan hewan, termasuk kucing liar, masuk dalam cakupan SDG ini karena menyangkut ekosistem daratan yang sehat dan seimbang.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-black">SDG 17</span>
                      </div>
                      <div>
                        <h3 className="font-bold mb-1">SDG 17: Partnerships for the Goals</h3>
                        <p className="text-cream-dark text-sm">
                          Crowdfunding itu sendiri adalah bentuk kemitraan masyarakat, menunjukkan kerja sama publik untuk tujuan sosial, yang sesuai dengan semangat kolaborasi.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-6">Komunitas Kami</h2>
                  <p className="text-cream-dark mb-4">
                    Catmunitty dimulai dari kecintaan sekelompok mahasiswa Unesa terhadap kucing-kucing jalanan di sekitar kampus. Melihat kondisi kucing-kucing yang kelaparan dan tidak terawat, kami memutuskan untuk mulai memberi makan secara rutin.
                  </p>
                  
                  <p className="text-cream-dark mb-6">
                    Sejak 2021, gerakan kecil ini berkembang menjadi komunitas yang lebih besar dengan dukungan dari berbagai pihak. Kini, kami telah memiliki lebih dari 75 relawan aktif dan telah membantu ratusan kucing jalanan di Surabaya.
                  </p>
                  
                  <div className="bg-dark rounded-xl p-6 mb-6">
                    <h3 className="font-bold mb-4">Kegiatan Kami</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                          <PawIcon className="text-xl" />
                        </div>
                        <div>
                          <p className="font-medium">Feeding Program Rutin</p>
                          <p className="text-xs text-cream-dark">3x seminggu di 5 titik Surabaya</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                          <PawIcon className="text-xl" />
                        </div>
                        <div>
                          <p className="font-medium">Program Vaksinasi & Sterilisasi</p>
                          <p className="text-xs text-cream-dark">Bekerjasama dengan dokter hewan lokal</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                          <PawIcon className="text-xl" />
                        </div>
                        <div>
                          <p className="font-medium">Edukasi & Kampanye</p>
                          <p className="text-xs text-cream-dark">Webinar dan kegiatan edukasi di sekolah</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Cat pawprints making a heart shape */}
                  <div className="mt-8 flex justify-center">
                    <img 
                      src="https://images.unsplash.com/photo-1548366086-7f1b76106622?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                      alt="Cat paws forming a heart" 
                      className="rounded-xl"
                    />
                  </div>
                  
                  <div className="mt-8 text-center">
                    <p className="text-lg font-medium italic">
                      "Setiap makhluk berhak mendapatkan kasih sayang dan kehidupan yang layak"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}
