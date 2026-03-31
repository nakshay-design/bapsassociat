import { FadeIn } from "@/components/FadeIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useSubmitContact } from "@/hooks/use-contact";
import { useMeta } from "@/hooks/useMeta";
import { useEffect, useState } from "react";
import IconImage from "@/components/IconImage";

// ─── WordPress API base ───────────────────────────────────────────────────────

const WP_API = "/wp-json/wp/v2";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactFormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface OfficeItem {
  icon: number | string;
  icon_url?: string;
  title: string;
  address: string;
  phone: string;
  email?: string;
}

interface SocialLink {
  icon: number | string;
  icon_url?: string;
  url: string;
}

interface ContactData {
  // Banner
  contact_banner_heading: string;
  contact_banner_bg_color: string;
  contact_banner_text_color: string;
  contact_banner_accent_color: string;
  contact_banner_padding: string;
  contact_banner_bg_image_url: string;

  // Offices section
  contact_offices_title: string;
  contact_offices_description: string;
  contact_offices_list: OfficeItem[];

  // Socials
  contact_social_links: SocialLink[];

  // Form Section
  contact_form_title: string;
  contact_button_text: string;
}

// ─── Defaults — shown while loading / on fetch error ─────────────────────────

const defaultData: ContactData = {
  contact_banner_heading: "Get in touch with us",
  contact_banner_bg_color: "#1E3A5F",
  contact_banner_text_color: "#FFFFFF",
  contact_banner_accent_color: "#6DBE45",
  contact_banner_padding: "py-32",
  contact_banner_bg_image_url: "https://www.bapassociates.co.uk/wp-content/uploads/2025/03/Accrualjpg-018-1024x626.jpg",

  contact_offices_title: "Our Offices",
  contact_offices_description: "Whether you have a question about features, trials, pricing, need a demo, or anything else, our team is ready to answer all your questions.",
  contact_offices_list: [
    { 
      icon: "", 
      title: "Atlanta Office (US)", 
      address: "12460 Crabapple Rd\nAtlanta, GA 30004", 
      phone: "+1 (404) 702-4270",
      email: ""
    },
    { 
      icon: "", 
      title: "London Office (UK)", 
      address: "25 Old Broad St\nLondon EC2N-1HN, UK", 
      phone: "+44 20 7877 0450",
      email: "info@BAPassociates.co.uk"
    },
  ],

  contact_social_links: [],

  contact_form_title: "Send us a message",
  contact_button_text: "Send Message",
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

export default function Contact() {
  const [pageData, setPageData] = useState<ContactData>(defaultData);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>();
  const submitMutation = useSubmitContact();

  useMeta(
    "Contact US | BAP & Associates",
    "Get in touch for expert PR, investor relations & compliance solutions. Let’s grow your business globally—contact BAP & Associates now!"
  );

  const onSubmit = (data: ContactFormValues) => {
    submitMutation.mutate(data, {
      onSuccess: () => reset()
    });
  };

  useEffect(() => {
    const fetchAcf = async () => {
      try {
        // Fetch ACF data from page 643 (contact)
        const res = await fetch(`${WP_API}/pages/643?_fields=acf&_=${Date.now()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const acf = json?.acf;

        if (!acf || Object.keys(acf).length === 0) {
          console.warn("ACF Contact: No ACF data returned, using defaults.");
          setLoading(false);
          return;
        }

        console.log("ACF Contact DATA:", acf);

        // ── Collect all image fields to resolve in parallel ───────────────
        const officesList = Array.isArray(acf.contact_offices_list) ? acf.contact_offices_list : [];
        const socialLinks = Array.isArray(acf.contact_social_links) ? acf.contact_social_links : [];

        const imagePromises = [
          resolveMediaId(acf.contact_banner_bg_image),
          ...officesList.map((o: any) => resolveMediaId(o.icon)),
          ...socialLinks.map((s: any) => resolveMediaId(s.icon)),
        ];

        const [bannerBgUrl, ...restUrls] = await Promise.all(imagePromises);

        const officeIconUrls = restUrls.slice(0, officesList.length);
        const socialIconUrls = restUrls.slice(officesList.length);

        // ── Build resolved lists ───────────────────────────────
        const resolvedOffices: OfficeItem[] = officesList.map((o: any, i: number) => ({
          icon: o.icon || "",
          icon_url: officeIconUrls[i] || "",
          title: (o.title || "").trim(),
          address: (o.address || "").trim(),
          phone: (o.phone || "").trim(),
          email: (o.email || "").trim(),
        }));

        const resolvedSocials: SocialLink[] = socialLinks.map((s: any, i: number) => ({
          icon: s.icon || "",
          icon_url: socialIconUrls[i] || "",
          url: (s.url || "#").trim() || "#",
        }));

        setPageData((prev) => ({
          ...prev,

          // Banner
          contact_banner_heading: (acf.contact_banner_heading || "").trim() || prev.contact_banner_heading,
          contact_banner_bg_color: (acf.contact_banner_bg_color || "").trim() || prev.contact_banner_bg_color,
          contact_banner_text_color: (acf.contact_banner_text_color || "").trim() || prev.contact_banner_text_color,
          contact_banner_accent_color: (acf.contact_banner_accent_color || "").trim() || prev.contact_banner_accent_color,
          contact_banner_padding: (acf.contact_banner_padding || "").trim() || prev.contact_banner_padding,
          contact_banner_bg_image_url: bannerBgUrl || prev.contact_banner_bg_image_url,

          // Offices
          contact_offices_title: (acf.contact_offices_title || "").trim() || prev.contact_offices_title,
          contact_offices_description: (acf.contact_offices_description || "").trim() || prev.contact_offices_description,
          contact_offices_list: resolvedOffices.length > 0 ? resolvedOffices : prev.contact_offices_list,

          // Socials
          contact_social_links: resolvedSocials,

          // Form
          contact_form_title: (acf.contact_form_title || "").trim() || prev.contact_form_title,
          contact_button_text: (acf.contact_button_text || "").trim() || prev.contact_button_text,
        }));

      } catch (err) {
        console.error("ACF Contact Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAcf();
  }, []);

  const {
    contact_banner_heading,
    contact_banner_bg_color,
    contact_banner_text_color,
    contact_banner_accent_color,
    contact_banner_padding,
    contact_banner_bg_image_url,
    contact_offices_title,
    contact_offices_description,
    contact_offices_list,
    contact_social_links,
    contact_form_title,
    contact_button_text,
  } = pageData;

  const heroPadding = contact_banner_padding || "py-32";

  return (
    <div className="w-full bg-white">
      {/* Hero */}
      <section 
        className={`relative ${heroPadding}`} 
        style={{ backgroundColor: contact_banner_bg_color, color: contact_banner_text_color }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {contact_banner_bg_image_url ? (
            <img 
              src={contact_banner_bg_image_url} 
              alt="Contact Banner" 
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
          )}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <FadeIn>
            <h1 
              className="text-4xl md:text-6xl font-display font-bold mb-4"
              style={{ color: contact_banner_text_color }}
              dangerouslySetInnerHTML={{ __html: contact_banner_heading }}
            />
            <div 
              className="w-24 h-1.5 mx-auto rounded-full" 
              style={{ backgroundColor: contact_banner_accent_color }}
            />
          </FadeIn>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left: Contact Info */}
          <FadeIn direction="right">
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-display font-bold text-heading mb-6">
                  {contact_offices_title}
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  {contact_offices_description}
                </p>
              </div>

              {/* Offices Mapping */}
              {contact_offices_list.map((office, idx) => (
                <div key={idx} className="flex gap-6 items-start bg-secondary/30 p-8 rounded-3xl border border-border">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary flex-shrink-0 shadow-sm overflow-hidden">
                    {office.icon_url ? (
                      <IconImage src={office.icon_url} alt={office.title} size={30} className="rounded-none bg-transparent" />
                    ) : (
                      <MapPin className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-heading mb-3">{office.title}</h3>
                    <p className="text-foreground leading-relaxed mb-4 whitespace-pre-line">{office.address}</p>
                    <div className="flex flex-col gap-2 text-foreground font-semibold">
                      {office.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" style={{ color: contact_banner_accent_color }} />
                          <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="hover:text-accent transition-colors">{office.phone}</a>
                        </div>
                      )}
                      {office.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" style={{ color: contact_banner_accent_color }} />
                          <a href={`mailto:${office.email}`} className="hover:text-accent transition-colors">{office.email}</a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Socials */}
              {contact_social_links.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-heading mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    {contact_social_links.map((social, idx) => (
                      <a 
                        key={idx} 
                        href={social.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:bg-accent transition-colors duration-300 transform hover:-translate-y-1 shadow-md overflow-hidden"
                      >
                         {social.icon_url ? (
                            <IconImage src={social.icon_url} size={24} className="rounded-none bg-transparent" />
                         ) : null}
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </FadeIn>

          {/* Right: Contact Form */}
          <FadeIn direction="left">
            <div className="bg-white p-10 md:p-12 rounded-3xl shadow-2xl border border-border">
              <h2 className="text-3xl font-display font-bold text-heading mb-8">
                {contact_form_title}
              </h2>
              
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
                  style={{ backgroundColor: contact_banner_accent_color }}
                >
                  {submitMutation.isPending ? "Sending..." : contact_button_text}
                </Button>
              </form>
            </div>
          </FadeIn>

        </div>
      </section>
    </div>
  );
}
