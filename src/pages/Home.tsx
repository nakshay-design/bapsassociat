import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/FadeIn";
import { Diamond, CheckSquare, MessageSquare, ChevronRight, CheckCircle2 } from "lucide-react";
import { useMeta } from "@/hooks/useMeta";
import { useEffect, useState } from "react";

type Service = {
  title: string;
  img: string;
};

export default function Home() {

   useMeta(
    "PR & Investor Relations Firm UK | BAP & Associates",
    "BAP Associates is a UK-based strategic management firm helping small-cap and emerging market companies grow through investor relations, PR, compliance, and visibility solutions."
  );
const [services, setServices] = useState<Service[]>([]);


useEffect(() => {
  fetch("https://my.wordpress.net/scope:default/wp-json/wp/v2/pages/18")
    .then(res => res.json())
    .then(data => {
      const acf = data.acf || {};

      const dynamicServices = [
        { title: "Bookkeeping", img: acf?.icon_1 || "" },
        { title: "Payroll Services", img: acf?.icon_2 || "" },
        { title: "Tax Planning", img: acf?.icon_3 || "" },
        { title: "Audit & Assurance", img: acf?.icon_4 || "" },
        { title: "Financial Statement", img: acf?.icon_5 || "" },
        { title: "Business Advisory", img: acf?.icon_6 || "" },
        { title: "Tech Consulting", img: acf?.icon_7 || "" },
        { title: "Outsourced CFO", img: acf?.icon_8 || "" }
      ];

      console.log("SERVICES:", dynamicServices);

      setServices(dynamicServices);
    })
    .catch(err => console.error(err));
}, []);
   

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-primary">
        <div className="absolute inset-0 overflow-hidden">
          {/* corporate consulting background image */}
          <img 
            src="https://www.bapassociates.co.uk/wp-content/uploads/2025/03/unsplash-image-FlPc9_VocJ4-1024x683.jpg" 
            alt="Business consulting meeting" 
            className="w-full h-full object-cover opacity-20 scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeIn>
            <span className="inline-block py-1.5 px-4 rounded-full bg-accent/20 text-accent font-bold tracking-wider text-sm mb-6 border border-accent/30">
              STRATEGIC MANAGEMENT & INVESTOR RELATIONS
            </span>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
              Maximizing Reach and <br className="hidden sm:block" />
              Growth for Your Business.
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <p className="text-2xl sm:text-3xl text-accent font-light mb-8">
              In Front of the Large Audience
            </p>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
              We provide expert business consulting and strategic distribution solutions to ensure your company's story reaches the right investors globally.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" variant="accent" className="group w-full sm:w-auto">
                  Get Started 
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 w-full sm:w-auto">
                  Learn More
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-heading mb-6">
              Efficient Solution So You Can Focus On <br className="hidden md:block"/>
              <span className="text-accent relative inline-block">
                RUNNING YOUR BUSINESS!
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="transparent" />
                </svg>
              </span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <FadeIn delay={0.1} className="h-full">
              <div className="bg-card h-full p-8 rounded-3xl border border-border shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white text-accent transition-colors duration-300">
                  <Diamond className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-heading">Targeted Visibility</h3>
                <ul className="space-y-4">
                  {["News Distribution To Increase Visibility", "Earnings Releases To Meet Disclosure", "Investor Targeting Distribution Lists"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground">
                      <Diamond className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 fill-accent/20" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Card 2 */}
            <FadeIn delay={0.2} className="h-full">
              <div className="bg-primary h-full p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-all duration-300 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"></div>
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 text-accent">
                  <CheckSquare className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">Filing & Compliance</h3>
                <ul className="space-y-4">
                  {["Precision Typesetting", "EDGAR Filing & Compliance", "XBRL Filing Solutions", "Annual Report Printing & Services"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/90">
                      <Diamond className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 fill-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Card 3 */}
            <FadeIn delay={0.3} className="h-full">
              <div className="bg-card h-full p-8 rounded-3xl border border-border shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white text-accent transition-colors duration-300">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-6 text-heading">Communication</h3>
                <ul className="space-y-4">
                  {["Webcasting", "Teleconferencing", "Virtual Retail Investor Conferences"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground">
                      <Diamond className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 fill-accent/20" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Your Growth Section */}
      <section className="py-24 bg-secondary/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <div className="relative">
                {/* modern office building facade */}
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop" 
                  alt="Modern office" 
                  className="rounded-3xl shadow-2xl object-cover h-[500px] w-full"
                />
                <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl hidden md:block max-w-xs border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-heading">98%</p>
                      <p className="text-sm text-muted-foreground font-semibold">Client Satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
            
            <FadeIn direction="left">
              <h2 className="text-4xl lg:text-5xl font-display font-bold text-heading mb-6">
                Your Growth, <br/>
                <span className="text-blue-accent">Our Expertise.</span>
              </h2>
              <p className="text-lg text-foreground mb-8 leading-relaxed">
                At BAP & Associates LIMITED, we believe that true success is built on a foundation of strategic planning, impeccable execution, and transparent communication. Our tailored solutions are designed not just to meet your immediate needs, but to propel your business into its next phase of exponential growth.
              </p>
              <ul className="space-y-4 mb-10">
                {["Global Distribution Networks", "Comprehensive Financial Reporting", "Strategic Brand Management"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-heading">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/about">
                <Button size="lg" className="rounded-full">Discover Our Story</Button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-heading mb-6">
              Certified public accountants in United States
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Delivering premium financial, consulting, and advisory services to ensure full compliance and strategic advantage.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center group cursor-pointer">
                  <div className="w-28 h-28 mb-6 rounded-full bg-secondary/50 flex items-center justify-center p-6 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-white border border-transparent group-hover:border-border">
                    <img 
                        src={service.img}
                        alt={service.title}
                        className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = "https://via.placeholder.com/100";
                      }}
                      />
                      
                  </div>
                  <h4 className="text-lg font-bold text-heading group-hover:text-accent transition-colors">{service.title}</h4>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-20 bg-accent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8">
              Let Us Know How We Can Assist Your Company
            </h2>
            <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="h-14 text-lg border-white/20 bg-white/10 text-white placeholder:text-white/60 focus-visible:ring-white/30 focus-visible:border-white"
                required
              />
              <Button type="submit" size="lg" className="bg-primary text-white hover:bg-primary/90 shadow-xl sm:w-auto w-full h-14 whitespace-nowrap">
                Subscribe Now
              </Button>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h3 className="text-2xl font-display font-bold text-heading mb-10">Our Partnership with Major Media Outlets</h3>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              {['Google', 'Yahoo', 'MarketWatch', 'Bloomberg', 'MSN'].map((partner, i) => (
                <div key={i} className="text-2xl md:text-4xl font-black font-display tracking-tighter text-muted-foreground hover:text-primary transition-colors">
                  {partner}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
