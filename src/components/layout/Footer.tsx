"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { LinkedinIcon } from "@/components/ui/SocialIcons";
import { getProfile } from "@/services/profileService";
import { addSubscriber } from "@/services/subscriberService";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [profile, setProfile] = useState<any>({ fullName: "Ankit Nishad", roleTitle: "", email: "", phone: "", linkedinUrl: "" });

  // Newsletter state
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState({ text: "", type: "success" });

  useEffect(() => {
    async function loadFooterData() {
      try {
        const p = await getProfile();
        if (p) {
          setProfile(p);
        }
      } catch (err) {
        console.error("Failed to load footer data:", err);
      }
    }
    loadFooterData();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.trim()) return;
    setSubscribing(true);
    setSubscribeMsg({ text: "", type: "success" });

    try {
      await addSubscriber(subscriberEmail.trim());
      setSubscribeMsg({ text: "Subscribed successfully!", type: "success" });
      setSubscriberEmail("");
      setTimeout(() => setSubscribeMsg({ text: "", type: "success" }), 4000);
    } catch (err: any) {
      setSubscribeMsg({ text: err.message || "Failed to subscribe.", type: "error" });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-footer-bg text-[#D1D1D1] relative overflow-hidden pt-24 pb-12 border-t border-border-grey/10">
      {/* Background Watermark "AN" */}
      <div className="absolute right-[-50px] bottom-[-50px] font-display font-black text-[#ffffff]/[0.02] text-[20rem] md:text-[30rem] select-none pointer-events-none z-0 leading-none">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* Call to action & Newsletter Dual Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
          {/* Left Column: Call-to-action text and button */}
          <div className="lg:col-span-7 space-y-8">
            <p className="font-display font-light text-3xl md:text-5xl lg:text-6xl text-white leading-tight">
              Let's turn your business challenge into the right opportunity.
            </p>
            <Link
              href="/request-service"
              className="group inline-flex items-center gap-2 bg-white text-primary-black hover:bg-transparent hover:text-white border border-white px-6 py-4 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold"
            >
              Let's Discuss Your Project
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Right Column: Newsletter Subscription Box */}
          <div className="lg:col-span-5 bg-[#171717]/80 border border-border-grey/10 p-6 md:p-8 rounded-2xl space-y-4 max-w-md lg:ml-auto w-full">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-bold text-white flex items-center gap-1.5">
              Subscribe to Insights
            </span>
            <p className="text-[11px] text-[#A3A3A3] leading-relaxed">
              Get email newsletters on operational diagnostics, business automation blueprints, and workflow roadmaps. No spam.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={subscriberEmail}
                onChange={(e) => setSubscriberEmail(e.target.value)}
                className="w-full bg-[#262626] border border-border-grey/10 text-xs py-3.5 px-4 text-white placeholder-[#737373] focus:outline-none focus:border-white transition-colors font-light rounded-lg"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="w-full bg-white text-primary-black hover:bg-transparent hover:text-white border border-white py-3.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold cursor-pointer disabled:opacity-50 rounded-lg"
              >
                {subscribing ? "Subscribing..." : "Subscribe"}
              </button>
              {subscribeMsg.text && (
                <p className={`text-[10px] mt-2 font-medium ${
                  subscribeMsg.type === "error" ? "text-red-400" : "text-green-400"
                }`}>
                  {subscribeMsg.text}
                </p>
              )}
            </form>
          </div>
        </div>

        <hr className="border-border-grey/10 mb-16" />

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand info */}
          <div>
            <span className="font-display text-xl tracking-widest uppercase text-white font-normal block mb-4">
              {profile.fullName || "Ankit Nishad"}
            </span>
            <p className="text-xs uppercase tracking-wider text-[#A3A3A3] mb-6">
              {profile.roleTitle || "IT Sales & Automation"}
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-2 hover:text-white text-xs tracking-wider transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                {profile.email}
              </a>
              <a
                href={`tel:${profile.phone}`}
                className="flex items-center gap-2 hover:text-white text-xs tracking-wider transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                {profile.phone}
              </a>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white text-xs tracking-wider transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                LinkedIn Profile
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.2em] text-white font-semibold mb-6">
              Navigation
            </h4>
            <ul className="flex flex-col gap-3.5 text-xs tracking-wider">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">About Me</Link>
              </li>
              <li>
                <Link href="/career" className="hover:text-white transition-colors">Career Timeline</Link>
              </li>
              <li>
                <Link href="/expertise" className="hover:text-white transition-colors">Skills & Expertise</Link>
              </li>
              <li>
                <Link href="/work" className="hover:text-white transition-colors">Selected Work</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.2em] text-white font-semibold mb-6">
              Services
            </h4>
            <ul className="flex flex-col gap-3.5 text-xs tracking-wider text-[#A3A3A3]">
              <li><Link href="/services" className="hover:text-white transition-colors">Business Automation</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Custom Software Consultation</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">UiPath Automation (RPA)</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">E-commerce Solutions</Link></li>
              <li><Link href="/services" className="hover:text-white transition-colors">Business Process Mapping</Link></li>
            </ul>
          </div>

          {/* Resources & Admin */}
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.2em] text-white font-semibold mb-6">
              Resources
            </h4>
            <ul className="flex flex-col gap-3.5 text-xs tracking-wider">
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">Insights & Blog</Link>
              </li>
              <li>
                <Link href="/process" className="hover:text-white transition-colors">My Process</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li className="mt-4">
                <Link
                  href="/admin/login"
                  className="inline-block border border-border-grey/10 hover:border-white px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#A3A3A3] hover:text-white transition-all"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-[#737373]">
          <p>© {currentYear} Ankit Nishad. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Designed By <a href="https://www.linkedin.com/in/theankitnishad/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#A3A3A3] transition-colors underline decoration-[#404040] underline-offset-4">Ankit</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
