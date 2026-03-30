import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FadeIn } from "@/components/FadeIn";
import { Diamond, CheckSquare, MessageSquare, ChevronRight, CheckCircle2 } from "lucide-react";
import { useMeta } from "@/hooks/useMeta";
import { useEffect, useState } from "react";
import IconImage from "@/components/IconImage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AboutPoint {
  point_icon: number | string;
  point_text: string;
  point_icon_url?: string;
}

interface ServiceItem {
  service_icon: number | string;
  service_title: string;
}

interface PartnerItem {
  partner_name: string;
}

interface HomeData {
  // Hero
  hero_tagline: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  hero_primary_button_text: string;
  hero_primary_button_link: string;
  hero_secondary_button_text: string;
  hero_secondary_button_link: string;
  hero_primary_button_icon_url: string;

  // Services Overview
  services_section_title: string;
  services_highlight_text: string;
  service_1_title: string;
  service_1_icon_url: string;
  service_1_point_1: string;
  service_1_point_1_icon_url: string;
  service_1_point_2: string;
  service_1_point_2_icon_url: string;
  service_1_point_3: string;
  service_1_point_3_icon_url: string;

  service_2_title: string;
  service_2_icon_url: string;
  service_2_point_1: string;
  service_2_point_1_icon_url: string;
  service_2_point_2: string;
  service_2_point_2_icon_url: string;
  service_2_point_3: string;
  service_2_point_3_icon_url: string;
  service_2_point_4: string;
  service_2_point_4_icon_url: string;

  service_3_title: string;
  service_3_icon_url: string;
  service_3_point_1: string;
  service_3_point_1_icon_url: string;
  service_3_point_2: string;
  service_3_point_2_icon_url: string;
  service_3_point_3: string;
  service_3_point_3_icon_url: string;

  // Growth / About
  about_heading: string;
  about_description: string;
  about_points: AboutPoint[];
  about_button_text: string;
  about_button_link: string;
  about_stat_number: string;
  about_stat_text: string;
  about_image_url: string;
  client_satisfaction_icon_url: string;

  // Services Grid
  services_heading: string;
  services_description: string;
  services_list: ServiceItem[];
  services_icons: string[];      // resolved URLs

  // CTA Subscribe
  cta_heading: string;
  cta_placeholder: string;
  cta_button_text: string;
  cta_button_link: string;

  // Partners
  partners_heading: string;
  partners_list: PartnerItem[];
}

// ─── Defaults (shown while loading / on error) ────────────────────────────────

const defaultData: HomeData = {
  hero_tagline: "STRATEGIC MANAGEMENT & INVESTOR RELATIONS",
  hero_title: "Maximizing Reach and Growth for Your Business.",
  hero_subtitle: "In Front of the Large Audience",
  hero_description: "We provide expert business consulting and strategic distribution solutions to ensure your company's story reaches the right investors globally.",
  hero_primary_button_text: "Get Started",
  hero_primary_button_link: "/contact",
  hero_secondary_button_text: "Learn More",
  hero_secondary_button_link: "/about",
  hero_primary_button_icon_url: "",
  services_section_title: "Efficient Solution So You Can Focus On",
  services_highlight_text: "RUNNING YOUR BUSINESS!",
  service_1_title: "Targeted Visibility",
  service_1_icon_url: "",
  service_1_point_1: "News Distribution To Increase Visibility",
  service_1_point_1_icon_url: "",
  service_1_point_2: "Earnings Releases To Meet Disclosure",
  service_1_point_2_icon_url: "",
  service_1_point_3: "Investor Targeting Distribution Lists",
  service_1_point_3_icon_url: "",
  service_2_title: "Filing & Compliance",
  service_2_icon_url: "",
  service_2_point_1: "Precision Typesetting",
  service_2_point_1_icon_url: "",
  service_2_point_2: "EDGAR Filing & Compliance",
  service_2_point_2_icon_url: "",
  service_2_point_3: "XBRL Filing Solutions",
  service_2_point_3_icon_url: "",
  service_2_point_4: "Annual Report Printing & Services",
  service_2_point_4_icon_url: "",
  service_3_title: "Communication",
  service_3_icon_url: "",
  service_3_point_1: "Webcasting",
  service_3_point_1_icon_url: "",
  service_3_point_2: "Teleconferencing",
  service_3_point_2_icon_url: "",
  service_3_point_3: "Virtual Retail Investor Conferences",
  service_3_point_3_icon_url: "",
  about_heading: 'Your Growth, <br/><span class="text-blue-accent">Our Expertise.</span>',
  about_description: "At BAP & Associates LIMITED, we believe that true success is built on a foundation of strategic planning, impeccable execution, and transparent communication. Our tailored solutions are designed not just to meet your immediate needs, but to propel your business into its next phase of exponential growth.",
  about_points: [
    { point_icon: "", point_text: "Global Distribution Networks", point_icon_url: "" },
    { point_icon: "", point_text: "Comprehensive Financial Reporting", point_icon_url: "" },
    { point_icon: "", point_text: "Strategic Brand Management", point_icon_url: "" },
  ],
  about_button_text: "Discover Our Story",
  about_button_link: "/about",
  about_stat_number: "98%",
  about_stat_text: "Client Satisfaction",
  about_image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
  client_satisfaction_icon_url: "",
  services_heading: "Certified public accountants in United States",
  services_description: "Delivering premium financial, consulting, and advisory services to ensure full compliance and strategic advantage.",
  services_list: [
    { service_icon: "", service_title: "Bookkeeping" },
    { service_icon: "", service_title: "Payroll Services" },
    { service_icon: "", service_title: "Tax Planning" },
    { service_icon: "", service_title: "Audit & Assurance" },
    { service_icon: "", service_title: "Financial Statement" },
    { service_icon: "", service_title: "Business Advisory" },
    { service_icon: "", service_title: "Tech Consulting" },
    { service_icon: "", service_title: "Outsourced CFO" },
  ],
  services_icons: [],
  cta_heading: "Let Us Know How We Can Assist Your Company",
  cta_placeholder: "Enter your email address",
  cta_button_text: "Subscribe Now",
  cta_button_link: "/",
  partners_heading: "Our Partnership with Major Media Outlets",
  partners_list: [
    { partner_name: "Google" },
    { partner_name: "Yahoo" },
    { partner_name: "MarketWatch" },
    { partner_name: "Bloomberg" },
    { partner_name: "MSN" },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const resolveImageUrl = async (field: any): Promise<string> => {
  if (!field) return "";
  if (typeof field === "string") return field.trim();
  if (typeof field === "object" && field.url) return field.url.trim();
  if (typeof field === "number") {
    try {
      const res = await fetch(`/wp-json/wp/v2/media/${field}`);
      const data = await res.json();
      return data?.source_url || "";
    } catch {
      return "";
    }
  }
  return "";
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const [homeData, setHomeData] = useState<HomeData>(defaultData);

  useMeta(
    "PR & Investor Relations Firm UK | BAP & Associates",
    "BAP Associates is a UK-based strategic management firm helping small-cap and emerging market companies grow through investor relations, PR, compliance, and visibility solutions."
  );

  useEffect(() => {
    const fetchAcf = async () => {
      try {
        const res = await fetch("/wp-json/wp/v2/pages/15?_fields=acf&_=" + Date.now());
        const json = await res.json();
        const acf = json?.acf || {};

        console.log("ACF DATA:", acf);

        // Resolve all image IDs to URLs in parallel
        const resolvedAboutPoints = await Promise.all(
          (acf.about_points || []).map(async (p: any) => ({
            ...p,
            point_icon_url: await resolveImageUrl(p.point_icon)
          }))
        );

        const [
          aboutImageUrl,
          heroPrimaryButtonIconUrl,
          clientSatisfactionIconUrl,
          service1IconUrl, service1Point1IconUrl, service1Point2IconUrl, service1Point3IconUrl,
          service2IconUrl, service2Point1IconUrl, service2Point2IconUrl, service2Point3IconUrl, service2Point4IconUrl,
          service3IconUrl, service3Point1IconUrl, service3Point2IconUrl, service3Point3IconUrl,
          ...serviceIconUrls
        ] = await Promise.all([
          resolveImageUrl(acf.about_image),
          resolveImageUrl(acf.hero_primary_button_icon),
          resolveImageUrl(acf.client_satisfaction_icon),
          resolveImageUrl(acf.service_1_icon), resolveImageUrl(acf.service_1_point_1_icon), resolveImageUrl(acf.service_1_point_2_icon), resolveImageUrl(acf.service_1_point_3_icon),
          resolveImageUrl(acf.service_2_icon), resolveImageUrl(acf.service_2_point_1_icon), resolveImageUrl(acf.service_2_point_2_icon), resolveImageUrl(acf.service_2_point_3_icon), resolveImageUrl(acf.service_2_point_4_icon),
          resolveImageUrl(acf.service_3_icon), resolveImageUrl(acf.service_3_point_1_icon), resolveImageUrl(acf.service_3_point_2_icon), resolveImageUrl(acf.service_3_point_3_icon),
          ...(acf.services_list || []).map((s: any) => resolveImageUrl(s.service_icon)),
        ]);

        setHomeData((prev) => ({
          ...prev,
          // Hero
          hero_tagline: acf.hero_tagline || prev.hero_tagline,
          hero_title: acf.hero_title || prev.hero_title,
          hero_subtitle: acf.hero_subtitle || prev.hero_subtitle,
          hero_description: acf.hero_description || prev.hero_description,
          hero_primary_button_text: acf.hero_primary_button_text || prev.hero_primary_button_text,
          hero_primary_button_link: acf.hero_primary_button_link || prev.hero_primary_button_link,
          hero_secondary_button_text: acf.hero_secondary_button_text || prev.hero_secondary_button_text,
          hero_secondary_button_link: acf.hero_secondary_button_link || prev.hero_secondary_button_link,
          hero_primary_button_icon_url: heroPrimaryButtonIconUrl || prev.hero_primary_button_icon_url,

          // Services Overview
          services_section_title: acf.services_section_title || prev.services_section_title,
          services_highlight_text: acf.services_highlight_text || prev.services_highlight_text,

          service_1_title: acf.service_1_title || prev.service_1_title,
          service_1_icon_url: service1IconUrl || prev.service_1_icon_url,
          service_1_point_1: acf.service_1_point_1 || prev.service_1_point_1,
          service_1_point_1_icon_url: service1Point1IconUrl || prev.service_1_point_1_icon_url,
          service_1_point_2: acf.service_1_point_2 || prev.service_1_point_2,
          service_1_point_2_icon_url: service1Point2IconUrl || prev.service_1_point_2_icon_url,
          service_1_point_3: acf.service_1_point_3 || prev.service_1_point_3,
          service_1_point_3_icon_url: service1Point3IconUrl || prev.service_1_point_3_icon_url,

          service_2_title: acf.service_2_title || prev.service_2_title,
          service_2_icon_url: service2IconUrl || prev.service_2_icon_url,
          service_2_point_1: acf.service_2_point_1 || prev.service_2_point_1,
          service_2_point_1_icon_url: service2Point1IconUrl || prev.service_2_point_1_icon_url,
          service_2_point_2: acf.service_2_point_2 || prev.service_2_point_2,
          service_2_point_2_icon_url: service2Point2IconUrl || prev.service_2_point_2_icon_url,
          service_2_point_3: acf.service_2_point_3 || prev.service_2_point_3,
          service_2_point_3_icon_url: service2Point3IconUrl || prev.service_2_point_3_icon_url,
          service_2_point_4: acf.service_2_point_4 || prev.service_2_point_4,
          service_2_point_4_icon_url: service2Point4IconUrl || prev.service_2_point_4_icon_url,

          service_3_title: acf.service_3_title || prev.service_3_title,
          service_3_icon_url: service3IconUrl || prev.service_3_icon_url,
          service_3_point_1: acf.service_3_point_1 || prev.service_3_point_1,
          service_3_point_1_icon_url: service3Point1IconUrl || prev.service_3_point_1_icon_url,
          service_3_point_2: acf.service_3_point_2 || prev.service_3_point_2,
          service_3_point_2_icon_url: service3Point2IconUrl || prev.service_3_point_2_icon_url,
          service_3_point_3: acf.service_3_point_3 || prev.service_3_point_3,
          service_3_point_3_icon_url: service3Point3IconUrl || prev.service_3_point_3_icon_url,

          // Growth / About
          about_heading: acf.about_heading || prev.about_heading,
          about_description: acf.about_description || prev.about_description,
          about_points: resolvedAboutPoints.length ? resolvedAboutPoints : prev.about_points,
          about_button_text: acf.about_button_text || prev.about_button_text,
          about_button_link: acf.about_button_link || prev.about_button_link,
          about_stat_number: acf.about_stat_number || prev.about_stat_number,
          about_stat_text: acf.about_stat_text || prev.about_stat_text,
          about_image_url: aboutImageUrl || prev.about_image_url,
          client_satisfaction_icon_url: clientSatisfactionIconUrl || prev.client_satisfaction_icon_url,

          // Services Grid
          services_heading: acf.services_heading || prev.services_heading,
          services_description: acf.services_description || prev.services_description,
          services_list: acf.services_list?.length ? acf.services_list : prev.services_list,
          services_icons: serviceIconUrls,

          // CTA
          cta_heading: acf.cta_heading || prev.cta_heading,
          cta_placeholder: acf.cta_placeholder || prev.cta_placeholder,
          cta_button_text: acf.cta_button_text || prev.cta_button_text,
          cta_button_link: acf.cta_button_link || prev.cta_button_link,

          // Partners
          partners_heading: acf.partners_heading || prev.partners_heading,
          partners_list: acf.partners_list?.length ? acf.partners_list : prev.partners_list,
        }));
      } catch (err) {
        console.error("ACF Fetch Error:", err);
      }
    };

    fetchAcf();
  }, []);

  const {
    hero_tagline, hero_title, hero_subtitle, hero_description,
    hero_primary_button_text, hero_primary_button_link, hero_primary_button_icon_url,
    hero_secondary_button_text, hero_secondary_button_link,

    services_section_title, services_highlight_text,

    service_1_title, service_1_icon_url,
    service_1_point_1, service_1_point_1_icon_url,
    service_1_point_2, service_1_point_2_icon_url,
    service_1_point_3, service_1_point_3_icon_url,

    service_2_title, service_2_icon_url,
    service_2_point_1, service_2_point_1_icon_url,
    service_2_point_2, service_2_point_2_icon_url,
    service_2_point_3, service_2_point_3_icon_url,
    service_2_point_4, service_2_point_4_icon_url,

    service_3_title, service_3_icon_url,
    service_3_point_1, service_3_point_1_icon_url,
    service_3_point_2, service_3_point_2_icon_url,
    service_3_point_3, service_3_point_3_icon_url,

    about_heading, about_description, about_points,
    about_button_text, about_button_link, about_stat_number, about_stat_text, about_image_url, client_satisfaction_icon_url,

    services_heading, services_description, services_list, services_icons,

    cta_heading, cta_placeholder, cta_button_text,
    partners_heading, partners_list,
  } = homeData;

  return (
    <div className="w-full overflow-hidden">

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-primary">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="https://www.bapassociates.co.uk/wp-content/uploads/2025/03/unsplash-image-FlPc9_VocJ4-1024x683.jpg"
            alt="Business consulting meeting"
            className="w-full h-full object-cover opacity-20 scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeIn>
            <span className="inline-block py-1.5 px-4 rounded-full bg-accent/20 text-accent font-bold tracking-wider text-sm mb-6 border border-accent/30">
              {hero_tagline}
            </span>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
              {hero_title}
            </h1>
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="text-2xl sm:text-3xl text-accent font-light mb-8">
              {hero_subtitle}
            </p>
            <p className="text-lg text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
              {hero_description}
            </p>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={hero_primary_button_link}>
                <Button size="lg" variant="accent" className="group w-full sm:w-auto">
                  {hero_primary_button_text}
                  {hero_primary_button_icon_url ? (
                    <img src={hero_primary_button_icon_url} alt="" className="ml-2 w-5 h-5 object-contain" />
                  ) : (
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </Link>
              <Link href={hero_secondary_button_link}>
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 w-full sm:w-auto">
                  {hero_secondary_button_text}
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Services Overview Section ─────────────────────────────────────── */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-heading mb-6">
              {services_section_title} <br className="hidden md:block" />
              <span className="text-accent relative inline-block">
                {services_highlight_text}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-accent opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="transparent" />
                </svg>
              </span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Card 1 – Targeted Visibility */}
            <FadeIn delay={0.1} className="h-full">
              <div className="bg-card h-full p-8 rounded-3xl border border-border shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white text-accent transition-colors duration-300">
                  {service_1_icon_url ? <img src={service_1_icon_url} alt="" className="w-8 h-8 object-contain" /> : <Diamond className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-bold mb-6 text-heading">{service_1_title}</h3>
                <ul className="space-y-4">
                  {[
                    { text: service_1_point_1, iconUrl: service_1_point_1_icon_url },
                    { text: service_1_point_2, iconUrl: service_1_point_2_icon_url },
                    { text: service_1_point_3, iconUrl: service_1_point_3_icon_url }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground">
                      {item.iconUrl ? (
                        <img src={item.iconUrl} alt="" className="w-5 h-5 mt-0.5 object-contain flex-shrink-0" />
                      ) : (
                        <Diamond className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 fill-accent/20" />
                      )}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Card 2 – Filing & Compliance */}
            <FadeIn delay={0.2} className="h-full">
              <div className="bg-primary h-full p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-all duration-300 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700" />
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 text-accent">
                  {service_2_icon_url ? <img src={service_2_icon_url} alt="" className="w-8 h-8 object-contain" /> : <CheckSquare className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-bold mb-6 text-white">{service_2_title}</h3>
                <ul className="space-y-4">
                  {[
                    { text: service_2_point_1, iconUrl: service_2_point_1_icon_url },
                    { text: service_2_point_2, iconUrl: service_2_point_2_icon_url },
                    { text: service_2_point_3, iconUrl: service_2_point_3_icon_url },
                    { text: service_2_point_4, iconUrl: service_2_point_4_icon_url }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-white/90">
                      {item.iconUrl ? (
                        <img src={item.iconUrl} alt="" className="w-5 h-5 mt-0.5 object-contain flex-shrink-0" />
                      ) : (
                        <Diamond className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 fill-accent" />
                      )}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* Card 3 – Communication */}
            <FadeIn delay={0.3} className="h-full">
              <div className="bg-card h-full p-8 rounded-3xl border border-border shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-8 group-hover:bg-accent group-hover:text-white text-accent transition-colors duration-300">
                  {service_3_icon_url ? <img src={service_3_icon_url} alt="" className="w-8 h-8 object-contain" /> : <MessageSquare className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-bold mb-6 text-heading">{service_3_title}</h3>
                <ul className="space-y-4">
                  {[
                    { text: service_3_point_1, iconUrl: service_3_point_1_icon_url },
                    { text: service_3_point_2, iconUrl: service_3_point_2_icon_url },
                    { text: service_3_point_3, iconUrl: service_3_point_3_icon_url }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground">
                      {item.iconUrl ? (
                        <img src={item.iconUrl} alt="" className="w-5 h-5 mt-0.5 object-contain flex-shrink-0" />
                      ) : (
                        <Diamond className="w-5 h-5 text-accent mt-0.5 flex-shrink-0 fill-accent/20" />
                      )}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ── Growth / About Section ────────────────────────────────────────── */}
      <section className="py-24 bg-secondary/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <FadeIn direction="right">
              <div className="relative">
                <img
                  src={about_image_url}
                  alt="Modern office"
                  className="rounded-3xl shadow-2xl object-cover h-[500px] w-full"
                />
                <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-xl hidden md:block max-w-xs border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white">
                      {client_satisfaction_icon_url ? <img src={client_satisfaction_icon_url} alt="" className="w-6 h-6 object-contain" /> : <CheckCircle2 className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-heading">{about_stat_number}</p>
                      <p className="text-sm text-muted-foreground font-semibold">{about_stat_text}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="left">
              <h2
                className="text-4xl lg:text-5xl font-display font-bold text-heading mb-6"
                dangerouslySetInnerHTML={{ __html: about_heading }}
              />
              <p className="text-lg text-foreground mb-8 leading-relaxed">
                {about_description}
              </p>
              <ul className="space-y-4 mb-10">
                {about_points.map((point, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                      {point.point_icon_url ? <img src={point.point_icon_url} alt="" className="w-4 h-4 object-contain" /> : <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span className="font-semibold text-heading">{point.point_text}</span>
                  </li>
                ))}
              </ul>
              <Link href={about_button_link}>
                <Button size="lg" className="rounded-full">{about_button_text}</Button>
              </Link>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ── Services Grid Section ─────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-heading mb-6">
              {services_heading}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {services_description}
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {services_list.map((service, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex flex-col items-center text-center group cursor-pointer">
                  <div className="w-28 h-28 mb-6 rounded-full bg-secondary/50 flex items-center justify-center p-6 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:bg-white border border-transparent group-hover:border-border">
                    <IconImage
                      src={services_icons[i] || ""}
                      alt={service.service_title}
                    />
                  </div>
                  <h4 className="text-lg font-bold text-heading group-hover:text-accent transition-colors">
                    {service.service_title}
                  </h4>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Subscribe Section ─────────────────────────────────────────── */}
      <section className="py-20 bg-accent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-20 -mb-20" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8">
              {cta_heading}
            </h2>
            <form
              className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
              onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}
            >
              <Input
                type="email"
                placeholder={cta_placeholder}
                className="h-14 text-lg border-white/20 bg-white/10 text-white placeholder:text-white/60 focus-visible:ring-white/30 focus-visible:border-white"
                required
              />
              <Button
                type="submit"
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 shadow-xl sm:w-auto w-full h-14 whitespace-nowrap"
              >
                {cta_button_text}
              </Button>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* ── Partners Section ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h3 className="text-2xl font-display font-bold text-heading mb-10">
              {partners_heading}
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              {partners_list.map((partner, i) => (
                <div
                  key={i}
                  className="text-2xl md:text-4xl font-black font-display tracking-tighter text-muted-foreground hover:text-primary transition-colors"
                >
                  {partner.partner_name}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
