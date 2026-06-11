import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-main-bg text-center px-6 relative overflow-hidden">
      <div className="absolute right-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] select-none pointer-events-none z-0">
        404
      </div>

      <div className="relative z-10 space-y-6 max-w-md">
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted-grey font-bold block">
          Error 404
        </span>
        <h1 className="font-display text-5xl md:text-6xl font-extralight text-primary-black tracking-tight leading-none">
          Page Not Found.
        </h1>
        <p className="text-xs md:text-sm text-dark-grey font-light leading-relaxed max-w-sm mx-auto">
          The page you are looking for does not exist, has been removed, or has changed names. Let's return to the homepage.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-3 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold"
          >
            Return Home
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
