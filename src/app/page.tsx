"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getProfile, getMetrics } from "@/services/profileService";
import { getPublishedCareerTimeline } from "@/services/careerService";
import { getPublishedCaseStudies } from "@/services/caseStudyService";
import { CareerMilestone, CaseStudy } from "@/types/portfolio";

const defaultProfile = {
  fullName: "Ankit Nishad",
  professionalHeadline: "",
  shortTagline: "",
  shortBio: "",
  fullBio: "",
  email: "",
  phone: "",
  linkedinUrl: "",
  bookingUrl: "",
  resumeUrl: "/assets/resume.pdf",
  heroImageUrl: "/assets/hero-portrait.png",
  aboutImageUrl: "/assets/about-portrait.png",
  heroHeading: "",
  heroSupportingText: ""
};

const defaultMetrics = {
  projectsDelivered: "",
  businessConsultations: "",
  toolsHandled: "",
  industryDomains: "",
  happyClients: "",
  automationsBuilt: ""
};

export default function Home() {
  const [profile, setProfile] = useState<any>(defaultProfile);
  const [metrics, setMetrics] = useState<any>(defaultMetrics);
  const [career, setCareer] = useState<CareerMilestone[]>([]);
  const [projects, setProjects] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDynamicData() {
      try {
        const [p, m, c, pr] = await Promise.all([
          getProfile(),
          getMetrics(),
          getPublishedCareerTimeline(),
          getPublishedCaseStudies()
        ]);
        if (p) {
          setProfile({
            fullName: p.fullName,
            professionalHeadline: p.roleTitle,
            shortTagline: p.professionalTagline,
            shortBio: p.shortBio,
            fullBio: p.detailedBio,
            email: p.email,
            phone: p.phone,
            linkedinUrl: p.linkedinUrl,
            bookingUrl: p.linkedinUrl,
            resumeUrl: p.resumeUrl || "/assets/resume.pdf",
            heroImageUrl: p.heroImageUrl || "/assets/hero-portrait.png",
            aboutImageUrl: p.aboutImageUrl || "/assets/about-portrait.png",
            heroHeading: p.heroHeading || "",
            heroSupportingText: p.heroSupportingText || ""
          });
        }
        if (m) {
          setMetrics({
            projectsDelivered: m.projectsDelivered?.enabled ? m.projectsDelivered.value : "",
            businessConsultations: m.businessConsultations?.enabled ? m.businessConsultations.value : "",
            toolsHandled: m.toolsHandled?.enabled ? m.toolsHandled.value : "",
            industryDomains: m.industryDomains?.enabled ? m.industryDomains.value : "",
            happyClients: m.happyClients?.enabled ? m.happyClients.value : "",
            automationsBuilt: m.automationsBuilt?.enabled ? m.automationsBuilt.value : ""
          });
        }
        if (c) setCareer(c);
        if (pr) setProjects(pr);
      } catch (err) {
        console.error("Failed to load home page data from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDynamicData();
  }, []);

  const featuredProjects = projects.filter((p) => p.featured);

  return (
    <div className="min-h-screen relative overflow-hidden bg-main-bg">
      {/* BACKGROUND DECORATIONS */}
      {/* Huge subtle watermarked AN in the background */}
      <div className="absolute left-10 top-120 font-display font-black text-primary-black/[0.01] text-[20rem] md:text-[30rem] lg:text-[40rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-end md:items-center border-b border-border-grey overflow-hidden bg-main-bg">
        {/* Background Portrait Image — blended into right side */}
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {/* On mobile, shift image more to the right so it doesn't block text. On desktop, align to right. */}
          <div className="absolute inset-0 w-full md:w-[70%] lg:w-[60%] xl:w-[50%] right-0 ml-auto">
            <Image
              src={profile.heroImageUrl}
              alt="Ankit Nishad"
              fill
              priority
              className="object-cover object-center md:object-right-top"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          
          {/* Multi-layer gradient overlays for premium text-over-image blend */}
          {/* On mobile: Bottom-to-top gradient so face is visible at top. On desktop: Left-to-right gradient. */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-main-bg via-main-bg/90 md:via-[35%] to-transparent z-10" />
          
          {/* Bottom fade for clean section transition */}
          <div className="absolute inset-0 bg-gradient-to-t from-main-bg via-main-bg/20 md:via-transparent to-transparent z-10" />
        </motion.div>

        {/* Vertical professional label and year */}
        <div className="absolute left-6 bottom-16 hidden xl:flex flex-col items-center gap-6 z-20 text-[10px] tracking-[0.3em] uppercase text-muted-grey">
          <span className="[writing-mode:vertical-rl] -rotate-180 select-none whitespace-nowrap">
            {profile.professionalHeadline || "IT Sales & Business Automation"}
          </span>
          <div className="w-[1px] h-16 bg-border-grey" />
          <span className="select-none font-medium text-primary-black">2026</span>
        </div>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 w-full relative z-20 pb-12 pt-40 md:py-24">
          <div className="max-w-[700px] relative">
            {/* Top metrics summary */}
            <div className="flex gap-10 md:gap-16 mb-8 md:mb-12">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col"
              >
                <span className="font-display text-4xl md:text-5xl font-light text-primary-black">
                  {metrics.projectsDelivered}
                </span>
                <span className="text-[10px] tracking-widest uppercase text-muted-grey mt-1.5">
                  Projects Delivered
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex flex-col"
              >
                <span className="font-display text-4xl md:text-5xl font-light text-primary-black">
                  {metrics.businessConsultations}
                </span>
                <span className="text-[10px] tracking-widest uppercase text-muted-grey mt-1.5">
                  Consultations Completed
                </span>
              </motion.div>
            </div>

            {/* Hero Headline — reduced size */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8"
            >
              <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3">
                Hello, I'm {profile.fullName}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-extralight text-primary-black tracking-tight leading-tight mb-6">
                {profile.heroHeading ? (
                  profile.heroHeading
                ) : (
                  <>
                    Deliver <br className="hidden sm:inline" />
                    Value.
                  </>
                )}
              </h1>
              <p className="max-w-[540px] text-sm md:text-base text-dark-grey font-light leading-relaxed">
                {profile.heroSupportingText || profile.shortTagline}
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap items-center gap-6 mt-4"
            >
              <Link
                href="/work"
                className="group inline-flex items-center gap-1.5 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-3.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold"
              >
                View My Work
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-1.5 border border-border-grey hover:border-primary-black px-6 py-3.5 text-xs font-sans uppercase tracking-widest text-dark-grey hover:text-primary-black transition-all duration-300 backdrop-blur-sm bg-white/40"
              >
                Let's Talk
              </Link>
            </motion.div>
          </div>
        </div>
        <Script src="https://platform.linkedin.com/badges/js/profile.js" strategy="lazyOnload" />
      </section>

      {/* 2. INTRODUCTION SECTION */}
      <section className="py-24 border-b border-border-grey bg-soft-bg/30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold">
                Philosophy
              </span>
            </div>
            <div className="lg:col-span-8">
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-primary-black leading-tight mb-8">
                “Business growth begins with understanding the right problem.”
              </h2>
              <p className="max-w-[700px] text-base md:text-lg font-light text-dark-grey leading-relaxed whitespace-pre-line">
                {profile.fullBio}
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* 4. FEATURED SELECTED WORK */}
      <section className="py-24 border-b border-border-grey bg-soft-bg/30">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3">
                Selected Work
              </span>
              <h3 className="font-display text-3xl md:text-4xl font-light text-primary-black">
                Case Studies
              </h3>
            </div>
            <Link
              href="/work"
              className="group flex items-center gap-1.5 text-xs font-sans uppercase tracking-widest text-primary-black hover:opacity-75 transition-opacity"
            >
              All Projects
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {featuredProjects.map((project) => (
              <Link
                key={project.id}
                href={`/work/${project.slug}`}
                className="group flex flex-col border border-border-grey bg-white hover:border-primary-black transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/10] bg-soft-bg overflow-hidden border-b border-border-grey">
                  <Image
                    src={project.coverImageUrl || "/assets/hospital-automation-cover.png"}
                    alt={project.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
                    sizes="(max-w-768px) 100vw, 600px"
                  />
                  <div className="absolute inset-0 bg-primary-black/0 group-hover:bg-primary-black/10 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 text-[9px] uppercase tracking-widest text-primary-black font-semibold border border-border-grey">
                    {project.projectType || project.industry}
                  </div>
                </div>

                {/* Details */}
                <div className="p-8 flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <span className="text-[10px] tracking-widest uppercase text-muted-grey">
                        {project.industry} • {project.year || (project as any).timeline || ""}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 border border-border-grey text-muted-grey uppercase tracking-widest rounded-full font-medium">
                        {project.status}
                      </span>
                    </div>
                    <h4 className="font-display text-xl font-normal text-primary-black mb-3 group-hover:text-primary-black transition-colors flex items-center justify-between">
                      {project.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h4>
                    <p className="text-xs text-dark-grey leading-relaxed font-light mb-6">
                      {project.businessChallenge}
                    </p>
                  </div>

                  {/* Impact Results */}
                  <div className="grid grid-cols-2 gap-4 border-t border-border-grey pt-6 mt-4">
                    {(project.actualResults?.timeSaved || (project as any).timeSaved) && (
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-muted-grey block">
                          Time Saved
                        </span>
                        <span className="text-xs font-semibold text-primary-black">
                          {project.actualResults?.timeSaved || (project as any).timeSaved}
                        </span>
                      </div>
                    )}
                    {(project.actualResults?.workReduced || (project as any).manualWorkReduction) && (
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-muted-grey block">
                          Manual Labor
                        </span>
                        <span className="text-xs font-semibold text-primary-black">
                          {project.actualResults?.workReduced || (project as any).manualWorkReduction}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CAREER TIMELINE PREVIEW */}
      <section className="py-24 border-b border-border-grey">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div className="lg:col-span-5">
              <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3">
                Experience
              </span>
              <h3 className="font-display text-3xl md:text-4xl font-light text-primary-black leading-tight mb-6">
                B2B Professional Timeline
              </h3>
              <p className="text-xs text-dark-grey font-light leading-relaxed mb-8 max-w-[400px]">
                Over 5+ years of driving sales, gathering clinical/business requirements, and delivering custom ERP and workflow integrations.
              </p>
              <Link
                href="/career"
                className="group inline-flex items-center gap-1.5 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-5 py-3 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold"
              >
                View Full Timeline
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: Preview List */}
            <div className="lg:col-span-7 space-y-6">
              {career.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-grey pb-6 gap-4"
                >
                  <div>
                    <h4 className="font-display text-base font-normal text-primary-black">
                      {job.designation}
                    </h4>
                    <p className="text-[11px] uppercase tracking-widest text-muted-grey mt-1">
                      {job.company} • {job.location}
                    </p>
                  </div>
                  <span className="text-xs uppercase font-medium tracking-wider text-primary-black/85 bg-soft-bg px-3 py-1.5 border border-border-grey self-start sm:self-center">
                    {job.startDate && job.endDate ? `${job.startDate} - ${job.endDate}` : (job as any).duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* 7. FINAL CTA Let's Connect */}
      <section className="py-24 relative overflow-hidden bg-main-bg">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 items-center gap-16 lg:gap-12">
          
          {/* Text and Buttons */}
          <div className="lg:col-span-7 relative z-10 text-center lg:text-left">
            <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-4">
              Next Steps
            </span>
            <h3 className="font-display text-4xl md:text-5xl font-light text-primary-black leading-tight mb-8">
              Have a project in mind or just want to explore ideas together?
            </h3>
            
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 relative">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-1.5 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-4 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold relative z-20"
              >
                Request Free Discovery Call
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="relative inline-block z-20">
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 border border-border-grey hover:border-primary-black px-6 py-4 text-xs font-sans uppercase tracking-widest text-dark-grey hover:text-primary-black transition-all duration-300 bg-main-bg relative z-20"
                >
                  Connect on LinkedIn
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
                
                {/* Elegant Animated Arrow SVG */}
                <div className="absolute hidden lg:block left-[100%] top-1/2 -translate-y-1/2 ml-4 w-48 lg:w-[200px] xl:w-[320px] h-32 pointer-events-none z-10 opacity-70">
                  <svg viewBox="0 0 160 100" className="w-full h-full stroke-primary-black fill-none overflow-visible stroke-[1.5px]" preserveAspectRatio="none">
                    <defs>
                      <path id="snakePath" d="M 0,50 C 50,50 40,-10 95,30 C 120,50 140,50 150,50" pathLength="100" />
                    </defs>
                    
                    {/* Solid drawing line */}
                    <use href="#snakePath" strokeDasharray="100" strokeDashoffset="100" strokeLinecap="round">
                      <animate attributeName="stroke-dashoffset" values="100;0" dur="3s" repeatCount="indefinite" />
                    </use>
                    
                    {/* Arrowhead traveling along the path (Solid fill to hide gaps) */}
                    <path d="M -10,-5 L 0,0 L -10,5 Z" className="fill-primary-black stroke-none">
                      <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                        <mpath href="#snakePath" />
                      </animateMotion>
                    </path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* LinkedIn Badge Embed */}
          <div className="lg:col-span-5 relative z-10 flex justify-center lg:justify-end">
            <div className="badge-base LI-profile-badge grayscale hover:grayscale-0 transition-all duration-[800ms] ease-in-out cursor-pointer" data-locale="en_US" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="theankitnishad" data-version="v1">
              <a className="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/theankitnishad?trk=profile-badge"></a>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
