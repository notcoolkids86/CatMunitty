import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@shared/schema";
import { Link, useLocation } from "wouter";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CampaignCard from "@/components/campaign/campaign-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export default function CampaignsPage() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  
  const [page, setPage] = useState<number>(parseInt(searchParams.get('page') || '1'));
  const [category, setCategory] = useState<string>(searchParams.get('category') || '');
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [limit] = useState<number>(9);
  
  // Update URL when filters change
  const updateFilters = (newFilters: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams);
    
    // Update params
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    
    // Set page to 1 if filters change
    if (!('page' in newFilters)) {
      params.set('page', '1');
      setPage(1);
    }
    
    // Update URL
    setLocation(`/campaigns?${params.toString()}`);
  };
  
  // Fetch campaigns with filters
  const { data, isLoading, isError } = useQuery<{ campaigns: Campaign[], total: number }>({
    queryKey: ['/api/campaigns', { page, limit, category, search }],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      if (category) queryParams.append('category', category);
      if (search) queryParams.append('search', search);
      
      const res = await fetch(`/api/campaigns?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch campaigns');
      return res.json();
    }
  });
  
  const totalPages = data ? Math.ceil(data.total / limit) : 0;
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search });
  };
  
  // Handle category change
  const handleCategoryChange = (value: string) => {
    // Jika memilih "all", kosongkan kategori filter
    const categoryValue = value === "all" ? "" : value;
    setCategory(categoryValue);
    updateFilters({ category: categoryValue });
  };
  
  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    updateFilters({ page: newPage });
  };
  
  return (
    <>
      <Helmet>
        <title>Kampanye - Catmunitty</title>
        <meta name="description" content="Temukan kampanye donasi untuk membantu kucing jalanan. Berdonasi untuk makanan, perawatan medis, dan shelter bagi kucing terlantar." />
      </Helmet>

      <Header />
      
      <main className="py-12 md:py-16">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Kampanye Peduli Kucing</h1>
            <p className="text-cream-dark opacity-90">
              Temukan kampanye-kampanye untuk membantu kucing terlantar dan berikan dukungan Anda untuk mereka yang membutuhkan.
            </p>
          </div>
          
          {/* Search and Filter */}
          <div className="bg-dark-lighter rounded-xl p-6 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearchSubmit} className="flex-1">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Cari kampanye..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-dark border border-dark-medium rounded-lg pr-10 focus:border-primary"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    variant="ghost" 
                    className="absolute right-0 top-0 h-full"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </form>
              
              <div className="flex gap-3">
                <div className="w-48">
                  <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="bg-dark border border-dark-medium rounded-lg focus:border-primary">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="Kategori" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-dark-lighter border-dark-medium">
                      <SelectItem value="all">Semua</SelectItem>
                      <SelectItem value="feeding">Pangan</SelectItem>
                      <SelectItem value="healthcare">Kesehatan</SelectItem>
                      <SelectItem value="shelter">Shelter</SelectItem>
                      <SelectItem value="sterilization">Sterilisasi</SelectItem>
                      <SelectItem value="education">Edukasi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Campaign Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-2 text-cream-dark">Memuat kampanye...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-destructive">Error saat memuat kampanye. Silakan coba lagi.</p>
            </div>
          ) : data?.campaigns.length === 0 ? (
            <div className="text-center py-12 bg-dark-lighter rounded-xl">
              <div className="mb-4 text-7xl">🐱</div>
              <h3 className="text-xl font-bold mb-2">Belum ada kampanye yang ditemukan</h3>
              <p className="text-cream-dark mb-6">
                {search ? `Tidak ada hasil untuk pencarian "${search}"` : "Belum ada kampanye dalam kategori ini"}
              </p>
              <Button 
                variant="outline" 
                className="border-primary text-primary hover:bg-primary/10"
                onClick={() => {
                  setSearch('');
                  setCategory('');
                  updateFilters({ search: '', category: '', page: 1 });
                }}
              >
                Hapus Filter
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.campaigns.map((campaign) => (
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
          )}
        </div>
      </main>
      
      <Footer />
    </>
  );
}
