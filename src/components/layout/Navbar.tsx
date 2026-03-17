import * as React from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isServicesOpen, setIsServicesOpen] = React.useState(false);

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesOpen(false);
  }, [location]);

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "ABOUT US", href: "/about" },
  ];

  const serviceLinks = [
    { label: "Global Options", href: "/services/global-options" },
    { label: "IR PR Solutions", href: "/services/ir-pr-solutions" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-lg shadow-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-30 h-30 rounded-full flex items-center justify-center">
              <img 
                src={`${import.meta.env.BASE_URL}images/logo-icon.png`} 
                alt="BAP Logo" 
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>';
                }}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-bold tracking-wider transition-colors duration-200 hover:text-accent",
                  location === link.href ? "text-accent" : "text-white"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div 
              className="relative py-8"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button 
                className={cn(
                  "flex items-center gap-1 text-sm font-bold tracking-wider transition-colors duration-200 hover:text-accent focus:outline-none",
                  location.startsWith("/services") ? "text-accent" : "text-white"
                )}
              >
                SERVICE <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isServicesOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isServicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white rounded-xl shadow-2xl border border-border py-3"
                  >
                    {serviceLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "block px-6 py-3 text-sm font-semibold transition-colors duration-200 hover:bg-accent/10 hover:text-accent",
                          location === link.href ? "text-accent bg-accent/5" : "text-heading"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/contact"
              className={cn(
                "text-sm font-bold tracking-wider transition-colors duration-200 hover:text-accent",
                location === "/contact" ? "text-accent" : "text-white"
              )}
            >
              CONTACT US
            </Link>
            
            <Link 
              href="/contact"
              className="px-6 py-2.5 bg-accent text-white text-sm font-bold rounded-full hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
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
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-lg text-base font-bold tracking-wide transition-colors",
                    location === link.href ? "bg-accent/20 text-accent" : "text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="space-y-1">
                <div className="px-4 py-2 text-sm font-bold text-white/50 tracking-wider">SERVICES</div>
                {serviceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block pl-8 pr-4 py-3 rounded-lg text-base font-bold tracking-wide transition-colors",
                      location === link.href ? "bg-accent/20 text-accent" : "text-white hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <Link
                href="/contact"
                className={cn(
                  "block px-4 py-3 rounded-lg text-base font-bold tracking-wide transition-colors",
                  location === "/contact" ? "bg-accent/20 text-accent" : "text-white hover:bg-white/5"
                )}
              >
                CONTACT US
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
