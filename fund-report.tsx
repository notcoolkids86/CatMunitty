import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
  PieChart as PieChartIcon,
  BarChart2,
  LineChart as LineChartIcon 
} from "lucide-react";

// Tipe untuk data transaksi
type Transaction = {
  id: number;
  description: string;
  amount: number;
  campaignId?: number;
  category: "income" | "expense";
  date: string;
  campaignTitle?: string;
};

// Tipe untuk data campaign
type Campaign = {
  id: number;
  title: string;
};

// Tipe untuk data analisis
type AnalysisPeriod = "week" | "month" | "year" | "all";
type ChartType = "bar" | "line" | "pie";

// Fungsi untuk memformat data untuk grafik
const formatTransactionsForChart = (
  transactions: Transaction[], 
  period: AnalysisPeriod
) => {
  if (!transactions.length) return [];

  // Kelompokkan berdasarkan periode
  const periodFormat: { [key: string]: string } = {
    week: "EEE", // day of week
    month: "dd MMM", // day of month
    year: "MMM", // month
    all: "MMM yyyy", // month and year
  };

  // Kelompokkan transaksi berdasarkan tanggal
  const grouped = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const formattedDate = formatDate(date, periodFormat[period]);
    
    if (!acc[formattedDate]) {
      acc[formattedDate] = {
        date: formattedDate,
        income: 0,
        expense: 0,
        balance: 0,
      };
    }
    
    if (transaction.category === "income") {
      acc[formattedDate].income += transaction.amount;
    } else {
      acc[formattedDate].expense += Math.abs(transaction.amount);
    }
    
    acc[formattedDate].balance = acc[formattedDate].income - acc[formattedDate].expense;
    
    return acc;
  }, {} as Record<string, { date: string; income: number; expense: number; balance: number }>);
  
  // Konversi ke array untuk grafik
  return Object.values(grouped);
};

// Fungsi untuk memformat data untuk pie chart
const formatTransactionsForPieChart = (transactions: Transaction[]) => {
  // Untuk income berdasarkan campaign
  const incomeBySource = transactions
    .filter(t => t.category === "income")
    .reduce((acc, t) => {
      // Gunakan campaignTitle jika tersedia, jika tidak gunakan "Donasi Umum"
      const source = t.campaignTitle || "Donasi Umum";
      if (!acc[source]) acc[source] = 0;
      acc[source] += t.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomeData = Object.entries(incomeBySource)
    .sort((a, b) => b[1] - a[1]) // Urutkan dari terbesar
    .map(([name, value]) => ({ name, value }));

  // Untuk expense berdasarkan campaign
  const expenseBySource = transactions
    .filter(t => t.category === "expense")
    .reduce((acc, t) => {
      // Gunakan campaignTitle jika tersedia, jika tidak gunakan "Operasional Umum"
      const source = t.campaignTitle || "Operasional Umum";
      if (!acc[source]) acc[source] = 0;
      acc[source] += Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const expenseData = Object.entries(expenseBySource)
    .sort((a, b) => b[1] - a[1]) // Urutkan dari terbesar
    .map(([name, value]) => ({ name, value }));

  return { incomeData, expenseData };
};

// Warna untuk grafik
const COLORS = ["#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0", "#118AB2", "#073B4C"];

export default function FundReport() {
  const [period, setPeriod] = useState<AnalysisPeriod>("month");
  const [campaign, setCampaign] = useState<string>("all");
  const [chartType, setChartType] = useState<ChartType>("bar");
  
  // Fetch transactions
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    queryFn: async () => {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
  });
  
  // Fetch campaigns for filter
  const { data: campaigns = [], isLoading: isLoadingCampaigns } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns", "list"],
    queryFn: async () => {
      const res = await fetch("/api/campaigns?list=true");
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      const data = await res.json();
      console.log("Campaign list data:", data);
      return Array.isArray(data) ? data : [];
    },
  });
  
  // Filter transactions berdasarkan kampanye yang dipilih
  const filteredTransactions = transactions.filter(t => {
    if (campaign === "all") return true;
    return t.campaignId?.toString() === campaign;
  });
  
  // Persiapkan data untuk summary cards
  const totalIncome = filteredTransactions
    .filter(t => t.category === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = filteredTransactions
    .filter(t => t.category === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const balance = totalIncome - totalExpense;
  
  // Data untuk grafik
  const chartData = formatTransactionsForChart(filteredTransactions, period);
  const { incomeData, expenseData } = formatTransactionsForPieChart(filteredTransactions);
  
  // Transaksi terbaru (10 terakhir)
  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);
  
  // Untuk membandingkan dengan periode sebelumnya
  const now = new Date();
  const previousPeriodEnd = new Date();
  
  // Set rentang waktu untuk periode sebelumnya
  if (period === "week") {
    previousPeriodEnd.setDate(now.getDate() - 7);
  } else if (period === "month") {
    previousPeriodEnd.setMonth(now.getMonth() - 1);
  } else if (period === "year") {
    previousPeriodEnd.setFullYear(now.getFullYear() - 1);
  }
  
  // Filter transaksi untuk periode saat ini
  const currentPeriodTransactions = filteredTransactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= previousPeriodEnd && transactionDate <= now;
  });
  
  // Hitung total untuk periode saat ini
  const currentPeriodIncome = currentPeriodTransactions
    .filter(t => t.category === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const currentPeriodExpense = currentPeriodTransactions
    .filter(t => t.category === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Filter transaksi untuk periode sebelumnya
  const previousPeriodStart = new Date(previousPeriodEnd);
  if (period === "week") {
    previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
  } else if (period === "month") {
    previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
  } else if (period === "year") {
    previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1);
  }
  
  const previousPeriodTransactions = filteredTransactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= previousPeriodStart && transactionDate < previousPeriodEnd;
  });
  
  // Hitung total untuk periode sebelumnya
  const previousPeriodIncome = previousPeriodTransactions
    .filter(t => t.category === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const previousPeriodExpense = previousPeriodTransactions
    .filter(t => t.category === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Hitung persentase perubahan
  const incomeChangePercent = previousPeriodIncome 
    ? ((currentPeriodIncome - previousPeriodIncome) / previousPeriodIncome) * 100 
    : 100;
    
  const expenseChangePercent = previousPeriodExpense 
    ? ((currentPeriodExpense - previousPeriodExpense) / previousPeriodExpense) * 100 
    : 100;
  
  // Tampilkan loading state jika data masih diambil
  if (isLoadingTransactions || isLoadingCampaigns) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-medium">Memuat data laporan...</h3>
        <p className="text-cream-dark mt-2">Mohon tunggu sebentar</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Laporan Transparansi Dana</h2>
          <p className="text-cream-dark">
            Laporan lengkap pengelolaan dana untuk kucing jalanan
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={(value) => setPeriod(value as AnalysisPeriod)}>
            <SelectTrigger className="w-[140px] bg-dark-lighter border-dark-medium">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Periode" />
            </SelectTrigger>
            <SelectContent className="bg-dark-lighter border-dark-medium">
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
              <SelectItem value="all">Semua</SelectItem>
            </SelectContent>
          </Select>

          <Select value={campaign} onValueChange={setCampaign}>
            <SelectTrigger className="w-[180px] bg-dark-lighter border-dark-medium">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Kampanye" />
            </SelectTrigger>
            <SelectContent className="bg-dark-lighter border-dark-medium">
              <SelectItem value="all">Semua Kampanye</SelectItem>
              {campaigns.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 border-dark-medium">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card className="bg-dark-lighter border-dark-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Total Pemasukan</span>
              <div className="bg-primary/20 p-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </CardTitle>
            <CardDescription>Periode {period === "week" ? "Mingguan" : period === "month" ? "Bulanan" : period === "year" ? "Tahunan" : "Keseluruhan"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            <div className="flex items-center mt-2 text-sm">
              {incomeChangePercent > 0 ? (
                <div className="flex items-center text-green-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+{incomeChangePercent.toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>{incomeChangePercent.toFixed(1)}%</span>
                </div>
              )}
              <span className="text-cream-dark ml-2">dibanding periode sebelumnya</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-lighter border-dark-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Total Pengeluaran</span>
              <div className="bg-destructive/20 p-2 rounded-full">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
            </CardTitle>
            <CardDescription>Periode {period === "week" ? "Mingguan" : period === "month" ? "Bulanan" : period === "year" ? "Tahunan" : "Keseluruhan"}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpense)}</div>
            <div className="flex items-center mt-2 text-sm">
              {expenseChangePercent > 0 ? (
                <div className="flex items-center text-red-500">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+{expenseChangePercent.toFixed(1)}%</span>
                </div>
              ) : (
                <div className="flex items-center text-green-500">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>{expenseChangePercent.toFixed(1)}%</span>
                </div>
              )}
              <span className="text-cream-dark ml-2">dibanding periode sebelumnya</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-lighter border-dark-medium">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Saldo Akhir</span>
              <div className="bg-blue-500/20 p-2 rounded-full">
                <DollarSign className="h-5 w-5 text-blue-500" />
              </div>
            </CardTitle>
            <CardDescription>Total Dana Tersedia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
            <div className="text-sm text-cream-dark mt-2">
              Dana yang dapat digunakan untuk kampanye yang sedang berjalan
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-dark-lighter border-dark-medium col-span-1 lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Analisis Keuangan</CardTitle>
              <CardDescription>
                Perbandingan pemasukan dan pengeluaran {period === "week" ? "per hari" : period === "month" ? "per hari" : period === "year" ? "per bulan" : "per bulan"}
              </CardDescription>
            </div>
            <div className="flex bg-dark rounded-md overflow-hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-2 ${chartType === 'bar' ? 'bg-dark-medium' : ''}`}
                onClick={() => setChartType("bar")}
              >
                <BarChart2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-2 ${chartType === 'line' ? 'bg-dark-medium' : ''}`}
                onClick={() => setChartType("line")}
              >
                <LineChartIcon className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`p-2 ${chartType === 'pie' ? 'bg-dark-medium' : ''}`}
                onClick={() => setChartType("pie")}
              >
                <PieChartIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              {chartType === "bar" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value as number)}
                      contentStyle={{ backgroundColor: "#1e1e1e", borderColor: "#333", borderRadius: "8px" }}
                    />
                    <Legend />
                    <Bar dataKey="income" name="Pemasukan" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Pengeluaran" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {chartType === "line" && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value as number)}
                      contentStyle={{ backgroundColor: "#1e1e1e", borderColor: "#333", borderRadius: "8px" }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="income" name="Pemasukan" stroke="#4ECDC4" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="expense" name="Pengeluaran" stroke="#FF6B6B" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="balance" name="Saldo" stroke="#FFD166" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {chartType === "pie" && (
                <div className="grid grid-cols-2 h-full">
                  <div>
                    <h4 className="text-center mb-2 font-medium">Pemasukan</h4>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={incomeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {incomeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="text-center mb-2 font-medium">Pengeluaran</h4>
                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-dark-lighter border-dark-medium">
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
            <CardDescription>10 transaksi terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[376px] overflow-y-auto pr-2">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex justify-between items-start border-b border-dark-medium pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.category === "income" 
                        ? "bg-green-500/20 text-green-500"
                        : "bg-red-500/20 text-red-500"
                    }`}>
                      {transaction.category === "income" ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{transaction.description}</p>
                      <div className="flex flex-col">
                        <p className="text-cream-dark text-xs">{formatDate(transaction.date)}</p>
                        {transaction.campaignTitle && (
                          <p className="text-cream-dark text-xs mt-1">
                            <span className="px-1.5 py-0.5 bg-dark-medium rounded-sm mr-1">
                              {transaction.campaignTitle}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`font-medium ${
                    transaction.category === "income" 
                      ? "text-green-500" 
                      : "text-red-500"
                  }`}>
                    {transaction.category === "income" ? "+" : "-"}
                    {formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              ))}

              {recentTransactions.length === 0 && (
                <div className="text-center py-8 text-cream-dark">
                  Tidak ada data transaksi untuk ditampilkan
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Transaksi */}
      <Card className="bg-dark-lighter border-dark-medium">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Semua Transaksi</CardTitle>
              <CardDescription>Daftar lengkap transaksi keuangan</CardDescription>
            </div>
            <Button variant="outline" className="gap-2 border-dark-medium">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-medium">
                  <th className="text-left py-3 px-4">Tanggal</th>
                  <th className="text-left py-3 px-4">Deskripsi</th>
                  <th className="text-left py-3 px-4">Kampanye</th>
                  <th className="text-left py-3 px-4">Kategori</th>
                  <th className="text-right py-3 px-4">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((transaction) => {
                      return (
                        <tr key={transaction.id} className="border-b border-dark-medium hover:bg-dark-medium">
                          <td className="py-3 px-4">{formatDate(transaction.date)}</td>
                          <td className="py-3 px-4">{transaction.description}</td>
                          <td className="py-3 px-4">{transaction.campaignTitle || "-"}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              transaction.category === "income" 
                                ? "bg-green-500/20 text-green-500" 
                                : "bg-red-500/20 text-red-500"
                            }`}>
                              {transaction.category === "income" ? "Pemasukan" : "Pengeluaran"}
                            </span>
                          </td>
                          <td className={`py-3 px-4 text-right font-medium ${
                            transaction.category === "income" 
                              ? "text-green-500" 
                              : "text-red-500"
                          }`}>
                            {transaction.category === "income" ? "+" : "-"}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-cream-dark">
                      Tidak ada data transaksi untuk ditampilkan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}