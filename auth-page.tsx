import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema } from "@shared/schema";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PawIcon from "@/components/ui/paw-icon";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Registration form schema
const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak sama",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [location, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);
  
  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      fullName: "",
      phoneNumber: "",
      address: "",
    },
  });
  
  const onLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };
  
  const onRegister = (data: RegisterFormData) => {
    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };
  
  return (
    <>
      <Helmet>
        <title>Masuk / Daftar - Catmunitty</title>
        <meta name="description" content="Masuk atau daftar akun di Catmunitty untuk mulai berdonasi dan menjadi bagian dari komunitas peduli kucing terlantar." />
      </Helmet>

      <Header />
      
      <main className="py-16 bg-dark">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Auth Form */}
              <div className="bg-dark-lighter rounded-xl p-6 md:p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center mb-4">
                    <div className="text-primary w-12 h-12 flex items-center justify-center">
                      <PawIcon className="text-3xl" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold">
                    {activeTab === "login" ? "Masuk ke Akun Anda" : "Daftar Akun Baru"}
                  </h1>
                  <p className="text-cream-dark text-sm mt-2">
                    {activeTab === "login" 
                      ? "Masuk untuk mulai berdonasi dan membantu kucing terlantar" 
                      : "Bergabung dengan komunitas peduli kucing terlantar"
                    }
                  </p>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="login">Masuk</TabsTrigger>
                    <TabsTrigger value="register">Daftar</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username atau Email</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Masukkan username atau email" 
                                  {...field} 
                                  className="bg-dark border border-dark-medium rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input 
                                  type="password" 
                                  placeholder="Masukkan password" 
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
                          className="w-full bg-primary hover:bg-primary-dark"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? "Memproses..." : "Masuk"}
                        </Button>
                      </form>
                    </Form>
                    
                    <div className="text-center mt-4">
                      <p className="text-cream-dark text-sm">
                        Belum punya akun?{" "}
                        <button 
                          onClick={() => setActiveTab("register")} 
                          className="text-primary hover:underline"
                        >
                          Daftar di sini
                        </button>
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nama Lengkap</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Masukkan nama lengkap" 
                                  {...field} 
                                  className="bg-dark border border-dark-medium rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Pilih username" 
                                    {...field} 
                                    className="bg-dark border border-dark-medium rounded-lg"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="email" 
                                    placeholder="Masukkan email" 
                                    {...field} 
                                    className="bg-dark border border-dark-medium rounded-lg"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Buat password" 
                                    {...field} 
                                    className="bg-dark border border-dark-medium rounded-lg"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Konfirmasi Password</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Konfirmasi password" 
                                    {...field} 
                                    className="bg-dark border border-dark-medium rounded-lg"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={registerForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nomor Telepon (Opsional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Masukkan nomor telepon" 
                                  {...field} 
                                  className="bg-dark border border-dark-medium rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={registerForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Alamat (Opsional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Masukkan alamat" 
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
                          className="w-full bg-primary hover:bg-primary-dark"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? "Memproses..." : "Daftar"}
                        </Button>
                      </form>
                    </Form>
                    
                    <div className="text-center mt-4">
                      <p className="text-cream-dark text-sm">
                        Sudah punya akun?{" "}
                        <button 
                          onClick={() => setActiveTab("login")} 
                          className="text-primary hover:underline"
                        >
                          Masuk di sini
                        </button>
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Hero Image and Text */}
              <div className="hidden md:block">
                <div className="rounded-xl overflow-hidden mb-6">
                  <img 
                    src="https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500" 
                    alt="Feeding stray cats" 
                    className="w-full h-auto"
                  />
                </div>
                
                <h2 className="text-2xl font-bold mb-4">Bergabung Dengan Catmunitty</h2>
                <p className="text-cream-dark mb-6">
                  Dengan bergabung, Anda bisa:
                </p>
                
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <div className="text-primary mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <p className="text-cream-dark">Berdonasi untuk kampanye-kampanye yang sedang berjalan</p>
                  </li>
                  
                  <li className="flex gap-3">
                    <div className="text-primary mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <p className="text-cream-dark">Mendaftar sebagai relawan dalam kegiatan kami</p>
                  </li>
                  
                  <li className="flex gap-3">
                    <div className="text-primary mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <p className="text-cream-dark">Memantau riwayat donasi dan aktivitas Anda</p>
                  </li>
                  
                  <li className="flex gap-3">
                    <div className="text-primary mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <p className="text-cream-dark">Menerima update tentang kampanye yang Anda dukung</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
