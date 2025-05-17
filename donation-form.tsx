import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useEffect } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";

// Initialize stripe outside of component
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface DonationFormProps {
  campaignId?: number;
}

// Donation form schema
const donationFormSchema = z.object({
  amount: z.number().min(10000, "Minimum donasi Rp 10.000"),
  donorName: z.string().min(2, "Nama wajib diisi"),
  donorEmail: z.string().email("Email tidak valid"),
  message: z.string().optional(),
  anonymous: z.boolean().default(false)
});

type DonationFormData = z.infer<typeof donationFormSchema>;

// Preset donation amounts
const PRESET_AMOUNTS = [10000, 25000, 50000, 100000, 200000];

function DonationForm({ campaignId }: DonationFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(PRESET_AMOUNTS[0]);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: PRESET_AMOUNTS[0],
      donorName: user?.fullName || "",
      donorEmail: user?.email || "",
      message: "",
      anonymous: false
    }
  });
  
  const createDonationMutation = useMutation({
    mutationFn: async (data: DonationFormData) => {
      const payload = {
        ...data,
        campaignId: campaignId || 0,
        userId: user?.id
      };
      
      const res = await apiRequest("POST", "/api/donations", payload);
      return res.json();
    },
    onSuccess: (data) => {
      if (data.paymentIntent?.clientSecret) {
        setClientSecret(data.paymentIntent.clientSecret);
      } else {
        toast({
          title: "Donasi berhasil!",
          description: "Terima kasih atas donasi Anda untuk kucing-kucing jalanan.",
        });
        // Reset form
        form.reset();
        setSelectedAmount(PRESET_AMOUNTS[0]);
        setCustomAmount("");
      }
    },
    onError: (error) => {
      toast({
        title: "Donasi gagal",
        description: error.message || "Silakan coba lagi",
        variant: "destructive"
      });
    }
  });

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    form.setValue("amount", amount);
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    
    const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
    if (!isNaN(numericValue)) {
      form.setValue("amount", numericValue);
    }
  };

  const onSubmit = (data: DonationFormData) => {
    createDonationMutation.mutate(data);
  };

  // If we have a client secret, render the payment form
  if (clientSecret) {
    return (
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentFormContent />
      </Elements>
    );
  }

  return (
    <div className="bg-dark rounded-xl p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-6 text-center">Donasi Sekarang</h3>
      
      <div className="grid grid-cols-3 gap-3 mb-6">
        {PRESET_AMOUNTS.map((amount) => (
          <Button
            key={amount}
            type="button"
            variant={selectedAmount === amount ? "default" : "outline"}
            className={`${
              selectedAmount === amount 
                ? "bg-primary text-white" 
                : "bg-dark-lighter hover:bg-primary hover:text-white"
            } transition rounded-lg py-3 text-center`}
            onClick={() => handleAmountSelect(amount)}
          >
            {formatCurrency(amount)}
          </Button>
        ))}
        <Button
          type="button"
          variant={selectedAmount === null ? "default" : "outline"}
          className={`${
            selectedAmount === null 
              ? "bg-primary text-white" 
              : "bg-dark-lighter hover:bg-primary hover:text-white"
          } transition rounded-lg py-3 text-center`}
          onClick={() => {
            setSelectedAmount(null);
            setCustomAmount(customAmount || "");
          }}
        >
          Custom
        </Button>
      </div>
      
      {selectedAmount === null && (
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Masukkan jumlah donasi"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            className="w-full bg-dark-lighter border border-dark-medium rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition"
          />
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="donorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Lengkap</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Masukkan nama lengkap" 
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
            name="donorEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Masukkan email" 
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
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pesan (Opsional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tinggalkan pesan dukungan" 
                    {...field} 
                    className="w-full bg-dark-lighter border border-dark-medium rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition h-24 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="anonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Donasi sebagai Anonim</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark transition rounded-lg py-3 font-medium"
            disabled={createDonationMutation.isPending}
          >
            {createDonationMutation.isPending ? "Memproses..." : "Lanjutkan ke Pembayaran"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

function PaymentFormContent() {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + "/donation-success",
      },
    });

    if (error) {
      toast({
        title: "Pembayaran Gagal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-dark rounded-xl p-6 md:p-8">
      <h3 className="text-2xl font-bold mb-6 text-center">Pembayaran Donasi</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement />
        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-primary-dark transition rounded-lg py-3 font-medium"
          disabled={!stripe}
        >
          Bayar Sekarang
        </Button>
      </form>
    </div>
  );
}

export default function DonationFormWrapper({ campaignId }: DonationFormProps) {
  return (
    <div className="max-w-lg mx-auto">
      <DonationForm campaignId={campaignId} />
    </div>
  );
}
