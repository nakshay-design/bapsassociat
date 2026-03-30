import { FadeIn } from "@/components/FadeIn";
import { CheckCircle2, Target, Users, Shield, TrendingUp } from "lucide-react";
import { useMeta } from "@/hooks/useMeta";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatItem {
  stat_number: string;
  stat_label: string;
}

interface CommitmentCard {
  card_icon: number | string;
  card_icon_url?: string;
  card_title: string;
  card_description: string;
  fallback_icon?: any; // To hold Lucide icons if no image is provided
}

interface AboutData {
  // Banner
  about_banner_heading: string;
  about_banner_description: string;
  about_banner_bg_color: string;
  about_banner_accent_color: string;
  about_banner_image?: number | string;
  about_banner_image_url?: string;

  // Stats
  about_stats_background: string;
  about_stats_list: StatItem[];

  // Content (Story/Partnerships)
  about_content_heading: string;
  about_content_description_1: string;
  about_content_description_2: string;
  about_content_image_1: number | string;
  about_content_image_1_url: string;
  about_content_image_2: number | string;
  about_content_image_2_url: string;
  about_content_accent_color: string;

  // Commitment
  about_commitment_heading: string;
  about_commitment_description: string;
  about_commitment_cards: CommitmentCard[];

  // Vision & Mission
  about_vision_title: string;
  about_vision_text: string;
  about_mission_title: string;
  about_mission_text: string;
}

// ─── Defaults (shown while loading / on error) ────────────────────────────────

const defaultData: AboutData = {
  about_banner_heading: "Our goal is to get your company's story in front of the <span class='text-accent'>Largest Audience</span> possible!",
  about_banner_description: "Empowering businesses through strategic insights, innovative distribution, and flawless execution since our inception.",
  about_banner_bg_color: "#1E3A5F",
  about_banner_accent_color: "#6db842",
  about_banner_image: "",
  about_banner_image_url: "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop",
  about_stats_background: "#6DBE45",
  about_stats_list: [
    { stat_number: "500+", stat_label: "Businesses Served" },
    { stat_number: "$50M+", stat_label: "Tax Savings" },
    { stat_number: "200+", stat_label: "Payroll Set Up" },
    { stat_number: "98%", stat_label: "Client Satisfaction" },
  ],
  about_content_heading: "Strategic Management & Global Partnerships",
  about_content_description_1: "BAP & Associates LIMITED is an industry-leading strategic management firm focused on optimizing investor relations, PR solutions, and robust financial compliance. We connect your brand to the audiences that matter most.",
  about_content_description_2: "Through our deep-rooted partnerships with major media outlets like Google, Yahoo, MSN, MarketWatch, and Bloomberg, we guarantee unprecedented visibility for your earnings releases, product launches, and corporate updates.",
  about_content_image_1: "",
  about_content_image_1_url: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop",
  about_content_image_2: "",
  about_content_image_2_url: "/images/img_About2.png",
  about_content_accent_color: "#6DBE45",
  about_commitment_heading: "Our Commitment",
  about_commitment_description: "We are driven by a core set of values that dictate how we operate, how we serve our clients, and how we deliver measurable results.",
  about_commitment_cards: [
    { card_icon: "", card_icon_url: "", card_title: "Client-Centric", card_description: "Your success is our primary objective.", fallback_icon: Users },
    { card_icon: "", card_icon_url: "", card_title: "Collaborative", card_description: "We work as an extension of your team.", fallback_icon: Target },
    { card_icon: "", card_icon_url: "", card_title: "Data-Driven", card_description: "Insights backed by concrete analytics.", fallback_icon: TrendingUp },
    { card_icon: "", card_icon_url: "", card_title: "Risk Management", card_description: "Ensuring compliance and mitigating exposure.", fallback_icon: Shield }
  ],
  about_vision_title: "Our Vision",
  about_vision_text: "To be the world's most trusted partner in strategic business management, setting the standard for excellence in corporate communication, financial advisory, and global distribution solutions.",
  about_mission_title: "Our Mission",
  about_mission_text: "To empower organizations of all sizes with the tools, insights, and reach required to operate efficiently, remain compliant, and achieve sustained, measurable growth in the competitive global market."
};

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

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData>(defaultData);

  useMeta(
    "About BAP & Associates | Global PR & IR Experts",
    "Discover BAP & Associates - experts in PR, investor relations & compliance. We help businesses gain visibility and grow globally. Learn more today!"
  );

  useEffect(() => {
    const fetchAcf = async () => {
      try {
        const res = await fetch("/wp-json/wp/v2/pages/418?_fields=acf&_=" + Date.now());
        const json = await res.json();
        const acf = json?.acf || {};

        console.log("ACF ABOUT DATA:", acf);

        // Resolve images (content images + commitment icons + banner)
        const [
          image1Url,
          image2Url,
          bannerImageUrl
        ] = await Promise.all([
          resolveImageUrl(acf.about_content_image_1),
          resolveImageUrl(acf.about_content_image_2),
          resolveImageUrl(acf.about_banner_image)
        ]);

        const resolvedCards = await Promise.all(
          (acf.about_commitment_cards || []).map(async (card: any, index: number) => {
            const fallbackIcons = [Users, Target, TrendingUp, Shield];
            return {
              ...card,
              card_icon_url: await resolveImageUrl(card.card_icon),
              fallback_icon: fallbackIcons[index] || CheckCircle2
            };
          })
        );

        setAboutData((prev) => ({
          ...prev,
          about_banner_heading: acf.about_banner_heading || prev.about_banner_heading,
          about_banner_description: acf.about_banner_description || prev.about_banner_description,
          about_banner_bg_color: acf.about_banner_bg_color || prev.about_banner_bg_color,
          about_banner_accent_color: acf.about_banner_accent_color || prev.about_banner_accent_color,
          about_banner_image_url: bannerImageUrl || prev.about_banner_image_url,

          about_stats_background: acf.about_stats_background || prev.about_stats_background,
          about_stats_list: acf.about_stats_list?.length ? acf.about_stats_list : prev.about_stats_list,

          about_content_heading: acf.about_content_heading || prev.about_content_heading,
          about_content_description_1: acf.about_content_description_1 || prev.about_content_description_1,
          about_content_description_2: acf.about_content_description_2 || prev.about_content_description_2,
          about_content_image_1_url: image1Url || prev.about_content_image_1_url,
          about_content_image_2_url: image2Url || prev.about_content_image_2_url,
          about_content_accent_color: acf.about_content_accent_color || prev.about_content_accent_color,

          about_commitment_heading: acf.about_commitment_heading || prev.about_commitment_heading,
          about_commitment_description: acf.about_commitment_description || prev.about_commitment_description,
          about_commitment_cards: resolvedCards.length ? resolvedCards : prev.about_commitment_cards,

          about_vision_title: acf.about_vision_title || prev.about_vision_title,
          about_vision_text: acf.about_vision_text || prev.about_vision_text,
          about_mission_title: acf.about_mission_title || prev.about_mission_title,
          about_mission_text: acf.about_mission_text || prev.about_mission_text,
        }));
      } catch (err) {
        console.error("ACF About Fetch Error:", err);
      }
    };

    fetchAcf();
  }, []);

  const {
    about_banner_heading,
    about_banner_description,
    about_banner_image_url,
    about_stats_list,
    about_content_heading,
    about_content_description_1,
    about_content_description_2,
    about_content_image_1_url,
    about_content_image_2_url,
    about_commitment_heading,
    about_commitment_description,
    about_commitment_cards,
    about_vision_title,
    about_vision_text,
    about_mission_title,
    about_mission_text,
  } = aboutData;

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 bg-primary text-white">
        <div className="absolute inset-0 overflow-hidden">
          {/* abstract dark blue background */}
          <img
            src={about_banner_image_url}
            alt="Abstract Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeIn>
            <h1
              className="text-4xl md:text-6xl font-display font-bold mb-6 max-w-4xl mx-auto leading-tight text-white"
              dangerouslySetInnerHTML={{ __html: about_banner_heading }}
            />
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {about_banner_description}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-accent relative z-20 -mt-8 mx-4 sm:mx-8 lg:mx-auto max-w-7xl rounded-3xl shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center px-8">
          {about_stats_list.map((stat, i) => (
            <FadeIn key={i} delay={0.1 * (i + 1)}>
              <p className="text-4xl md:text-5xl font-black text-white mb-2">{stat.stat_number}</p>
              <p className="text-primary font-bold uppercase tracking-wider text-sm">{stat.stat_label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Story / Partnerships */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-heading mb-6" dangerouslySetInnerHTML={{ __html: about_content_heading }} />
              <div className="w-20 h-2 bg-accent rounded-full mb-8"></div>
              <p className="text-lg text-foreground mb-6 leading-relaxed">
                {about_content_description_1}
              </p>
              <p className="text-lg text-foreground leading-relaxed">
                {about_content_description_2}
              </p>
            </FadeIn>
            <FadeIn direction="left" className="grid grid-cols-2 gap-4">
              <img src={about_content_image_1_url} alt="Team" className="rounded-3xl shadow-lg w-full h-64 object-cover" />
              <img src={about_content_image_2_url} alt="Partnership" className="rounded-3xl shadow-lg w-full h-64 object-cover mt-8" />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values & Mission */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeIn>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-heading mb-6">{about_commitment_heading}</h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {about_commitment_description}
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {about_commitment_cards.map((value, i) => {
              const FallbackIcon = value.fallback_icon;
              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="bg-white p-8 rounded-3xl shadow-lg border border-border h-full text-center hover:-translate-y-2 transition-transform duration-300">
                    <div className="w-16 h-16 mx-auto bg-accent/10 text-accent rounded-full flex items-center justify-center mb-6">
                      {value.card_icon_url ? (
                        <img src={value.card_icon_url} alt={value.card_title} className="w-8 h-8 object-contain" />
                      ) : (
                        FallbackIcon && <FallbackIcon className="w-8 h-8" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-heading mb-3">{value.card_title}</h3>
                    <p className="text-foreground">{value.card_description}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn delay={0.2}>
              <div className="bg-primary text-white p-10 rounded-3xl shadow-xl h-full">
                <h3 className="text-3xl font-display font-bold mb-6 text-accent">{about_vision_title}</h3>
                <p className="text-lg leading-relaxed text-white/90">
                  {about_vision_text}
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="bg-white border-2 border-primary p-10 rounded-3xl shadow-xl h-full">
                <h3 className="text-3xl font-display font-bold mb-6 text-primary">{about_mission_title}</h3>
                <p className="text-lg leading-relaxed text-foreground">
                  {about_mission_text}
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
