import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

export function AccordionItem({ title, children, isOpen, onClick }: AccordionItemProps) {
  return (
    <div className="border border-border rounded-2xl mb-4 overflow-hidden bg-card hover:border-primary/30 transition-colors duration-300">
      <button
        className="flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none focus-visible:bg-primary/5"
        onClick={onClick}
      >
        <span className="font-display font-semibold text-heading text-lg">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0 ml-4 text-accent"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 pt-0 text-foreground leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
