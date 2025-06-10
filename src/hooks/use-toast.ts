
import * as React from "react"

// This file is kept for backwards compatibility but now just re-exports from sonner
export { toast } from "sonner";

// Placeholder useToast for any existing imports that expect it
export const useToast = () => {
  return {
    toast: (props: any) => {
      console.warn("useToast is deprecated, use toast from sonner directly");
      return { id: "", dismiss: () => {}, update: () => {} };
    },
    dismiss: () => {},
  };
};
