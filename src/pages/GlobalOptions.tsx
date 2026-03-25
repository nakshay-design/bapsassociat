import { FadeIn } from "@/components/FadeIn";
import { AccordionItem } from "@/components/ui/accordion";
import { useState } from "react";
import { Globe2, FileText, CheckCircle2, BarChart } from "lucide-react";
import { useMeta } from "@/hooks/useMeta";


export default function GlobalOptions() {

     useMeta(
    "Global PR Distribution Services | BAP & Associates",
    "Discover BAP & Associates - experts in PR, investor relations & compliance. We help businesses gain visibility and grow globally. Learn more today!"
  );

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do you provide international tax advice?",
      a: "Yes, our certified experts provide comprehensive international tax planning and compliance services tailored to businesses operating across borders."
    },
    {
      q: "How many countries does your distribution network cover?",
      a: "Our global distribution network spans over 170+ countries and supports more than 40 languages, ensuring localized reach on a massive scale."
    },
    {
      q: "Can you assist with multilingual regulatory filings?",
      a: "Absolutely. We offer complete translation and typesetting services that meet the specific regulatory requirements of various international exchanges."
    },
    {
      q: "What makes your Global Options different?",
      a: "We combine our centralized strategic management with an extensive network of local affiliate offices, giving you global reach with nuanced regional expertise."
    },
    {
      q: "How do I start with Global Distribution?",
      a: "Simply reach out via our Contact page. One of our global strategy directors will evaluate your current footprint and design a customized expansion plan."
    }
  ];



  return (
    <div className="w-full overflow-hidden">
      {/* Hero */}
      <section className="relative py-24 bg-primary text-white">
        <div className="absolute inset-0 overflow-hidden">
          {/* global world map background */}
          <img 
            src="https://images.unsplash.com/photo-1589519160732-57fc498494f8?q=80&w=2000&auto=format&fit=crop" 
            alt="Global Network" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 max-w-4xl mx-auto leading-tight text-white">
              Efficient Solutions So You Can Focus On <span className="text-accent">Running Your Business!</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Global Options & Distribution
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Network Intro */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-heading mb-8">
              Leverage the Global Network Built with Local Expertise
            </h2>
            <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed mb-12">
              Reach your audience wherever they are. Our distribution network touches over <strong className="text-accent text-2xl">170+</strong> countries in <strong className="text-accent text-2xl">40+</strong> languages, ensuring your message is not just heard, but understood locally.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "BAP & ASSOCIATES LIMITED OFFICE", img: "build.png" },
              { title: "BAP & ASSOCIATES LIMITED AFFILIATE OFFICE", img: "molecule.png" },
              { title: "BAP & ASSOCIATES LIMITED GLOBAL DISTRIBUTION COVERAGE", img: "world.png" }
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 0.2} className="h-full">
                <div className="bg-secondary/20 p-10 rounded-3xl border border-border h-full flex flex-col items-center justify-center group hover:bg-white hover:shadow-2xl transition-all duration-300">
                  <div className="h-32 mb-8 flex items-center justify-center">
                    <img 
                      src={`https://www.bapassociates.co.uk/wp-content/uploads/2025/03/${card.img}`} 
                      alt={card.title}
                      className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center"><div class="w-10 h-10 bg-primary rounded-full"></div></div>';
                      }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-heading text-center leading-snug">{card.title}</h3>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Distribution Suite */}
      <section className="py-24 bg-primary text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              International Distribution Suite
            </h2>
            <div className="w-24 h-2 bg-accent rounded-full"></div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { icon: Globe2, title: "Global Reach", desc: "Distribute your press releases and corporate news to media terminals worldwide." },
              { icon: FileText, title: "Translation Services", desc: "Professional financial translation tailored for regional regulatory standards." },
              { icon: CheckCircle2, title: "Regional Expertise", desc: "Navigate complex international markets with our dedicated affiliate offices." },
              { icon: BarChart, title: "Reporting & Analytics", desc: "Track the performance and visibility of your global campaigns in real-time." }
            ].map((feature, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex gap-6 items-start bg-white/5 p-8 rounded-3xl hover:bg-white/10 transition-colors duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-accent text-white flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-3 text-white">{feature.title}</h4>
                    <p className="text-white/70 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-heading mb-6">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about our global capabilities.</p>
          </FadeIn>

          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <AccordionItem 
                  title={faq.q} 
                  isOpen={openFaq === i} 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.a}
                </AccordionItem>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
