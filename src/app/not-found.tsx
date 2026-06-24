import Link from "next/link";
import Image from "next/image";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAFAFA] text-left relative overflow-hidden font-sans">
      {/* Spacer to push content to center */}
      <div />

      {/* Main Grid Container */}
      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-12 lg:px-24 py-12 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Left Side: Text Details */}
        <div className="flex flex-col items-start text-left space-y-6 max-w-md lg:w-1/2">
          <h1 className="font-display text-8xl md:text-[10rem] font-extrabold text-[#1A1A1A] leading-none tracking-tighter">
            404
          </h1>
          <h2 className="font-display text-lg md:text-xl font-bold text-[#1A1A1A] tracking-[0.25em] uppercase">
            Page Not Found
          </h2>
          <p className="text-xs md:text-sm text-[#525252] font-light leading-relaxed max-w-xs">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white hover:bg-transparent hover:text-black border border-[#1A1A1A] px-6 py-3.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-bold rounded-lg cursor-pointer"
            >
              Go Home
              <Home className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Side: Astronaut Illustration */}
        <div className="flex justify-center items-center lg:w-1/2 w-full max-w-[420px] lg:max-w-none">
          <Image
            src="/assets/astronaut_lost.png"
            alt="Lost Astronaut"
            width={450}
            height={450}
            priority
            className="w-full h-auto object-contain select-none"
          />
        </div>
      </div>

      {/* Bottom Trackbar */}
      <div className="w-full flex items-center justify-center gap-2.5 pb-12 text-[10px] uppercase tracking-widest text-[#737373] z-10 px-6 text-center">
        <div className="flex items-center gap-2 border border-[#E5E5E5] bg-white px-4 py-2.5 rounded-full shadow-sm">
          <Compass className="w-3.5 h-3.5 text-[#525252]" />
          <span>Let's get you back on track.</span>
          <Link href="/" className="font-bold text-[#1A1A1A] hover:underline underline-offset-4">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
