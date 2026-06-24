"use client";

import { useEffect, useState } from "react";
import { RotateCw, Settings } from "lucide-react";

export default function OfflineOverlay() {
  const [isOffline, setIsOffline] = useState(false);
  const [checking, setChecking] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    // Initial check
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);

      const handleOnline = () => {
        setIsOffline(false);
        setToastMsg("");
      };

      const handleOffline = () => {
        setIsOffline(true);
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  const checkConnectivity = async () => {
    setChecking(true);
    setToastMsg("");

    // Try fetching a lightweight public asset with a cache-buster
    try {
      const response = await fetch(`/icon.png?cb=${Date.now()}`, {
        method: "HEAD",
        cache: "no-store",
        mode: "no-cors",
      });
      
      // If we get here, network is up
      setIsOffline(false);
    } catch (err) {
      console.warn("Connectivity check failed:", err);
      setToastMsg("Still offline. Please check your network and try again.");
      setTimeout(() => setToastMsg(""), 3000);
    } finally {
      setChecking(false);
    }
  };

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-[999999] h-screen w-screen flex flex-col justify-between bg-[#FAFAFA] text-left relative overflow-hidden font-sans select-none animate-fadeIn">
      {/* Spacer to push content to center */}
      <div />

      {/* Main Grid Container */}
      <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 lg:px-24 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 flex-grow">
        
        {/* Left Side: Astronaut Offline Illustration */}
        <div className="flex justify-center items-center lg:w-1/2 w-full max-w-[320px] md:max-w-[380px] lg:max-w-none">
          <img
            src="/assets/astronaut_offline.png"
            alt="No Internet Connection"
            className="w-full h-auto max-w-[340px] md:max-w-[400px] lg:max-w-[460px] object-contain select-none"
          />
        </div>

        {/* Right Side: Text & Actions */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 lg:w-1/2 w-full max-w-md mx-auto">
          {/* Satellite Dish Custom Icon */}
          <div className="p-3 bg-white border border-[#E5E5E5] rounded-full shadow-sm">
            <svg
              className="w-8 h-8 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 20a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1" />
              <path d="M12 14v6" />
              <path d="M17 11a5 5 0 0 0-10 0" />
              <path d="M19 13a7 7 0 0 0-14 0" />
              <path d="M12 7V4" />
              <circle cx="12" cy="3" r="1" />
              <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-[#1A1A1A] leading-tight tracking-tight uppercase">
            No Internet<br className="hidden lg:block" /> Connection
          </h1>

          {/* Dash Divider with 'x' */}
          <div className="flex items-center justify-center gap-2.5 w-full max-w-[240px] text-[#A3A3A3] text-xs py-1 select-none">
            <span className="h-[1px] border-b border-dashed border-[#CCCCCC] flex-grow"></span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#888888] px-1">x</span>
            <span className="h-[1px] border-b border-dashed border-[#CCCCCC] flex-grow"></span>
          </div>

          {/* Subtext */}
          <p className="text-[11px] md:text-xs text-[#525252] font-light leading-relaxed max-w-xs">
            Looks like you're offline. Please check your connection and try again.
          </p>

          {/* Actions */}
          <div className="flex flex-col items-center lg:items-start pt-2 w-full">
            <button
              onClick={checkConnectivity}
              disabled={checking}
              className="inline-flex items-center justify-center gap-2 bg-[#1A1A1A] text-white hover:bg-transparent hover:text-black border border-[#1A1A1A] px-6 py-3.5 text-[10px] font-sans uppercase tracking-widest transition-all duration-300 font-bold rounded-lg cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
              <span>{checking ? "Checking..." : "Try Again"}</span>
            </button>

            {toastMsg && (
              <p className="text-[9px] text-red-500 font-medium mt-2.5 animate-pulse">
                {toastMsg}
              </p>
            )}

            <div 
              onClick={checkConnectivity}
              className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-[#737373] mt-5 font-semibold cursor-pointer hover:text-black transition-colors"
            >
              <Settings className="w-3 h-3" />
              <span>Check Network Settings</span>
            </div>
          </div>
        </div>

      </div>

      {/* Footer margin spacer */}
      <div className="pb-12" />
    </div>
  );
}
