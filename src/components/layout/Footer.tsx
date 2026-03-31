import * as React from "react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";
import IconImage from "@/components/IconImage";

const WP_API = "/wp-json/wp/v2";

interface QuickLink {
  label: string;
  url: string;
}

interface ContactItem {
  icon?: number | string;
  icon_url?: string;
  label: string;
  value: string;
}

interface FooterData {
  footer_logo: string;
  footer_description: string;
  footer_badge: string;
  quick_links_title: string;
  quick_links: QuickLink[];
  contact_title: string;
  contact_items: ContactItem[];
  footer_copyright: string;
}

const defaultData: FooterData = {
  footer_logo: "/images/logo-icon.png",
  footer_description: "Efficient Solutions So You Can Focus On Running Your Business!",
  footer_badge: "BBB Rating: A+",
  quick_links_title: "Quick Links",
  quick_links: [
    { label: "HOME", url: "/" },
    { label: "ABOUT US", url: "/about" },
    { label: "IR-PR-SOLUTIONS", url: "/services/ir-pr-solutions" },
    { label: "GLOBAL-OPTIONS", url: "/services/global-options" },
    { label: "CONTACT US", url: "/contact" },
  ],
  contact_title: "Contact us today",
  contact_items: [
    { icon_url: "", label: "Email Us", value: "info@BAPassociates.co.uk" },
    { icon_url: "", label: "Call Us (UK)", value: "+44 758 702 9903" },
    { icon_url: "", label: "Call Us (US)", value: "+1 (800) 535-8172" }
  ],
  footer_copyright: `© ${new Date().getFullYear()} BAP & Associates LIMITED. All Rights Reserved.`
};

const resolveMediaId = async (field: any): Promise<string> => {
  if (!field) return "";
  if (typeof field === "string" && field.startsWith("http")) return field.trim();
  if (typeof field === "object" && field !== null) {
    if (field.url) return String(field.url).trim();
    if (field.sizes?.large) return String(field.sizes.large).trim();
    if (field.sizes?.medium) return String(field.sizes.medium).trim();
    if (field.sizes?.thumbnail) return String(field.sizes.thumbnail).trim();
  }
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

const formatUrl = (url: string) => {
  if (!url) return "#";
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('bapassociates.co.uk') || parsed.hostname.includes('pantheonsite.io')) {
      return parsed.pathname + parsed.search + parsed.hash;
    }
  } catch {
    // URL parsing failed, probably a relative path
  }
  return url;
};

export function Footer() {
  const [data, setData] = useState<FooterData>(defaultData);

  useEffect(() => {
    const fetchAcf = async () => {
      try {
        const res = await fetch(`${WP_API}/pages?slug=footer&_fields=id,acf&_=${Date.now()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        
        if (!json || json.length === 0 || !json[0].acf) {
          return;
        }

        const acf = json[0].acf;
        console.log("RESOLVED FOOTER DATA:", acf);

        const qLinks = Array.isArray(acf.quick_links) ? acf.quick_links : [];
        const cItems = Array.isArray(acf.contact_items) ? acf.contact_items : [];

        const logoPromise = resolveMediaId(acf.footer_logo);
        const iconPromises = cItems.map((item: any) => resolveMediaId(item.icon));

        const [logoUrl, ...iconUrls] = await Promise.all([logoPromise, ...iconPromises]);

        setData((prev) => ({
          ...prev,
          footer_logo: logoUrl || prev.footer_logo,
          footer_description: acf.footer_description || prev.footer_description,
          footer_badge: acf.footer_badge || prev.footer_badge,
          quick_links_title: acf.quick_links_title || prev.quick_links_title,
          quick_links: qLinks.length > 0 ? qLinks.map((link: any) => ({
            label: link.label || link.title || "",
            url: link.url || "#"
          })) : prev.quick_links,
          contact_title: acf.contact_title || prev.contact_title,
          contact_items: cItems.length > 0 ? cItems.map((item: any, i: number) => ({
            icon_url: iconUrls[i] || "",
            label: item.label || item.title || "",
            value: item.value || item.text || ""
          })) : prev.contact_items,
          footer_copyright: acf.footer_copyright || prev.footer_copyright
        }));
      } catch (err) {
        console.error("ACF Footer Fetch Error:", err);
      }
    };

    fetchAcf();
  }, []);

  const {
    footer_logo, footer_description, footer_badge, quick_links_title,
    quick_links, contact_title, contact_items, footer_copyright
  } = data;

  return (
    <footer className="bg-primary pt-20 pb-10 border-t-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src={footer_logo} 
                alt="BAP Logo" 
                className="w-40 h-20 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>';
                }}
              />
            </Link>
            <p className="text-white/80 text-lg leading-relaxed max-w-sm whitespace-pre-line">
              {footer_description}
            </p>
            {footer_badge && (
              <div className="inline-block px-4 py-2 bg-white rounded-lg">
                <span className="font-bold text-primary">{footer_badge}</span>
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-6 relative inline-block">
              {quick_links_title}
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {quick_links.map((link, idx) => {
                const formattedUrl = formatUrl(link.url);
                const isExternal = formattedUrl.startsWith("http");

                return (
                  <li key={idx}>
                    {isExternal ? (
                      <a href={formattedUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-white font-semibold transition-colors duration-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> {link.label}
                      </a>
                    ) : (
                      <Link href={formattedUrl} className="text-accent hover:text-white font-semibold transition-colors duration-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-6 relative inline-block">
              {contact_title}
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
            </h3>
            <ul className="space-y-5">
              {contact_items.map((item, idx) => {
                const isEmail = item.value.includes('@');
                const isPhone = !isEmail && /[0-9]/.test(item.value);
                const href = isEmail ? `mailto:${item.value}` : isPhone ? `tel:${item.value.replace(/\D/g,'')}` : "#";
                
                return (
                  <li key={idx} className="flex items-start gap-4 text-white/80 hover:text-white transition-colors">
                    <div className="mt-1 p-2 rounded-full bg-accent/20 text-accent flex-shrink-0">
                      {item.icon_url ? (
                        <IconImage src={item.icon_url} alt={item.label} size={20} className="rounded-none bg-transparent" />
                      ) : (
                        isEmail ? <Mail className="w-5 h-5" /> : (isPhone ? <Phone className="w-5 h-5" /> : <MapPin className="w-5 h-5" />)
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.label}</p>
                      {href !== "#" ? (
                        <a href={href} className="hover:text-accent whitespace-pre-line">{item.value}</a>
                      ) : (
                        <span className="whitespace-pre-line">{item.value}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-white/60 text-sm">
          <p dangerouslySetInnerHTML={{ __html: footer_copyright }} />
        </div>
      </div>
    </footer>
  );
}
