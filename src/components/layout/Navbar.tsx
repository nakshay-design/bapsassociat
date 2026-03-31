import * as React from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const WP_API = "/wp-json/wp/v2";

interface DropdownItem {
  label: string;
  url: string;
}

interface MenuItem {
  label: string;
  url: string;
  has_dropdown: boolean;
  dropdown_items: DropdownItem[] | null;
}

interface NavbarData {
  logo: string;
  menu_items: MenuItem[];
  cta_text: string;
  cta_link: string;
}

const defaultData: NavbarData = {
  logo: "/images/logo-icon.png",
  menu_items: [
    { label: "HOME", url: "/", has_dropdown: false, dropdown_items: null },
    { label: "ABOUT US", url: "/about", has_dropdown: false, dropdown_items: null },
    {
      label: "SERVICE",
      url: "#",
      has_dropdown: true,
      dropdown_items: [
        { label: "Global Options", url: "/services/global-options" },
        { label: "IR PR Solutions", url: "/services/ir-pr-solutions" }
      ]
    },
    { label: "CONTACT US", url: "/contact", has_dropdown: false, dropdown_items: null }
  ],
  cta_text: "Get Started",
  cta_link: "/contact"
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

export function Navbar() {
  const [location] = useLocation();
  const [data, setData] = React.useState<NavbarData>(defaultData);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<number | null>(null);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  React.useEffect(() => {
    const fetchAcf = async () => {
      try {
        const res = await fetch(`${WP_API}/pages?slug=header&_fields=id,acf&_=${Date.now()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();

        if (!json || json.length === 0 || !json[0].acf) {
          return;
        }

        const acf = json[0].acf;
        console.log("RESOLVED NAVBAR DATA:", acf);

        const mItems = Array.isArray(acf.menu_items) ? acf.menu_items : [];
        const logoUrl = await resolveMediaId(acf.logo);

        setData((prev) => ({
          ...prev,
          logo: logoUrl || prev.logo,
          menu_items: mItems.length > 0 ? mItems.map((item: any) => ({
            label: item.label || item.title || "",
            url: item.url || "#",
            has_dropdown: !!item.has_dropdown,
            dropdown_items: Array.isArray(item.dropdown_items) ? item.dropdown_items.map((sub: any) => ({
              label: sub.label || sub.title || "",
              url: sub.url || "#",
            })) : null
          })) : prev.menu_items,
          cta_text: acf.cta_text || acf.button_text || prev.cta_text,
          cta_link: acf.cta_link || acf.button_url || prev.cta_link,
        }));
      } catch (err) {
        console.error("ACF Navbar Fetch Error:", err);
      }
    };

    fetchAcf();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg shadow-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src={data.logo}
              alt="BAP Logo"
              className="w-40 h-20 object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>';
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {data.menu_items.map((item, idx) => {
              const formattedUrl = formatUrl(item.url);

              if (item.has_dropdown && item.dropdown_items) {
                const isActive = item.dropdown_items.some(sub => formatUrl(sub.url) === location);
                return (
                  <div
                    key={idx}
                    className="relative py-8"
                    onMouseEnter={() => setActiveDropdown(idx)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-1 text-sm font-bold tracking-wider transition-colors duration-200 hover:text-accent focus:outline-none",
                        isActive ? "text-accent" : "text-white"
                      )}
                    >
                      {item.label} <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", activeDropdown === idx && "rotate-180")} />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === idx && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white rounded-xl shadow-2xl border border-border py-3"
                        >
                          {item.dropdown_items.map((sub, sIdx) => {
                            const subUrl = formatUrl(sub.url);
                            return (
                              <Link
                                key={sIdx}
                                href={subUrl}
                                className={cn(
                                  "block px-6 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-accent/10 hover:text-accent",
                                  location === subUrl ? "text-accent bg-accent/5" : "text-heading"
                                )}
                              >
                                {sub.label}
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={idx}
                  href={formattedUrl}
                  className={cn(
                    "text-sm font-bold tracking-wider transition-colors duration-200 hover:text-accent",
                    location === formattedUrl ? "text-accent" : "text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            {data.cta_text && (
              <Link
                href={formatUrl(data.cta_link)}
                className="px-6 py-2.5 bg-accent text-white text-sm font-bold rounded-full hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {data.cta_text}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-accent focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary border-t border-white/10"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {data.menu_items.map((item, idx) => {
                if (item.has_dropdown && item.dropdown_items) {
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="px-4 py-2 text-sm font-bold text-white/50 tracking-wider">
                        {item.label}
                      </div>
                      {item.dropdown_items.map((sub, sIdx) => {
                        const subUrl = formatUrl(sub.url);
                        return (
                          <Link
                            key={sIdx}
                            href={subUrl}
                            className={cn(
                              "block pl-8 pr-4 py-3 rounded-lg text-base font-bold tracking-wide transition-colors",
                              location === subUrl ? "bg-accent/20 text-accent" : "text-white hover:bg-white/5"
                            )}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  );
                }

                const formattedUrl = formatUrl(item.url);
                return (
                  <Link
                    key={idx}
                    href={formattedUrl}
                    className={cn(
                      "block px-4 py-3 rounded-lg text-base font-bold tracking-wide transition-colors",
                      location === formattedUrl ? "bg-accent/20 text-accent" : "text-white hover:bg-white/5"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
