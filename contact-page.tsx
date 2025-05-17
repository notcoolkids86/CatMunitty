import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Instagram, Facebook, Twitter, CheckCircle2 } from "lucide-react";

// Contact form schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  subject: z.string().min(1, "Pilih subjek pesan"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    }
  });
  
  const onSubmit = (data: ContactFormData) => {
    // In a real application, you would send this data to your backend
    console.log("Form data:", data);
    
    // Show success message
    toast({
      title: "Pesan terkirim!",
      description: "Terima kasih telah menghubungi kami. Kami akan segera merespons.",
    });
    
    // Show success state
    setIsSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Kontak Kami - Catmunitty</title>
        <meta name="description" content="Hubungi tim Catmunitty untuk pertanyaan, kolaborasi, atau informasi lebih lanjut tentang program peduli kucing terlantar." />
      </Helmet>

      <Header />
      
      <main className="py-16">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold mb-4">Hubungi Kami</h1>
              <p className="text-cream-dark">
                Punya pertanyaan atau ingin berkolaborasi? Jangan ragu untuk menghubungi tim Catmunitty.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-xl font-bold mb-6">Informasi Kontak</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="text-primary text-xl mt-1">
                      <MapPin />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Alamat</h3>
                      <p className="text-cream-dark">Jl. Ketintang, Kampus Unesa, Surabaya, Jawa Timur</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="text-primary text-xl mt-1">
                      <Mail />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Email</h3>
                      <p className="text-cream-dark">info@catmunitty.org</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="text-primary text-xl mt-1">
                      <Phone />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">Telepon/WhatsApp</h3>
                      <p className="text-cream-dark">+62 812-3456-7890</p>
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-bold mb-4 mt-8">Sosial Media</h2>
                <div className="flex gap-4">
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 bg-dark-lighter rounded-full flex items-center justify-center text-cream-DEFAULT hover:bg-primary hover:text-white transition"
                    aria-label="Instagram"
                  >
                    <Instagram />
                  </a>
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 bg-dark-lighter rounded-full flex items-center justify-center text-cream-DEFAULT hover:bg-primary hover:text-white transition"
                    aria-label="Facebook"
                  >
                    <Facebook />
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 bg-dark-lighter rounded-full flex items-center justify-center text-cream-DEFAULT hover:bg-primary hover:text-white transition"
                    aria-label="Twitter"
                  >
                    <Twitter />
                  </a>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">Lokasi</h2>
                  <div className="h-64 bg-dark-lighter rounded-xl overflow-hidden">
                    {/* This would be a real map in implementation */}
                    <div className="w-full h-full bg-dark-lighter flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="text-primary text-4xl mb-3" />
                        <p className="text-cream-dark">Kampus Unesa, Ketintang, Surabaya</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-dark-lighter rounded-xl p-6">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-bold mb-2">Pesan Terkirim!</h3>
                    <p className="text-cream-dark mb-6">
                      Terima kasih telah menghubungi kami. Tim Catmunitty akan segera merespons pesan Anda.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsSubmitted(false);
                        form.reset();
                      }}
                    >
                      Kirim Pesan Lain
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-6">Kirim Pesan</h2>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nama Lengkap</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Masukkan nama lengkap" 
                                  {...field} 
                                  className="bg-dark border border-dark-medium rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition"
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
                                  placeholder="Masukkan email" 
                                  type="email" 
                                  {...field} 
                                  className="bg-dark border border-dark-medium rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subjek</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="bg-dark border border-dark-medium rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition">
                                    <SelectValue placeholder="Pilih subjek pesan" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-dark-lighter border-dark-medium">
                                    <SelectItem value="general">Pertanyaan Umum</SelectItem>
                                    <SelectItem value="donation">Donasi</SelectItem>
                                    <SelectItem value="volunteer">Relawan</SelectItem>
                                    <SelectItem value="collaboration">Kolaborasi</SelectItem>
                                    <SelectItem value="other">Lainnya</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pesan</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tulis pesan Anda di sini" 
                                  {...field} 
                                  className="bg-dark border border-dark-medium rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition h-32 resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary-dark transition rounded-lg py-3 font-medium"
                        >
                          Kirim Pesan
                        </Button>
                      </form>
                    </Form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}
