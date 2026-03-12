import { useMutation } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Simulated hook since this is a frontend-only app
export function useSubmitContact() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { name: string; email: string; subject: string; message: string }) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Form submitted:", data);
      return { success: true };
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
