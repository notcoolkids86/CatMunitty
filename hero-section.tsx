import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function HeroSection() {
  const { data: stats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      // Fallback data for initial UI rendering when API not available
      return {
        catsSaved: 250,
        communities: 15,
        totalRaised: 12000000,
        activeVolunteers: 78
      };
    }
  });

  return (
    <section id="beranda" className="relative overflow-hidden">
      {/* Background overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')",
            backgroundPosition: "center",
            backgroundSize: "cover"
          }} 
          className="h-full w-full opacity-20"
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/90 to-dark"></div>
      </div>

      <div className="container mx-auto py-20 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fadeInUp">
            Bersama Peduli Makhluk Jalanan
          </h1>
          
          <p className="text-lg md:text-xl mb-8 text-cream-dark opacity-90 leading-relaxed animate-fadeInUp animate-delay-100">
            Gerakan patungan untuk pangan kucing terlantar. Setiap donasi memberi harapan baru bagi mereka yang tidak bersuara.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animate-delay-200">
            <Button 
              asChild
              size="lg" 
              className="bg-primary hover:bg-primary-dark text-white transition rounded-full px-8 py-3 font-medium text-lg h-auto"
            >
              <Link href="/donate">Donasi Sekarang</Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="bg-transparent border-2 border-primary text-primary hover:bg-primary/10 transition rounded-full px-8 py-3 font-medium text-lg h-auto"
            >
              <Link href="/volunteer">Jadi Relawan</Link>
            </Button>
          </div>
          
          {stats && (
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center animate-fadeInUp animate-delay-300">
              <div className="bg-dark-lighter rounded-lg p-4">
                <p className="text-3xl font-bold text-primary mb-1">{stats.catsSaved}+</p>
                <p className="text-sm text-cream-dark">Kucing Terbantu</p>
              </div>
              
              <div className="bg-dark-lighter rounded-lg p-4">
                <p className="text-3xl font-bold text-primary mb-1">{stats.communities}</p>
                <p className="text-sm text-cream-dark">Komunitas</p>
              </div>
              
              <div className="bg-dark-lighter rounded-lg p-4">
                <p className="text-3xl font-bold text-primary mb-1">Rp {(stats.totalRaised / 1000000).toFixed(0)}jt+</p>
                <p className="text-sm text-cream-dark">Dana Terkumpul</p>
              </div>
              
              <div className="bg-dark-lighter rounded-lg p-4">
                <p className="text-3xl font-bold text-primary mb-1">{stats.activeVolunteers}</p>
                <p className="text-sm text-cream-dark">Relawan Aktif</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
