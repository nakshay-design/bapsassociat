import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSubmitContact } from "@/hooks/use-contact";
import { useMeta } from "@/hooks/useMeta";


interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}



export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>();
  const submitMutation = useSubmitContact();

  const onSubmit = (data: ContactFormValues) => {
    submitMutation.mutate(data, {
      onSuccess: () => reset()
    });
  };

    useMeta(
    "Contact US | BAP & Associates",
    "Get in touch for expert PR, investor relations & compliance solutions. Let’s grow your business globally—contact BAP & Associates now!"
  );


  return (
    <div className="w-full bg-white">
      {/* Hero */}
      <section className="relative py-32 bg-primary">
        <div className="absolute inset-0 overflow-hidden">
          {/* contact hero background image */}
          <img 
            src="https://www.bapassociates.co.uk/wp-content/uploads/2025/03/Accrualjpg-018-1024x626.jpg" 
            alt="Contact office" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
              Get in touch with us
            </h1>
            <div className="w-24 h-1.5 bg-accent mx-auto rounded-full"></div>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Contact Info */}
          <FadeIn direction="right">
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-display font-bold text-heading mb-6">Our Offices</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Whether you have a question about features, trials, pricing, need a demo, or anything else, our team is ready to answer all your questions.
                </p>
              </div>

              {/* Atlanta Office */}
              <div className="flex gap-6 items-start bg-secondary/30 p-8 rounded-3xl border border-border">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary flex-shrink-0 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-heading mb-3">Atlanta Office (US)</h3>
                  <p className="text-foreground leading-relaxed mb-4">12460 Crabapple Rd<br/>Atlanta, GA 30004</p>
                  <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Phone className="w-4 h-4 text-accent" />
                    <a href="tel:+14047024270" className="hover:text-accent transition-colors">+1 (404) 702-4270</a>
                  </div>
                </div>
              </div>

              {/* London Office */}
              <div className="flex gap-6 items-start bg-secondary/30 p-8 rounded-3xl border border-border">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary flex-shrink-0 shadow-sm">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-heading mb-3">London Office (UK)</h3>
                  <p className="text-foreground leading-relaxed mb-4">25 Old Broad St<br/>London EC2N-1HN, UK</p>
                  <div className="flex flex-col gap-2 text-foreground font-semibold">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-accent" />
                      <a href="tel:+442078770450" className="hover:text-accent transition-colors">+44 20 7877 0450</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-accent" />
                      <a href="mailto:info@BAPassociates.co.uk" className="hover:text-accent transition-colors">info@BAPassociates.co.uk</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div>
                <h3 className="text-lg font-bold text-heading mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-300 transform hover:-translate-y-1 shadow-md"><Facebook className="w-5 h-5" /></a>
                  <a href="#" className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-300 transform hover:-translate-y-1 shadow-md"><Twitter className="w-5 h-5" /></a>
                  <a href="#" className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-300 transform hover:-translate-y-1 shadow-md"><Instagram className="w-5 h-5" /></a>
                  <a href="#" className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-300 transform hover:-translate-y-1 shadow-md"><Linkedin className="w-5 h-5" /></a>
                </div>
              </div>

            </div>
          </FadeIn>

          {/* Right: Contact Form */}
          <FadeIn direction="left">
            <div className="bg-white p-10 md:p-12 rounded-3xl shadow-2xl border border-border">
              <h2 className="text-3xl font-display font-bold text-heading mb-8">Send us a message</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-heading mb-2">Your Name</label>
                  <Input 
                    {...register("name", { required: true })} 
                    placeholder="John Doe" 
                    className={errors.name ? "border-destructive focus-visible:ring-destructive/20" : ""}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-heading mb-2">Email Address</label>
                  <Input 
                    type="email" 
                    {...register("email", { required: true })} 
                    placeholder="john@company.com" 
                    className={errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-heading mb-2">Subject</label>
                  <Input 
                    {...register("subject", { required: true })} 
                    placeholder="How can we help?" 
                    className={errors.subject ? "border-destructive focus-visible:ring-destructive/20" : ""}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-heading mb-2">Message</label>
                  <Textarea 
                    {...register("message", { required: true })} 
                    placeholder="Tell us about your project..." 
                    className={errors.message ? "border-destructive focus-visible:ring-destructive/20" : ""}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </FadeIn>

        </div>
      </section>
    </div>
  );
}
