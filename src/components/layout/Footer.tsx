import * as React from "react";
import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary pt-20 pb-10 border-t-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
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
            <p className="text-white/80 text-lg leading-relaxed max-w-sm">
              Efficient Solutions So You Can Focus On Running Your Business!
            </p>
            <div className="inline-block px-4 py-2 bg-white rounded-lg">
              <span className="font-bold text-primary">BBB Rating: A+</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li><Link href="/" className="text-accent hover:text-white font-semibold transition-colors duration-200 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span> HOME</Link></li>
              <li><Link href="/about" className="text-accent hover:text-white font-semibold transition-colors duration-200 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span> ABOUT US</Link></li>
              <li><Link href="/services/ir-pr-solutions" className="text-accent hover:text-white font-semibold transition-colors duration-200 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span> IR-PR-SOLUTIONS</Link></li>
              <li><Link href="/services/global-options" className="text-accent hover:text-white font-semibold transition-colors duration-200 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span> GLOBAL-OPTIONS</Link></li>
              <li><Link href="/contact" className="text-accent hover:text-white font-semibold transition-colors duration-200 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent"></span> CONTACT US</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-xl font-display font-bold text-white mb-6 relative inline-block">
              Contact us today
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-accent rounded-full"></span>
            </h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-white/80 hover:text-white transition-colors">
                <div className="mt-1 p-2 rounded-full bg-accent/20 text-accent">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Email Us</p>
                  <a href="mailto:info@BAPassociates.co.uk" className="hover:text-accent">info@BAPassociates.co.uk</a>
                </div>
              </li>
              <li className="flex items-start gap-4 text-white/80 hover:text-white transition-colors">
                <div className="mt-1 p-2 rounded-full bg-accent/20 text-accent">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Call Us (UK)</p>
                  <a href="tel:+447587029903" className="hover:text-accent">+44 758 702 9903</a>
                </div>
              </li>
              <li className="flex items-start gap-4 text-white/80 hover:text-white transition-colors">
                <div className="mt-1 p-2 rounded-full bg-accent/20 text-accent">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-white">Call Us (US)</p>
                  <a href="tel:+18005358172" className="hover:text-accent">+1 (800) 535-8172</a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center text-white/60 text-sm">
          <p>&copy; {new Date().getFullYear()} BAP & Associates LIMITED. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
