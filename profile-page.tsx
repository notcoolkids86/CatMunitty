import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency, formatDate } from "@/lib/utils";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Settings, 
  LogOut, 
  Heart, 
  Clock,
  CreditCard
} from "lucide-react";

// Profile update schema
const profileUpdateSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap wajib diisi"),
  email: z.string().email("Email tidak valid"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Get user donations
  const { data: donations } = useQuery({
    queryKey: ['/api/donations/user'],
    queryFn: async () => {
      if (!user) return [];
      const res = await fetch(`/api/donations?userId=${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch donations');
      return res.json();
    },
    enabled: !!user
  });
  
  // Get user volunteer activities
  const { data: volunteerActivities } = useQuery({
    queryKey: ['/api/volunteers/user'],
    queryFn: async () => {
      if (!user) return [];
      const res = await fetch(`/api/volunteers?userId=${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch volunteer activities');
      return res.json();
    },
    enabled: !!user
  });
  
  // Profile update form
  const form = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
      bio: user?.bio || "",
    }
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileUpdateData) => {
      if (!user) throw new Error("User not authenticated");
      const res = await apiRequest("PATCH", `/api/users/${user.id}`, data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Profil berhasil diperbarui",
        description: "Perubahan Anda telah disimpan",
      });
    },
    onError: (error) => {
      toast({
        title: "Gagal memperbarui profil",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const onSubmit = (data: ProfileUpdateData) => {
    updateProfileMutation.mutate(data);
  };
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  if (!user) {
    return null; // This should never happen due to ProtectedRoute
  }
  
  return (
    <>
      <Helmet>
        <title>Profil Saya - Catmunitty</title>
        <meta name="description" content="Kelola profil dan aktivitas Anda di Catmunitty. Pantau donasi, aktivitas relawan, dan pengaturan akun Anda." />
      </Helmet>

      <Header />
      
      <main className="py-16 bg-dark">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            {/* Profile Header */}
            <div className="bg-dark-lighter rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profileImage} alt={user.fullName} />
                  <AvatarFallback className="text-3xl">{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold mb-2">{user.fullName}</h1>
                  <p className="text-cream-dark mb-4">@{user.username}</p>
                  
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="bg-dark px-4 py-2 rounded-lg">
                      <p className="text-xs text-cream-dark">Bergabung sejak</p>
                      <p className="font-medium">{formatDate(user.createdAt)}</p>
                    </div>
                    
                    {donations?.length > 0 && (
                      <div className="bg-dark px-4 py-2 rounded-lg">
                        <p className="text-xs text-cream-dark">Total Donasi</p>
                        <p className="font-medium">{donations.length} Donasi</p>
                      </div>
                    )}
                    
                    {volunteerActivities?.length > 0 && (
                      <div className="bg-dark px-4 py-2 rounded-lg">
                        <p className="text-xs text-cream-dark">Aktivitas Relawan</p>
                        <p className="font-medium">{volunteerActivities.length} Kegiatan</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="gap-2 border-dark-medium hover:bg-dark"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
            
            {/* Profile Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-dark-lighter mb-8">
                <TabsTrigger value="profile" className="gap-2">
                  <User className="h-4 w-4" />
                  Profil
                </TabsTrigger>
                <TabsTrigger value="donations" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Donasi Saya
                </TabsTrigger>
                <TabsTrigger value="activities" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Aktivitas
                </TabsTrigger>
                <TabsTrigger value="settings" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Pengaturan
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <div className="bg-dark-lighter rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6">Informasi Profil</h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama Lengkap</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-dark border border-dark-medium rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-dark border border-dark-medium rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nomor Telepon</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-dark border border-dark-medium rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alamat</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-dark border border-dark-medium rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                className="bg-dark border border-dark-medium rounded-lg"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary-dark"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                      </Button>
                    </form>
                  </Form>
                </div>
              </TabsContent>
              
              <TabsContent value="donations">
                <div className="bg-dark-lighter rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6">Donasi Saya</h2>
                  
                  {donations && donations.length > 0 ? (
                    <div className="space-y-4">
                      {donations.map((donation) => (
                        <div key={donation.id} className="bg-dark rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold">{donation.campaignTitle || "Kampanye"}</p>
                              <p className="text-sm text-cream-dark">{formatDate(donation.createdAt)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-primary font-medium">{formatCurrency(donation.amount)}</p>
                              <p className="text-sm">
                                {donation.paymentStatus === "completed" ? (
                                  <span className="text-green-500">Selesai</span>
                                ) : donation.paymentStatus === "pending" ? (
                                  <span className="text-amber-500">Menunggu</span>
                                ) : (
                                  <span>{donation.paymentStatus}</span>
                                )}
                              </p>
                            </div>
                          </div>
                          {donation.message && (
                            <div className="mt-2 p-3 bg-dark-medium rounded text-sm text-cream-dark italic">
                              "{donation.message}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard className="h-12 w-12 mx-auto mb-4 text-cream-dark/50" />
                      <h3 className="text-lg font-bold mb-2">Belum Ada Donasi</h3>
                      <p className="text-cream-dark mb-6">
                        Anda belum melakukan donasi. Donasi sekarang untuk membantu kucing terlantar.
                      </p>
                      <Button asChild className="bg-primary hover:bg-primary-dark">
                        <a href="/donate">Donasi Sekarang</a>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="activities">
                <div className="bg-dark-lighter rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6">Aktivitas Relawan</h2>
                  
                  {volunteerActivities && volunteerActivities.length > 0 ? (
                    <div className="space-y-4">
                      {volunteerActivities.map((activity) => (
                        <div key={activity.id} className="bg-dark rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold">
                                {activity.areaOfInterest === 'feeding' ? 'Feeding Program' : 
                                 activity.areaOfInterest === 'healthcare' ? 'Perawatan Medis' : 
                                 activity.areaOfInterest === 'campaign' ? 'Kampanye & Edukasi' : 
                                 activity.areaOfInterest === 'fundraising' ? 'Fundraising' : 
                                 activity.areaOfInterest}
                              </p>
                              <p className="text-sm text-cream-dark">{formatDate(activity.createdAt)}</p>
                            </div>
                            <div>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                activity.status === "approved" ? "bg-green-500/20 text-green-500" :
                                activity.status === "pending" ? "bg-amber-500/20 text-amber-500" :
                                "bg-blue-500/20 text-blue-500"
                              }`}>
                                {activity.status === "approved" ? "Disetujui" :
                                 activity.status === "pending" ? "Menunggu" :
                                 activity.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-cream-dark/50" />
                      <h3 className="text-lg font-bold mb-2">Belum Ada Aktivitas</h3>
                      <p className="text-cream-dark mb-6">
                        Anda belum mendaftar sebagai relawan. Gabung sekarang untuk membantu kucing terlantar.
                      </p>
                      <Button asChild className="bg-primary hover:bg-primary-dark">
                        <a href="/volunteer">Daftar Relawan</a>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="bg-dark-lighter rounded-xl p-6">
                  <h2 className="text-xl font-bold mb-6">Pengaturan Akun</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold mb-3">Ubah Password</h3>
                      <div className="space-y-4">
                        <Input 
                          type="password" 
                          placeholder="Password saat ini" 
                          className="bg-dark border border-dark-medium rounded-lg"
                        />
                        <Input 
                          type="password" 
                          placeholder="Password baru" 
                          className="bg-dark border border-dark-medium rounded-lg"
                        />
                        <Input 
                          type="password" 
                          placeholder="Konfirmasi password baru" 
                          className="bg-dark border border-dark-medium rounded-lg"
                        />
                        <Button className="bg-primary hover:bg-primary-dark">
                          Ubah Password
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border-t border-dark-medium pt-6">
                      <h3 className="font-bold mb-3 text-destructive">Zona Berbahaya</h3>
                      <p className="text-cream-dark text-sm mb-4">
                        Tindakan ini tidak dapat dibatalkan. Akun Anda akan dihapus secara permanen.
                      </p>
                      <Button variant="destructive">
                        Hapus Akun
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
