import { useQuery } from "@tanstack/react-query";
import { SuccessStory } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { CalendarDays } from "lucide-react";
import { Link } from "wouter";

export default function SuccessStories() {
  const { data: stories, isLoading } = useQuery<SuccessStory[]>({
    queryKey: ['/api/success-stories'],
    queryFn: async () => {
      const res = await fetch('/api/success-stories');
      if (!res.ok) throw new Error('Failed to fetch success stories');
      return res.json();
    },
    // Fallback for initial rendering
    placeholderData: [
      {
        id: 1,
        title: 'Si Putih yang Kini Sehat',
        description: 'Si Putih ditemukan dalam kondisi kurus dan sakit di dekat pasar. Berkat donasi yang terkumpul, kini ia mendapat perawatan dan pangan yang cukup.',
        imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300',
        date: new Date('2023-02-15').toISOString(),
        campaignId: 1
      },
      {
        id: 2,
        title: 'Program Shelter di Unesa',
        description: 'Berhasil membangun 3 shelter mini untuk kucing jalanan di sekitar kampus Unesa, menyediakan tempat yang aman dan nyaman.',
        imageUrl: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
        date: new Date('2023-04-10').toISOString(),
        campaignId: 2
      },
      {
        id: 3,
        title: 'Program Feeding Rutin',
        description: 'Program feeding rutin untuk 50+ kucing jalanan di 5 titik Surabaya berhasil dilaksanakan setiap minggu berkat donasi dari para donatur.',
        imageUrl: 'https://images.unsplash.com/photo-1488740304459-45c4277e7daf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300',
        date: new Date('2023-06-01').toISOString(),
        campaignId: 3
      }
    ]
  });

  return (
    <section className="py-16 bg-dark-lighter">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Kisah Sukses</h2>
          <p className="text-cream-dark max-w-2xl mx-auto">
            Cerita inspiratif tentang kucing jalanan yang telah terbantu berkat kontribusi dari para donatur dan relawan.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories?.map((story) => (
            <div key={story.id} className="bg-dark rounded-xl overflow-hidden">
              <img 
                src={story.imageUrl} 
                alt={story.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{story.title}</h3>
                <p className="text-cream-dark text-sm mb-4">
                  {story.description}
                </p>
                <div className="flex items-center text-sm text-cream-dark">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>{formatDate(story.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline"
            className="bg-transparent border-2 border-primary text-primary hover:bg-primary/10 transition rounded-full px-8 py-3 font-medium"
          >
            <Link href="/success-stories">Lihat Semua Kisah Sukses</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
