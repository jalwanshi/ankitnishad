"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUOTES = [
  "Turning Manual Workflows into Scalable Software...",
  "Bridging the Gap between Business and Tech...",
  "Optimizing Operations for Digital Growth...",
  "Empowering Businesses through Automation...",
  "Preparing the Workspace..."
];

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Cycle quotes every 1.2 seconds
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 1200);

    // Wait for document to be fully loaded
    const handleLoad = () => {
      // Minimum loading time so the user can read at least a couple of quotes
      setTimeout(() => {
        setIsLoading(false);
      }, 2500); 
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      // Fallback in case load event fails or takes too long
      setTimeout(handleLoad, 4000);
    }

    return () => {
      clearInterval(quoteInterval);
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-main-bg"
        >
          {/* Logo or Monogram */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <img 
              src="/assets/logo.png" 
              alt="Ankit Nishad Logo" 
              className="h-20 sm:h-24 md:h-32 w-auto object-contain drop-shadow-sm"
            />
          </motion.div>

          {/* Quotes */}
          <div className="h-12 flex items-center justify-center relative w-full overflow-hidden px-6 text-center max-w-[600px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={quoteIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="absolute text-xs md:text-sm font-sans font-medium text-dark-grey uppercase tracking-[0.2em]"
              >
                {QUOTES[quoteIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
          
          {/* Progress Line */}
          <div className="w-64 h-[1px] bg-border-grey mt-8 overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-primary-black w-1/3"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
