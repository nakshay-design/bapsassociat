import { FadeIn } from "@/components/FadeIn";

export default function IrPrSolutions() {
  return (
    <div className="w-full overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative py-24 bg-primary text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeIn>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 max-w-4xl mx-auto leading-tight">
              Investor Relations & <br/> <span className="text-accent">PR Solutions</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Efficient solutions that empower your brand's voice and ensure flawless regulatory compliance across capital markets.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Feature Sections alternating */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
        
        {/* Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right">
            <div className="relative p-8 bg-blue-accent/5 rounded-3xl">
              <img 
                src="./images/statistics.svg" 
                alt="SEO Brand PR" 
                className="w-full h-auto object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </FadeIn>
          <FadeIn direction="left">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-heading mb-6">SEO, Brand & PR Management</h2>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Our comprehensive public relations tools are designed to amplify your company's narrative. We construct integrated campaigns that bridge the gap between traditional PR and modern digital visibility.
            </p>
            <ul className="space-y-3 text-muted-foreground font-medium">
              <li className="flex items-center gap-2"><div className="w-2 h-2 bg-accent rounded-full"></div> Target key demographics</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 bg-accent rounded-full"></div> Manage corporate reputation</li>
              <li className="flex items-center gap-2"><div className="w-2 h-2 bg-accent rounded-full"></div> Drive meaningful engagement</li>
            </ul>
          </FadeIn>
        </div>

        {/* Section 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right" className="lg:order-2">
            <div className="relative p-8 bg-accent/5 rounded-3xl">
              <img 
                src="https://www.bapassociates.co.uk/wp-content/uploads/2025/03/se-o.png" 
                alt="White Hat SEO" 
                className="w-full h-auto object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </FadeIn>
          <FadeIn direction="left" className="lg:order-1">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-heading mb-6">White Hat SEO</h2>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Dominating search engine results requires a strategic, sustainable approach. We utilize strictly white-hat SEO techniques to elevate your digital presence organically.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              From technical site audits to high-quality content marketing, our strategies ensure your business ranks highly for the keywords that drive investor and consumer interest.
            </p>
          </FadeIn>
        </div>

        {/* Section 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right">
            <div className="relative p-8 bg-primary/5 rounded-3xl">
              <img 
                src="https://www.bapassociates.co.uk/wp-content/uploads/2025/03/social.png" 
                alt="Brand Management" 
                className="w-full h-auto object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </FadeIn>
          <FadeIn direction="left">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-heading mb-6">Brand Management</h2>
            <p className="text-lg text-foreground leading-relaxed">
              Your brand is your most valuable asset. We provide end-to-end brand management services to ensure consistent, impactful messaging across all platforms—from social media to corporate roadshows. Let us help you craft a brand identity that commands respect and demands attention.
            </p>
          </FadeIn>
        </div>

        {/* Section 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right" className="lg:order-2">
            <div className="relative p-8 bg-secondary/50 rounded-3xl">
              <img 
                src="https://www.bapassociates.co.uk/wp-content/uploads/2025/03/road-site.png" 
                alt="Press Distribution" 
                className="w-full h-auto object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          </FadeIn>
          <FadeIn direction="left" className="lg:order-1">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-heading mb-6">Global Press Distribution</h2>
            <p className="text-lg text-foreground leading-relaxed">
              Maximize your media pickup with our premier press distribution networks. We push your news to top-tier financial terminals, newsrooms, and direct-to-investor channels simultaneously, ensuring immediate and widespread visibility.
            </p>
          </FadeIn>
        </div>

      </div>

      {/* Regulatory Section */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-8">Regulatory Compliance & Filings</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
              Flawless execution of filing, typesetting, and financial print for all major exchanges including NYSE, NASDAQ, OTC, and TSX.
            </p>
          </FadeIn>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <FadeIn delay={0.1}>
              <div className="p-8 border border-white/20 rounded-3xl bg-white/5 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-accent">EDGAR & SEDAR</h3>
                <p className="text-white/70">Seamless compliance filings with SEC and Canadian regulatory bodies.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="p-8 border border-white/20 rounded-3xl bg-white/5 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-accent">XBRL Solutions</h3>
                <p className="text-white/70">Accurate tagging and formatting for modern digital financial reporting.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="p-8 border border-white/20 rounded-3xl bg-white/5 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4 text-accent">Annual Reports</h3>
                <p className="text-white/70">Premium typesetting and printing services for your annual corporate reports.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Adwords & Final Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right">
            <img 
              src="https://www.bapassociates.co.uk/wp-content/uploads/2025/03/stats.png" 
              alt="Analytics and Adwords" 
              className="w-full h-auto rounded-3xl shadow-xl"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </FadeIn>
          <FadeIn direction="left">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-heading mb-6">Adwords, Bing & Digital Analytics</h2>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Drive targeted traffic precisely when and where it matters. Our digital advertising experts manage your paid search campaigns across Google Adwords and Bing, optimizing CPC and maximizing ROI.
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-heading mb-6 mt-12">Earnings WebCasts</h2>
            <p className="text-lg text-foreground leading-relaxed">
              Deliver your quarterly results with confidence. We provide secure, high-definition webcasting and teleconferencing solutions that ensure your investors hear your message clearly, without technical interruptions.
            </p>
          </FadeIn>
        </div>
      </div>

    </div>
  );
}
