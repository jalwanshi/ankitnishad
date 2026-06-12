"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { ArrowUpRight, ArrowRight, Box, Users, Settings, BarChart, Layers, UserCog, MessageCircle, TrendingUp } from "lucide-react";
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
      <section className="relative mt-[-80px] md:mt-0 min-h-[calc(100vh-80px)] flex flex-col md:flex-row items-start md:items-center border-b border-border-grey overflow-hidden bg-main-bg">
        
        {/* MOBILE HERO (Visible only on small screens) */}
        <div className="block md:hidden relative pt-[140px] px-6 pb-12 w-full overflow-hidden min-h-[105vh]">
          
          {/* Background Gradient/White matching mockup */}
          <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FCFCFA] to-[#FCFCFA] z-[-2]"></div>

          {/* Portrait Image tightly aligned to the right edge */}
          <div className="absolute right-[-6%] top-[78px] w-[100%] min-[375px]:w-[105%] max-w-[380px] aspect-[3/4] z-0 pointer-events-none">
            <Image 
              src={profile.heroImageUrl} 
              alt="Ankit Nishad" 
              fill 
              className="object-cover object-top grayscale" 
              priority
            />
            {/* Fading the bottom and left of his torso */}
            <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#FCFCFA] via-[#FCFCFA]/90 to-transparent z-10" />
            <div className="absolute inset-y-0 left-0 w-[24%] bg-gradient-to-r from-[#FCFCFA] to-transparent z-10" />
          </div>

          <div className="relative z-10 flex flex-col w-full h-full">
            {/* Eyebrow Pill */}
            <div className="group/pill inline-flex items-center gap-2 border border-[#e5e5e5] rounded-full px-3 py-1.5 mb-6 self-start bg-white shadow-sm transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8c8c8c] group-hover/pill:bg-accent-gold transition-colors duration-300" />
              <span className="text-[9px] uppercase font-bold tracking-[0.1em] text-primary-black">
                {profile.professionalHeadline || "SOFTWARE CONSULTANT"}
              </span>
            </div>

            {/* Headline - specific wrapping to match mockup */}
            <h1 className="group/heading font-display text-[2.1rem] min-[375px]:text-[2.4rem] min-[414px]:text-[2.6rem] leading-[1.05] font-medium tracking-tight text-primary-black mb-8 max-w-[72%]">
              Turning Manual<br/>
              Workflows into<br/>
              <span className="font-semibold text-primary-black group-hover/heading:text-accent-gold transition-colors duration-500 ease-out">Smart</span> Digital<br/>
              Systems.
            </h1>

            {/* Metrics Cards - Side by Side (Horizontal) overlapping the image */}
            <div className="flex items-center gap-3 mb-8 w-full relative z-20 max-w-[85%]">
              {/* Card 1 */}
              <div className="flex-1 bg-white/95 backdrop-blur-md border border-[#eaeaea] rounded-xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] max-w-[145px] flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                   <div className="w-7 h-7 rounded-lg bg-white border border-[#eaeaea] flex items-center justify-center shrink-0">
                     <Box className="w-3.5 h-3.5 text-primary-black" strokeWidth={1.5} />
                   </div>
                   <span className="font-display text-[17px] font-bold text-primary-black leading-none">{metrics.projectsDelivered || "20+"}</span>
                </div>
                <span className="text-[9px] text-[#666] leading-[1.2] font-semibold">Projects<br/>Delivered</span>
              </div>

              {/* Card 2 */}
              <div className="flex-1 bg-white/95 backdrop-blur-md border border-[#eaeaea] rounded-xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] max-w-[145px] flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                   <div className="w-7 h-7 rounded-lg bg-white border border-[#eaeaea] flex items-center justify-center shrink-0">
                     <Users className="w-3.5 h-3.5 text-primary-black" strokeWidth={1.5} />
                   </div>
                   <span className="font-display text-[17px] font-bold text-primary-black leading-none">{metrics.businessConsultations || "150+"}</span>
                </div>
                <span className="text-[9px] text-[#666] leading-[1.2] font-semibold">Consultations<br/>Completed</span>
              </div>
            </div>

            {/* Name and Bio */}
            <div className="group/name flex flex-col items-start mb-4">
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#b3b3b3] group-hover/name:text-accent-gold transition-colors duration-500 ease-out mb-1">
                HELLO, I'M
              </span>
              <h2 className="font-display text-[2.1rem] min-[375px]:text-[2.4rem] min-[414px]:text-[2.6rem] leading-[1.1] font-semibold text-primary-black tracking-tight mb-4">
                {profile.fullName || "Ankit Nishad"}
              </h2>
              <div className="w-14 h-[2px] bg-[#d9d9d9] group-hover/name:bg-accent-gold transition-colors duration-500 ease-out mb-2"></div>
            </div>

            <p className="text-xs text-[#555] font-medium leading-[1.6] mb-8 pr-4 max-w-[75%]">
              {profile.heroSupportingText || profile.shortTagline || "I work with business owners and teams to understand operational gaps, define software requirements and build a clear roadmap for custom automation, CRM, ERP and business-management solutions."}
            </p>

            {/* CTA Buttons - Side by Side exactly like mockup */}
            <div className="flex items-center gap-3 mb-10 w-full max-w-[85%]">
              <Link href="/work" className="bg-primary-black text-white px-2 py-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 flex-1 shadow-md hover:bg-primary-black/90 transition-colors">
                View My Work <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/contact" className="bg-white text-primary-black border border-[#e5e5e5] px-2 py-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 flex-1 shadow-sm hover:bg-[#f9f9f9] transition-colors">
                Let's Talk <MessageCircle className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 4 Icon Boxes */}
            <div className="bg-white border border-[#eaeaea] rounded-2xl py-5 px-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-6 w-full">
              <div className="grid grid-cols-4 gap-1">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#f7f7f7] flex items-center justify-center border border-[#f0f0f0]">
                    <Settings className="w-4 h-4 text-primary-black" strokeWidth={1.5} />
                  </div>
                  <span className="text-[8px] min-[375px]:text-[9px] font-bold text-primary-black leading-[1.2] px-1">Automation<br/>Workflows</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#f7f7f7] flex items-center justify-center border border-[#f0f0f0]">
                    <BarChart className="w-4 h-4 text-primary-black" strokeWidth={1.5} />
                  </div>
                  <span className="text-[8px] min-[375px]:text-[9px] font-bold text-primary-black leading-[1.2] px-1">CRM<br/>Solutions</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#f7f7f7] flex items-center justify-center border border-[#f0f0f0]">
                    <Layers className="w-4 h-4 text-primary-black" strokeWidth={1.5} />
                  </div>
                  <span className="text-[8px] min-[375px]:text-[9px] font-bold text-primary-black leading-[1.2] px-1">ERP<br/>Systems</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#f7f7f7] flex items-center justify-center border border-[#f0f0f0]">
                    <UserCog className="w-4 h-4 text-primary-black" strokeWidth={1.5} />
                  </div>
                  <span className="text-[8px] min-[375px]:text-[9px] font-bold text-primary-black leading-[1.2] px-1">Business<br/>Management</span>
                </div>
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="group/banner bg-gradient-to-br from-[#f2f2f2] to-[#fafafa] hover:from-[#f8f5f0] hover:to-[#f4eedf] rounded-2xl p-4 flex items-center justify-between border border-[#eaeaea] shadow-sm w-full transition-all duration-500 ease-out">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-black flex items-center justify-center shrink-0">
                  <span className="text-white font-display text-lg tracking-widest font-light ml-1">AN</span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-bold text-primary-black leading-[1.3] max-w-[190px]">Building systems that save time, reduce errors and drive growth.</p>
                  <p className="text-[9px] text-[#888] group-hover/banner:text-accent-gold tracking-wider uppercase font-semibold transition-colors duration-500 ease-out">Strategy. Automation. Results.</p>
                </div>
              </div>
              <div className="shrink-0 text-primary-black/20 group-hover/banner:text-accent-gold pr-1 transition-colors duration-500 ease-out">
                <TrendingUp className="w-7 h-7 group-hover/banner:scale-110 transition-transform duration-500" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP HERO (Visible only on md and larger) */}
        <div className="hidden md:flex flex-col justify-center w-full min-h-[calc(100vh-80px)] relative overflow-hidden">
          {/* Background Portrait Image — blended into right side */}
          <motion.div
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 w-[50%] right-0 ml-auto">
              <Image
                src={profile.heroImageUrl}
                alt="Ankit Nishad"
                fill
                priority
                className="object-cover object-right-top grayscale"
                sizes="50vw"
              />
            </div>
            {/* Left-to-right gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-main-bg via-main-bg/90 via-[40%] to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-main-bg via-transparent to-transparent z-10" />
          </motion.div>

          {/* Vertical professional label and year */}
          <div className="absolute left-6 bottom-16 hidden xl:flex flex-col items-center gap-6 z-20 text-[10px] tracking-[0.3em] uppercase text-muted-grey">
            <span className="[writing-mode:vertical-rl] -rotate-180 select-none whitespace-nowrap">
              {profile.professionalHeadline || "IT Sales & Business Automation"}
            </span>
            <div className="w-[1px] h-16 bg-border-grey" />
            <span className="select-none font-medium text-primary-black">2026</span>
          </div>

          <div className="max-w-[1440px] mx-auto px-12 lg:px-24 w-full relative z-20 pb-12 pt-40 md:py-24">
            <div className="max-w-[700px] relative">
              {/* Top metrics summary */}
              <div className="flex gap-16 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col"
                >
                  <span className="font-display text-5xl font-light text-primary-black">
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
                  <span className="font-display text-5xl font-light text-primary-black">
                    {metrics.businessConsultations}
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-muted-grey mt-1.5">
                    Consultations Completed
                  </span>
                </motion.div>
              </div>

              {/* Hero Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mb-8"
              >
                <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3">
                  Hello, I'm {profile.fullName}
                </span>
                <h1 className="font-display text-[2.75rem] lg:text-5xl font-extralight text-primary-black tracking-tight leading-tight mb-6">
                  {profile.heroHeading ? (
                    profile.heroHeading
                  ) : (
                    <>
                      Deliver <br /> Value.
                    </>
                  )}
                </h1>
                <p className="max-w-[540px] text-base text-dark-grey font-light leading-relaxed">
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
                  className="group inline-flex items-center gap-1.5 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-3.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold shadow-md"
                >
                  View My Work
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-1.5 border border-border-grey hover:border-primary-black px-6 py-3.5 text-xs font-sans uppercase tracking-widest text-dark-grey hover:text-primary-black transition-all duration-300 backdrop-blur-sm bg-white/40 shadow-sm"
                >
                  Let's Talk
                </Link>
              </motion.div>
            </div>
          </div>
          <Script src="https://platform.linkedin.com/badges/js/profile.js" strategy="lazyOnload" />
        </div>
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
