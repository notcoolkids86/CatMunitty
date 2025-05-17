import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

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
import { Checkbox } from "@/components/ui/checkbox";

// Volunteer form schema
const volunteerFormSchema = z.object({
  firstName: z.string().min(2, "Nama depan wajib diisi"),
  lastName: z.string().min(1, "Nama belakang wajib diisi"),
  email: z.string().email("Email tidak valid"),
  phoneNumber: z.string().min(10, "Nomor telepon tidak valid"),
  address: z.string().min(5, "Alamat wajib diisi"),
  areaOfInterest: z.string({
    required_error: "Pilih area minat Anda"
  }),
  experience: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "Anda harus menyetujui syarat dan ketentuan"
  })
});

type VolunteerFormData = z.infer<typeof volunteerFormSchema>;

export default function VolunteerForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      firstName: user?.fullName?.split(' ')[0] || "",
      lastName: user?.fullName?.split(' ').slice(1).join(' ') || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
      areaOfInterest: "",
      experience: "",
      termsAccepted: false
    }
  });
  
  const volunteerMutation = useMutation({
    mutationFn: async (data: VolunteerFormData) => {
      // Remove terms field that's not part of the API schema
      const { termsAccepted, ...volunteerData } = data;
      
      const payload = {
        ...volunteerData,
        userId: user?.id
      };
      
      const res = await apiRequest("POST", "/api/volunteers", payload);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Pendaftaran berhasil!",
        description: "Terima kasih telah mendaftar sebagai relawan. Kami akan menghubungi Anda segera.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Pendaftaran gagal",
        description: error.message || "Silakan coba lagi",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: VolunteerFormData) => {
    volunteerMutation.mutate(data);
  };

  return (
    <div className="bg-dark bg-opacity-80 backdrop-blur-sm rounded-xl p-6 md:p-8">
      <h3 className="text-xl font-bold mb-6">Formulir Pendaftaran Relawan</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Depan</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nama depan" 
                      {...field} 
                      className="bg-dark-lighter border border-dark-medium rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Belakang</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nama belakang" 
                      {...field} 
                      className="bg-dark-lighter border border-dark-medium rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="contoh@email.com" 
                    type="email" 
                    {...field} 
                    className="bg-dark-lighter border border-dark-medium rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition"
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
                <FormLabel>No. Telepon</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="08123456789" 
                    type="tel" 
                    {...field} 
                    className="bg-dark-lighter border border-dark-medium rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition"
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
                    placeholder="Alamat lengkap" 
                    {...field} 
                    className="bg-dark-lighter border border-dark-medium rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="areaOfInterest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Area Minat</FormLabel>
                <FormControl>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-dark-lighter border border-dark-medium rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition">
                      <SelectValue placeholder="Pilih area minat" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-lighter border-dark-medium">
                      <SelectItem value="feeding">Feeding Program</SelectItem>
                      <SelectItem value="healthcare">Perawatan Medis</SelectItem>
                      <SelectItem value="campaign">Kampanye & Edukasi</SelectItem>
                      <SelectItem value="fundraising">Fundraising</SelectItem>
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
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pengalaman dengan Kucing</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Ceritakan pengalaman Anda dengan kucing" 
                    {...field} 
                    className="bg-dark-lighter border border-dark-medium rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition h-24 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Saya bersedia mengikuti aturan dan ketentuan yang berlaku</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark transition rounded-lg py-3 font-medium mt-4"
            disabled={volunteerMutation.isPending}
          >
            {volunteerMutation.isPending ? "Mengirim..." : "Kirim Pendaftaran"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
