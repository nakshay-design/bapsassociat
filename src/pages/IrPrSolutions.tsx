import { FadeIn } from "@/components/FadeIn";
import { useMeta } from "@/hooks/useMeta";
import { useEffect, useState } from "react";

// ─── WordPress API base ───────────────────────────────────────────────────────

const WP_API = "/wp-json/wp/v2";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SectionPoint {
  text: string;
}

interface IrPrSection {
  layout: "left" | "right";
  image: number | string;
  image_url?: string;
  title: string;
  description: string;
  points: SectionPoint[] | null;
}

interface FilingCard {
  title: string;
  description: string;
}

interface DigitalBlock {
  title: string;
  description: string;
}

interface IrPrData {
  services_ir_pr_banner_heading: string;
  services_ir_pr_banner_description: string;
  services_ir_pr_banner_bg_color: string;
  services_ir_pr_banner_text_color: string;
  services_ir_pr_banner_accent_color: string;

  ir_pr_sections: IrPrSection[];

  ir_pr_filing_heading: string;
  ir_pr_filing_description: string;
  ir_pr_filing_cards: FilingCard[];
  ir_pr_filing_bg_color: string;
  ir_pr_filing_accent_color: string;

  ir_pr_digital_image: number | string;
  ir_pr_digital_image_url?: string;
  ir_pr_digital_blocks: DigitalBlock[];
}

// ─── Defaults — shown while loading / on fetch error ─────────────────────────

const defaultData: IrPrData = {
  services_ir_pr_banner_heading:
    "Investor Relations & <br/> <span class='text-accent'>PR Solutions</span>",
  services_ir_pr_banner_description:
    "Efficient solutions that empower your brand's voice and ensure flawless regulatory compliance across capital markets.",
  services_ir_pr_banner_bg_color: "#1E3557",
  services_ir_pr_banner_text_color: "#FFFFFF",
  services_ir_pr_banner_accent_color: "#6DBE45",

  ir_pr_sections: [
    {
      layout: "left",
      image: "",
      image_url: "/images/statistics.svg",
      title: "SEO, Brand & PR Management",
      description:
        "Our comprehensive public relations tools are designed to amplify your company's narrative. We construct integrated campaigns that bridge the gap between traditional PR and modern digital visibility.",
      points: [
        { text: "Target key demographics" },
        { text: "Manage corporate reputation" },
        { text: "Drive meaningful engagement" },
      ],
    },
    {
      layout: "right",
      image: "",
      image_url: "/images/Hat_SEO.png",
      title: "White Hat SEO",
      description:
        "Dominating search engine results requires a strategic, sustainable approach. We utilize strictly white-hat SEO techniques to elevate your digital presence organically.\n\nFrom technical site audits to high-quality content marketing, our strategies ensure your business ranks highly for the keywords that drive investor and consumer interest.",
      points: null,
    },
    {
      layout: "left",
      image: "",
      image_url: "/images/Brand_Management.png",
      title: "Brand Management",
      description:
        "Your brand is your most valuable asset. We provide end-to-end brand management services to ensure consistent, impactful messaging across all platforms—from social media to corporate roadshows. Let us help you craft a brand identity that commands respect and demands attention.",
      points: null,
    },
    {
      layout: "right",
      image: "",
      image_url: "/images/Global_Press_Distribution.png",
      title: "Global Press Distribution",
      description:
        "Maximize your media pickup with our premier press distribution networks. We push your news to top-tier financial terminals, newsrooms, and direct-to-investor channels simultaneously, ensuring immediate and widespread visibility.",
      points: null,
    },
  ],

  ir_pr_filing_heading: "Regulatory Compliance & Filings",
  ir_pr_filing_description:
    "Flawless execution of filing, typesetting, and financial print for all major exchanges including NYSE, NASDAQ, OTC, and TSX.",
  ir_pr_filing_cards: [
    {
      title: "EDGAR & SEDAR",
      description:
        "Seamless compliance filings with SEC and Canadian regulatory bodies.",
    },
    {
      title: "XBRL Solutions",
      description:
        "Accurate tagging and formatting for modern digital financial reporting.",
    },
    {
      title: "Annual Reports",
      description:
        "Premium typesetting and printing services for your annual corporate reports.",
    },
  ],
  ir_pr_filing_bg_color: "#1E3A5F",
  ir_pr_filing_accent_color: "#6DBE45",

  ir_pr_digital_image: "",
  ir_pr_digital_image_url: "/images/Analytics.png",
  ir_pr_digital_blocks: [
    {
      title: "Adwords, Bing & Digital Analytics",
      description:
        "Drive targeted traffic precisely when and where it matters. Our digital advertising experts manage your paid search campaigns across Google Adwords and Bing, optimizing CPC and maximizing ROI.",
    },
    {
      title: "Earnings WebCasts",
      description:
        "Deliver your quarterly results with confidence. We provide secure, high-definition webcasting and teleconferencing solutions that ensure your investors hear your message clearly, without technical interruptions.",
    },
  ],
};

// ─── Resolve WordPress media ID → URL ────────────────────────────────────────

const resolveMediaId = async (field: any): Promise<string> => {
  if (!field) return "";

  // Already a full URL string
  if (typeof field === "string" && field.startsWith("http")) return field.trim();

  // ACF image-object → { url, id, ... }
  if (typeof field === "object" && field !== null) {
    if (field.url) return String(field.url).trim();
    if (field.sizes?.large) return String(field.sizes.large).trim();
    if (field.sizes?.medium) return String(field.sizes.medium).trim();
    if (field.sizes?.thumbnail) return String(field.sizes.thumbnail).trim();
  }

  // Numeric or numeric-string media ID → fetch from WordPress
  const id = typeof field === "number" ? field : parseInt(String(field), 10);
  if (!isNaN(id) && id > 0) {
    try {
      const res = await fetch(`${WP_API}/media/${id}`);
      if (!res.ok) return "";
      const data = await res.json();
      return data?.source_url ?? "";
    } catch {
      return "";
    }
  }

  return "";
};

export default function IrPrSolutions() {
  const [pageData, setPageData] = useState<IrPrData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [seo, setSeo] = useState({
    title: "IR & PR Solutions for Business Growth | BAP & Associates",
    description: "Drive investor engagement with expert IR & PR solutions. Boost visibility, target media & markets, and grow globally - partner with BAP & Associates today!"
  });

  useMeta(seo.title, seo.description);

  useEffect(() => {
    const fetchAcf = async () => {
      try {
        // Fetch ACF data from page 585 (ir-pr-solutions)
        const res = await fetch(`${WP_API}/pages/585?_fields=acf,yoast_head_json&_=${Date.now()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        const yoast = json?.yoast_head_json || {};
        if (yoast?.title || yoast?.description) {
          setSeo(prev => ({
            title: yoast.title || prev.title,
            description: yoast.description || prev.description,
          }));
        }

        const acf = json?.acf;

        if (!acf || Object.keys(acf).length === 0) {
          console.warn("ACF IrPrSolutions: No ACF data returned, using defaults.");
          setLoading(false);
          return;
        }

        console.log("ACF IrPrSolutions DATA:", acf);

        const sectionsList: any[] = Array.isArray(acf.ir_pr_sections) ? acf.ir_pr_sections : [];

        // Collect all images to resolve
        const imagePromises = [
          ...sectionsList.map((s: any) => resolveMediaId(s.image || s.image_url || s.icon)),
          resolveMediaId(acf.ir_pr_digital_image)
        ];

        const resolvedUrls = await Promise.all(imagePromises);

        const sectionImgUrls = resolvedUrls.slice(0, sectionsList.length);
        const digitalImageUrl = resolvedUrls[resolvedUrls.length - 1];

        // Process sections
        const resolvedSections: IrPrSection[] = sectionsList.map((s: any, i: number) => ({
          layout: s.layout === "right" ? "right" : "left",
          image: s.image || "",
          image_url: sectionImgUrls[i] || defaultData.ir_pr_sections[i]?.image_url || "",
          title: (s.title || "").trim(),
          description: (s.description || "").trim(),
          points: Array.isArray(s.points) ? s.points : null
        }));

        // Processing filing cards
        const filingCards: FilingCard[] = Array.isArray(acf.ir_pr_filing_cards)
          ? acf.ir_pr_filing_cards.map((c: any) => ({
            title: (c.title || "").trim(),
            description: (c.description || "").trim()
          }))
          : [];

        // Processing digital blocks
        const digitalBlocks: DigitalBlock[] = Array.isArray(acf.ir_pr_digital_blocks)
          ? acf.ir_pr_digital_blocks.map((b: any) => ({
            title: (b.title || "").trim(),
            description: (b.description || "").trim()
          }))
          : [];

        setPageData((prev) => ({
          ...prev,

          // Banner
          services_ir_pr_banner_heading:
            (acf.services_ir_pr_banner_heading || "").trim() || prev.services_ir_pr_banner_heading,
          services_ir_pr_banner_description:
            (acf.services_ir_pr_banner_description || "").trim() || prev.services_ir_pr_banner_description,
          services_ir_pr_banner_bg_color:
            (acf.services_ir_pr_banner_bg_color || "").trim() || prev.services_ir_pr_banner_bg_color,
          services_ir_pr_banner_text_color:
            (acf.services_ir_pr_banner_text_color || "").trim() || prev.services_ir_pr_banner_text_color,
          services_ir_pr_banner_accent_color:
            (acf.services_ir_pr_banner_accent_color || "").trim() || prev.services_ir_pr_banner_accent_color,

          // Sections array
          ir_pr_sections: resolvedSections.length > 0 ? resolvedSections : prev.ir_pr_sections,

          // Filing Section
          ir_pr_filing_heading:
            (acf.ir_pr_filing_heading || "").trim() || prev.ir_pr_filing_heading,
          ir_pr_filing_description:
            (acf.ir_pr_filing_description || "").trim() || prev.ir_pr_filing_description,
          ir_pr_filing_bg_color:
            (acf.ir_pr_filing_bg_color || "").trim() || prev.ir_pr_filing_bg_color,
          ir_pr_filing_accent_color:
            (acf.ir_pr_filing_accent_color || "").trim() || prev.ir_pr_filing_accent_color,
          ir_pr_filing_cards: filingCards.length > 0 ? filingCards : prev.ir_pr_filing_cards,

          // Digital Section
          ir_pr_digital_image_url: digitalImageUrl || prev.ir_pr_digital_image_url,
          ir_pr_digital_blocks: digitalBlocks.length > 0 ? digitalBlocks : prev.ir_pr_digital_blocks,
        }));

      } catch (err) {
        console.error("ACF IrPrSolutions Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAcf();
  }, []);

  const {
    services_ir_pr_banner_heading,
    services_ir_pr_banner_description,
    services_ir_pr_banner_bg_color,
    services_ir_pr_banner_text_color,
    services_ir_pr_banner_accent_color,
    ir_pr_sections,
    ir_pr_filing_heading,
    ir_pr_filing_description,
    ir_pr_filing_cards,
    ir_pr_filing_bg_color,
    ir_pr_filing_accent_color,
    ir_pr_digital_image_url,
    ir_pr_digital_blocks,
  } = pageData;

  return (
    <div className="w-full overflow-hidden bg-white">
      {/* Hero */}
      <section
        className="relative py-24"
        style={{ backgroundColor: services_ir_pr_banner_bg_color, color: services_ir_pr_banner_text_color }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeIn>
            <h1
              className="text-4xl md:text-6xl font-display font-bold mb-6 max-w-4xl mx-auto leading-tight"
              style={{ color: services_ir_pr_banner_text_color }}
              dangerouslySetInnerHTML={{ __html: services_ir_pr_banner_heading }}
            />
            <p
              className="text-xl max-w-3xl mx-auto"
              style={{ color: `${services_ir_pr_banner_text_color}CC` }}
            >
              {services_ir_pr_banner_description}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Feature Sections alternating */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
        {ir_pr_sections.map((section, index) => {
          const isRight = section.layout === "right";

          return (
            <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image side */}
              <FadeIn direction={isRight ? "right" : "left"} className={isRight ? "lg:order-2" : ""}>
                <div className="relative p-8 rounded-3xl" style={{ backgroundColor: `${services_ir_pr_banner_accent_color}10` }}>
                  {section.image_url ? (
                    <img
                      src={section.image_url}
                      alt={section.title}
                      className="w-full h-auto object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
                      {loading ? "Loading..." : "No image provided"}
                    </div>
                  )}
                </div>
              </FadeIn>

              {/* Content side */}
              <FadeIn direction={isRight ? "left" : "right"} className={isRight ? "lg:order-1" : ""}>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-heading mb-6">
                  {section.title}
                </h2>

                {/* Support multiline descriptions using paragraph splits */}
                <div className="mb-6 space-y-4">
                  {section.description.split(/\n+/).map((p, i) => (
                    <p key={i} className="text-lg text-foreground leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>

                {section.points && section.points.length > 0 && (
                  <ul className="space-y-3 text-muted-foreground font-medium">
                    {section.points.map((pt, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: services_ir_pr_banner_accent_color }}
                        />
                        {pt.text}
                      </li>
                    ))}
                  </ul>
                )}
              </FadeIn>
            </div>
          );
        })}
      </div>

      {/* Regulatory Section */}
      <section className="py-24 text-white" style={{ backgroundColor: ir_pr_filing_bg_color }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
            <h2
              className="text-3xl md:text-5xl font-display font-bold mb-8"
              style={{ color: services_ir_pr_banner_text_color }}
            >
              {ir_pr_filing_heading}
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-12" style={{ color: "rgba(255,255,255,0.8)" }}>
              {ir_pr_filing_description}
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {ir_pr_filing_cards.map((card, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-8 border border-white/20 rounded-3xl bg-white/5 backdrop-blur-sm h-full flex flex-col text-left">
                  <h3
                    className="text-2xl font-bold mb-4"
                    style={{ color: ir_pr_filing_accent_color }}
                  >
                    {card.title}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.7)" }}>
                    {card.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Adwords & Final Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right">
            {ir_pr_digital_image_url ? (
              <img
                src={ir_pr_digital_image_url}
                alt="Analytics and Adwords"
                className="w-full h-auto rounded-3xl shadow-xl"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-64 bg-secondary/20 rounded-3xl shadow-xl flex items-center justify-center text-muted-foreground">
                {loading ? "Loading..." : "No image provided"}
              </div>
            )}
          </FadeIn>
          <FadeIn direction="left">
            {ir_pr_digital_blocks.map((block, i) => (
              <div key={i} className={i > 0 ? "mt-12" : ""}>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-heading mb-6">
                  {block.title}
                </h2>
                <div className="space-y-4">
                  {block.description.split(/\n+/).map((p, j) => (
                    <p key={j} className="text-lg text-foreground leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
