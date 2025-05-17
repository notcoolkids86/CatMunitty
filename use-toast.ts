import { Toast, useToast as useToastOriginal } from "@/components/ui/use-toast";

// Re-export with the same API
export const useToast = useToastOriginal;
export type { Toast };
