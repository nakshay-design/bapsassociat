import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";

export function useSubmitContact() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { name: string; email: string; subject: string; message: string }) => {

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to send");
      }

      return res.json();
    },

    onSuccess: () => {
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for reaching out. A representative will contact you shortly.",
      });
    },

    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error sending your message. Please try again later.",
        variant: "destructive"
      });
    }
  });
}