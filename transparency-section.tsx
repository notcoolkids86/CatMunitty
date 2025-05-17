import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function TransparencySection() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions'],
    queryFn: async () => {
      const res = await fetch('/api/transactions');
      if (!res.ok) throw new Error('Failed to fetch transactions');
      return res.json();
    },
    // Fallback for initial rendering
    placeholderData: [
      {
        id: 1,
        description: 'Pembelian Pangan Kucing 25kg',
        amount: 1250000,
        campaignId: 1,
        category: 'feeding',
        date: new Date('2023-06-15').toISOString()
      },
      {
        id: 2,
        description: 'Vaksinasi 12 Kucing Jalanan',
        amount: 840000,
        campaignId: 2,
        category: 'healthcare',
        date: new Date('2023-06-10').toISOString()
      },
      {
        id: 3,
        description: 'Pembuatan Shelter Mini (3 unit)',
        amount: 650000,
        campaignId: 3,
        category: 'shelter',
        date: new Date('2023-06-05').toISOString()
      },
      {
        id: 4,
        description: 'Perawatan Medis Kucing Sakit',
        amount: 450000,
        campaignId: 1,
        category: 'healthcare',
        date: new Date('2023-06-01').toISOString()
      }
    ]
  });

  // Calculate fund allocation percentages
  const fundAllocation = {
    feeding: 65,
    healthcare: 20,
    shelter: 10,
    operational: 5
  };

  return (
    <section className="py-16">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Transparansi Dana</h2>
          <p className="text-cream-dark max-w-2xl mx-auto">
            Kami berkomitmen pada transparansi penuh. Setiap rupiah yang didonasikan dapat dilacak penggunaannya.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Fund Allocation Chart */}
          <div className="bg-dark-lighter p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-6">Alokasi Dana</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Pangan Kucing</span>
                  <span>{fundAllocation.feeding}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${fundAllocation.feeding}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Perawatan Medis</span>
                  <span>{fundAllocation.healthcare}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${fundAllocation.healthcare}%`, 
                      backgroundColor: "#FFA600" 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Shelter & Perlengkapan</span>
                  <span>{fundAllocation.shelter}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${fundAllocation.shelter}%`, 
                      backgroundColor: "#36D399" 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span>Operasional</span>
                  <span>{fundAllocation.operational}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${fundAllocation.operational}%`, 
                      backgroundColor: "#828282" 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-dark rounded-lg">
              <h4 className="font-bold mb-2">Catatan:</h4>
              <p className="text-cream-dark text-sm">
                Biaya operasional mencakup transportasi relawan, biaya admin pembayaran, dan kebutuhan operasional kampanye.
              </p>
            </div>
          </div>
          
          {/* Recent Transactions */}
          <div className="bg-dark-lighter p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-6">Laporan Penggunaan Dana Terbaru</h3>
            
            <div className="space-y-4">
              {transactions?.map((transaction) => (
                <div key={transaction.id} className="border-b border-dark-medium pb-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{transaction.description}</span>
                    <span className="text-primary">{formatCurrency(transaction.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-cream-dark">
                    <span>
                      {transaction.category === 'feeding' ? 'Pangan Kucing' : 
                       transaction.category === 'healthcare' ? 'Perawatan Medis' : 
                       transaction.category === 'shelter' ? 'Shelter' : transaction.category}
                    </span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline"
              className="mt-6 w-full bg-dark hover:bg-primary/10 hover:text-primary transition border border-dark-medium rounded-lg py-2 text-sm font-medium"
            >
              Lihat Laporan Lengkap
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
