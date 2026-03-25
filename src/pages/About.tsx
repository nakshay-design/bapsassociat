import { FadeIn } from "@/components/FadeIn";
import { CheckCircle2, Target, Users, Shield, TrendingUp } from "lucide-react";


export default function About() {
  return (
    <>

     <Head>
        <title>About BAP & Associates | Global PR & IR Experts</title>
        <meta
          name="description"
          content="Discover BAP & Associates - experts in PR, investor relations & compliance. We help businesses gain visibility and grow globally. Learn more today!"
        />
      </Head>
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 bg-primary text-white">
        <div className="absolute inset-0 overflow-hidden">
          {/* abstract dark blue background */}
          <img 
            src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop" 
            alt="Abstract Background" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 max-w-4xl mx-auto leading-tight text-white">
              Our goal is to get your company's story in front of the <span className="text-accent">Largest Audience</span> possible!
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Empowering businesses through strategic insights, innovative distribution, and flawless execution since our inception.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-accent relative z-20 -mt-8 mx-4 sm:mx-8 lg:mx-auto max-w-7xl rounded-3xl shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-8">
          <FadeIn delay={0.1}>
            <p className="text-4xl md:text-5xl font-black text-white mb-2">500+</p>
            <p className="text-primary font-bold uppercase tracking-wider text-sm">Businesses Served</p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-4xl md:text-5xl font-black text-white mb-2">$50M+</p>
            <p className="text-primary font-bold uppercase tracking-wider text-sm">Tax Savings</p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p className="text-4xl md:text-5xl font-black text-white mb-2">200+</p>
            <p className="text-primary font-bold uppercase tracking-wider text-sm">Payroll Set Up</p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <p className="text-4xl md:text-5xl font-black text-white mb-2">98%</p>
            <p className="text-primary font-bold uppercase tracking-wider text-sm">Client Satisfaction</p>
          </FadeIn>
        </div>
      </section>

      {/* Story / Partnerships */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-heading mb-6">
                Strategic Management & Global Partnerships
              </h2>
              <div className="w-20 h-2 bg-accent rounded-full mb-8"></div>
              <p className="text-lg text-foreground mb-6 leading-relaxed">
                BAP & Associates LIMITED is an industry-leading strategic management firm focused on optimizing investor relations, PR solutions, and robust financial compliance. We connect your brand to the audiences that matter most.
              </p>
              <p className="text-lg text-foreground leading-relaxed">
                Through our deep-rooted partnerships with major media outlets like Google, Yahoo, MSN, MarketWatch, and Bloomberg, we guarantee unprecedented visibility for your earnings releases, product launches, and corporate updates.
              </p>
            </FadeIn>
            <FadeIn direction="left" className="grid grid-cols-2 gap-4">
              {/* office team meeting */}
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" alt="Team" className="rounded-3xl shadow-lg w-full h-64 object-cover" />
              {/* handshake business deal */}
              <img src="/images/img_About2.png" alt="Partnership" className="rounded-3xl shadow-lg w-full h-64 object-cover mt-8" />
            </FadeIn>
          </div>
        </div> 
      </section>

      {/* Values & Mission */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-heading mb-6">Our Commitment</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We are driven by a core set of values that dictate how we operate, how we serve our clients, and how we deliver measurable results.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              { icon: Users, title: "Client-Centric", desc: "Your success is our primary objective." },
              { icon: Target, title: "Collaborative", desc: "We work as an extension of your team." },
              { icon: TrendingUp, title: "Data-Driven", desc: "Insights backed by concrete analytics." },
              { icon: Shield, title: "Risk Management", desc: "Ensuring compliance and mitigating exposure." }
            ].map((value, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-border h-full text-center hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-16 h-16 mx-auto bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                    <value.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-3">{value.title}</h3>
                  <p className="text-foreground">{value.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn delay={0.2}>
              <div className="bg-primary text-white p-10 rounded-3xl shadow-xl h-full">
                <h3 className="text-3xl font-display font-bold mb-6 text-accent">Our Vision</h3>
                <p className="text-lg leading-relaxed text-white/90">
                  To be the world's most trusted partner in strategic business management, setting the standard for excellence in corporate communication, financial advisory, and global distribution solutions.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="bg-white border-2 border-primary p-10 rounded-3xl shadow-xl h-full">
                <h3 className="text-3xl font-display font-bold mb-6 text-primary">Our Mission</h3>
                <p className="text-lg leading-relaxed text-foreground">
                  To empower organizations of all sizes with the tools, insights, and reach required to operate efficiently, remain compliant, and achieve sustained, measurable growth in the competitive global market.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
