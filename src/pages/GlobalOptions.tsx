import { FadeIn } from "@/components/FadeIn";
import { AccordionItem } from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { Globe2, FileText, CheckCircle2, BarChart } from "lucide-react";
import { useMeta } from "@/hooks/useMeta";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FaqItem {
  faq_question: string;
  faq_answer: string;
  faq_default_open: boolean;
}

interface DistributionCard {
  card_icon: number | string;
  card_icon_url?: string;
  card_title: string;
  card_description: string;
  fallback_icon?: any;
}

interface NetworkCard {
  network_icon: number | string;
  network_icon_url?: string;
  network_title: string;
}

interface GlobalOptionsData {
  // Banner
  services_banner_heading: string;
  services_banner_subtitle: string;
  services_banner_bg_image_url: string;
  services_banner_overlay_color: string;

  // Network section
  services_global_options_network_heading: string;
  services_global_options_network_description: string;
  services_global_options_network_cards: NetworkCard[];

  // Distribution Suite
  services_global_options_distribution_heading: string;
  services_global_options_distribution_cards: DistributionCard[];

  // FAQ
  services_global_options_faq_heading: string;
  services_global_options_faq_subtitle: string;
  services_global_options_faq_list: FaqItem[];
}

// ─── Defaults — no static images, all come from ACF ──────────────────────────

const distributionFallbackIcons = [Globe2, FileText, CheckCircle2, BarChart];

const defaultData: GlobalOptionsData = {
  services_banner_heading:
    "Efficient Solutions So You Can Focus On <span class='text-accent'>Running Your Business!</span>",
  services_banner_subtitle: "Global Options & Distribution",
  services_banner_bg_image_url: "",
  services_banner_overlay_color: "#0A1F3D",

  services_global_options_network_heading:
    "Leverage the Global Network Built with Local Expertise",
  services_global_options_network_description:
    "Reach your audience wherever they are. Our distribution network touches over <strong class=\"text-accent text-2xl\">170+</strong> countries in <strong class=\"text-accent text-2xl\">40+</strong> languages, ensuring your message is not just heard, but understood locally.",
  services_global_options_network_cards: [
    { network_icon: "", network_icon_url: "", network_title: "BAP & ASSOCIATES LIMITED OFFICE" },
    { network_icon: "", network_icon_url: "", network_title: "BAP & ASSOCIATES LIMITED AFFILIATE OFFICE" },
    { network_icon: "", network_icon_url: "", network_title: "BAP & ASSOCIATES LIMITED GLOBAL DISTRIBUTION COVERAGE" },
  ],

  services_global_options_distribution_heading: "International Distribution Suite",
  services_global_options_distribution_cards: [
    { card_icon: "", card_icon_url: "", card_title: "Global Reach",         card_description: "Distribute your press releases and corporate news to media terminals worldwide.",                   fallback_icon: Globe2       },
    { card_icon: "", card_icon_url: "", card_title: "Translation Services", card_description: "Professional financial translation tailored for regional regulatory standards.",                    fallback_icon: FileText     },
    { card_icon: "", card_icon_url: "", card_title: "Regional Expertise",   card_description: "Navigate complex international markets with our dedicated affiliate offices.",                     fallback_icon: CheckCircle2 },
    { card_icon: "", card_icon_url: "", card_title: "Reporting & Analytics",card_description: "Track the performance and visibility of your global campaigns in real-time.",                      fallback_icon: BarChart     },
  ],

  services_global_options_faq_heading: "Frequently Asked Questions",
  services_global_options_faq_subtitle: "Everything you need to know about our global capabilities.",
  services_global_options_faq_list: [
    { faq_question: "Do you provide international tax advice?",           faq_answer: "Yes, our certified experts provide comprehensive international tax planning and compliance services tailored to businesses operating across borders.",                                                                 faq_default_open: false },
    { faq_question: "How many countries does your distribution network cover?", faq_answer: "Our global distribution network spans over 170+ countries and supports more than 40 languages, ensuring localized reach on a massive scale.",                                                                   faq_default_open: false },
    { faq_question: "Can you assist with multilingual regulatory filings?", faq_answer: "Absolutely. We offer complete translation and typesetting services that meet the specific regulatory requirements of various international exchanges.",                                                             faq_default_open: false },
    { faq_question: "What makes your Global Options different?",          faq_answer: "We combine our centralized strategic management with an extensive network of local affiliate offices, giving you global reach with nuanced regional expertise.",                                                       faq_default_open: false },
    { faq_question: "How do I start with Global Distribution?",           faq_answer: "Simply reach out via our Contact page. One of our global strategy directors will evaluate your current footprint and design a customized expansion plan.",                                                            faq_default_open: false },
  ],
};

// ─── Resolve WordPress media ID → URL ────────────────────────────────────────

const resolveMediaId = async (field: any): Promise<string> => {
  if (typeof field === "string" && field.startsWith("http")) return field.trim();
  if (typeof field === "object" && field !== null && field.url) return field.url.trim();
  const id = typeof field === "number" ? field : parseInt(field as string, 10);
  if (!isNaN(id) && id > 0) {
    try {
      const res = await fetch(`/wp-json/wp/v2/media/${id}`);
      if (!res.ok) return "";
      const data = await res.json();
      return data?.source_url ?? "";
    } catch {
      return "";
    }
  }
  return "";
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function GlobalOptions() {
  const [pageData, setPageData] = useState<GlobalOptionsData>(defaultData);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useMeta(
    "Global PR Distribution Services | BAP & Associates",
    "Expand your reach in 170+ countries with multilingual PR distribution. Connect with global audiences—start your campaign with us today!"
  );

  useEffect(() => {
    const fetchAcf = async () => {
      try {
        const res  = await fetch("/wp-json/wp/v2/pages/519?_fields=acf&_=" + Date.now());
        const json = await res.json();
        const acf  = json?.acf || {};

        console.log("ACF GlobalOptions DATA:", acf);

        // ── Resolve ALL images / icons in one parallel batch ──────────────
        const distCards: any[]    = acf.services_global_options_distribution_cards || [];
        const networkCards: any[] = acf.services_global_options_network_cards       || [];

        const [
          bannerImageUrl,
          ...restUrls
        ] = await Promise.all([
          resolveMediaId(acf.services_banner_bg_image),
          ...distCards.map((c: any)    => resolveMediaId(c.card_icon)),
          ...networkCards.map((c: any) => resolveMediaId(c.network_icon)),
        ]);

        const distIconUrls    = restUrls.slice(0, distCards.length);
        const networkIconUrls = restUrls.slice(distCards.length);

        // ── Build resolved distribution cards ─────────────────────────────
        const resolvedDistCards: DistributionCard[] = distCards.map((c: any, i: number) => ({
          card_icon:     c.card_icon ?? "",
          card_icon_url: distIconUrls[i] ?? "",
          card_title:    c.card_title?.trim() ?? "",
          card_description: c.card_description?.trim() ?? "",
          fallback_icon: distributionFallbackIcons[i] ?? Globe2,
        }));

        // ── Build resolved network cards ───────────────────────────────────
        const resolvedNetworkCards: NetworkCard[] = networkCards.map((c: any, i: number) => ({
          network_icon:     c.network_icon ?? "",
          network_icon_url: networkIconUrls[i] ?? "",
          network_title:    c.network_title?.trim() ?? "",
        }));

        // ── Build resolved FAQ list ────────────────────────────────────────
        const faqList: FaqItem[] = (acf.services_global_options_faq_list || []).map((f: any) => ({
          faq_question:    f.faq_question?.trim()  ?? "",
          faq_answer:      f.faq_answer?.trim()    ?? "",
          faq_default_open: f.faq_default_open     ?? false,
        }));

        setPageData((prev) => ({
          ...prev,

          // Banner
          services_banner_heading:       acf.services_banner_heading?.trim()       || prev.services_banner_heading,
          services_banner_subtitle:      acf.services_banner_subtitle?.trim()      || prev.services_banner_subtitle,
          services_banner_bg_image_url:  bannerImageUrl                            || prev.services_banner_bg_image_url,
          services_banner_overlay_color: acf.services_banner_overlay_color         || prev.services_banner_overlay_color,

          // Network
          services_global_options_network_heading:     acf.services_global_options_network_heading?.trim()     || prev.services_global_options_network_heading,
          services_global_options_network_description: acf.services_global_options_network_description?.trim() || prev.services_global_options_network_description,
          services_global_options_network_cards:       resolvedNetworkCards.length ? resolvedNetworkCards : prev.services_global_options_network_cards,

          // Distribution
          services_global_options_distribution_heading: acf.services_global_options_distribution_heading?.trim() || prev.services_global_options_distribution_heading,
          services_global_options_distribution_cards:   resolvedDistCards.length ? resolvedDistCards : prev.services_global_options_distribution_cards,

          // FAQ
          services_global_options_faq_heading:  acf.services_global_options_faq_heading?.trim()  || prev.services_global_options_faq_heading,
          services_global_options_faq_subtitle: acf.services_global_options_faq_subtitle?.trim() || prev.services_global_options_faq_subtitle,
          services_global_options_faq_list:     faqList.length ? faqList : prev.services_global_options_faq_list,
        }));

        // Set first open FAQ based on ACF faq_default_open flag
        const defaultOpenIdx = faqList.findIndex((f) => f.faq_default_open);
        setOpenFaq(defaultOpenIdx >= 0 ? defaultOpenIdx : 0);
      } catch (err) {
        console.error("ACF GlobalOptions Fetch Error:", err);
      }
    };

    fetchAcf();
  }, []);

  const {
    services_banner_heading,
    services_banner_subtitle,
    services_banner_bg_image_url,
    services_global_options_network_heading,
    services_global_options_network_description,
    services_global_options_network_cards,
    services_global_options_distribution_heading,
    services_global_options_distribution_cards,
    services_global_options_faq_heading,
    services_global_options_faq_subtitle,
    services_global_options_faq_list,
  } = pageData;

  return (
    <div className="w-full overflow-hidden">

      {/* ── Hero / Banner ─────────────────────────────────────────────────── */}
      <section className="relative py-24 bg-primary text-white">
        <div className="absolute inset-0 overflow-hidden">
          {services_banner_bg_image_url ? (
            <img
              src={services_banner_bg_image_url}
              alt="Global Network"
              className="w-full h-full object-cover opacity-20"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
          )}
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeIn>
            <h1
              className="text-4xl md:text-6xl font-display font-bold mb-6 max-w-4xl mx-auto leading-tight text-white"
              dangerouslySetInnerHTML={{ __html: services_banner_heading }}
            />
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              {services_banner_subtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Network Intro ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-heading mb-8">
              {services_global_options_network_heading}
            </h2>
            <p
              className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed mb-12"
              dangerouslySetInnerHTML={{ __html: services_global_options_network_description }}
            />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services_global_options_network_cards.map((card, i) => (
              <FadeIn key={i} delay={i * 0.2} className="h-full">
                <div className="bg-secondary/20 p-10 rounded-3xl border border-border h-full flex flex-col items-center justify-center group hover:bg-white hover:shadow-2xl transition-all duration-300">
                  <div className="h-32 mb-8 flex items-center justify-center">
                    {card.network_icon_url ? (
                      <img
                        src={card.network_icon_url}
                        alt={card.network_title}
                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                        <div className="w-10 h-10 bg-primary rounded-full" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-heading text-center leading-snug">
                    {card.network_title}
                  </h3>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Distribution Suite ────────────────────────────────────────────── */}
      <section className="py-24 bg-primary text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              {services_global_options_distribution_heading}
            </h2>
            <div className="w-24 h-2 bg-accent rounded-full" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services_global_options_distribution_cards.map((card, i) => {
              const FallbackIcon = card.fallback_icon;
              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="flex gap-6 items-start bg-white/5 p-8 rounded-3xl hover:bg-white/10 transition-colors duration-300">
                    <div className="w-14 h-14 rounded-2xl bg-accent text-white flex items-center justify-center flex-shrink-0">
                      {card.card_icon_url ? (
                        <img
                          src={card.card_icon_url}
                          alt={card.card_title}
                          className="w-7 h-7 object-contain"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        FallbackIcon && <FallbackIcon className="w-7 h-7" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold mb-3 text-white">{card.card_title}</h4>
                      <p className="text-white/70 leading-relaxed">{card.card_description}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-heading mb-6">
              {services_global_options_faq_heading}
            </h2>
            <p className="text-lg text-muted-foreground">
              {services_global_options_faq_subtitle}
            </p>
          </FadeIn>

          <div className="space-y-2">
            {services_global_options_faq_list.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <AccordionItem
                  title={faq.faq_question}
                  isOpen={openFaq === i}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.faq_answer}
                </AccordionItem>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
