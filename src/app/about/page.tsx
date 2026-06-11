"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, CheckCircle2, Award, Lightbulb, Users2 } from "lucide-react";
import { getProfile, getMetrics } from "@/services/profileService";

const defaultAboutProfile = {
  fullName: "Ankit Nishad", professionalHeadline: "", shortTagline: "", shortBio: "", fullBio: "",
  email: "", phone: "", linkedinUrl: "", bookingUrl: "", resumeUrl: "/assets/resume.pdf",
  heroImageUrl: "/assets/hero-portrait.png", aboutImageUrl: "/assets/about-portrait.png",
  metrics: { projectsDelivered: "", businessConsultations: "", toolsHandled: "", industryDomains: "", happyClients: "", automationsBuilt: "" }
};

export default function About() {
  const [profile, setProfile] = useState<any>(defaultAboutProfile);
  const [metrics, setMetrics] = useState<any>(defaultAboutProfile.metrics);

  useEffect(() => {
    async function loadAboutData() {
      try {
        const [p, m] = await Promise.all([getProfile(), getMetrics()]);
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
            location: p.location || "India",
            linkedinEmbedCodes: p.linkedinEmbedCodes || []
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
      } catch (err) {
        console.error("Failed to load about data from Firestore:", err);
      }
    }
    loadAboutData();
  }, []);

  const brandValues = [
    {
      icon: <CheckCircle2 className="w-5 h-5 text-primary-black" />,
      title: "Outcome-Driven",
      description: "Focusing on tangible, measurable business results like hours saved, errors reduced, and revenue pipelines unlocked."
    },
    {
      icon: <Award className="w-5 h-5 text-primary-black" />,
      title: "Strategic Alignment",
      description: "Ensuring every automation or custom software solution maps directly to overall corporate expansion goals."
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-primary-black" />,
      title: "Process Clarity First",
      description: "Never automating a broken process. We map out standard operating procedures (SOPs) before writing code."
    },
    {
      icon: <Users2 className="w-5 h-5 text-primary-black" />,
      title: "Transparent Partner",
      description: "Honest requirements discovery, keeping client data confidential, and setting clear, unexaggerated timeline expectations."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-main-bg py-20">
      {/* BACKGROUND DECORATIONS */}
      {/* Huge subtle watermarked AN in the background */}
      <div className="absolute right-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] md:text-[50rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10 pt-32">
        {/* 1. Header & Title */}
        <div className="border-b border-border-grey pb-12 mb-16">
          <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3 animate-fade-up">
            Biography
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-extralight text-primary-black tracking-tight animate-fade-up delay-100">
            About Me.
          </h1>
        </div>

        {/* 2. Portrait & Biography details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          {/* Portrait Image */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 border border-border-grey translate-x-4 translate-y-4 -z-10" />
            <div className="relative aspect-[4/5] w-full max-w-[400px] bg-soft-bg overflow-hidden border border-border-grey mx-auto lg:mx-0">
              <img
                src={profile.aboutImageUrl}
                alt="Ankit Nishad working"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          {/* Biography Context */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="font-display text-2xl md:text-3xl font-light text-primary-black leading-snug mb-6">
              Bridging business communication and technical execution.
            </h2>
            <div className="space-y-6 text-dark-grey font-light text-base leading-relaxed">
              {profile.fullBio ? (
                profile.fullBio.split("\n\n").map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))
              ) : (
                <>
                  <p>
                    My professional journey is centered around understanding how organizations operate, uncovering operational inefficiencies, and architecting practical digital solutions that drive growth.
                  </p>
                  <p>
                    As a Business Development Manager and Consultant, I do not just pitch software. I coordinate initial discovery workshops, write standard operating procedures (SOPs), translate clinical and workflow requirements for developer teams, and project-manage integrations of custom ERP/CRM platforms.
                  </p>
                  <p>
                    By maintaining a highly structured, strategic approach, I ensure that technology serves the business objective, and not the other way around.
                  </p>
                </>
              )}
            </div>

            {/* Quick Details Table */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mt-10 border-t border-border-grey pt-8">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-muted-grey block">Name</span>
                <span className="text-sm font-medium text-primary-black">{profile.fullName}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-muted-grey block">Location</span>
                <span className="text-sm font-medium text-primary-black">{profile.location}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-muted-grey block">Status</span>
                <span className="text-sm font-medium text-primary-black">Open to new opportunities</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-muted-grey block">Email</span>
                <a href={`mailto:${profile.email}`} className="text-sm font-medium text-primary-black hover:underline">
                  {profile.email}
                </a>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap items-center gap-6 mt-10">
              <a
                href={profile.resumeUrl}
                download
                className="group inline-flex items-center gap-1.5 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-3.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold"
              >
                Download Resume
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-1.5 border border-border-grey hover:border-primary-black px-6 py-3.5 text-xs font-sans uppercase tracking-widest text-dark-grey hover:text-primary-black transition-all duration-300"
              >
                Let's Talk
              </Link>
            </div>
          </div>
        </div>

        {/* LinkedIn Featured Posts */}
        {profile.linkedinEmbedCodes && profile.linkedinEmbedCodes.length > 0 && (
          <div className="border-t border-border-grey pt-20 mb-20">
            <div className="max-w-[800px] mb-12">
              <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3">
                Featured Insights
              </span>
              <h3 className="font-display text-3xl font-light text-primary-black">
                From My LinkedIn
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {profile.linkedinEmbedCodes.map((code: string, index: number) => (
                <div key={index} className="flex justify-center w-full">
                  <div 
                    className="w-full grayscale hover:grayscale-0 transition-all duration-700 ease-in-out rounded-lg shadow-sm border border-border-grey bg-white flex justify-center [&>iframe]:w-full [&>iframe]:rounded-lg [&>iframe]:border-0"
                    dangerouslySetInnerHTML={{ __html: code }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Core Values Grid */}
        <div className="border-t border-border-grey pt-20 mb-20">
          <div className="max-w-[800px] mb-12">
            <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3">
              Values
            </span>
            <h3 className="font-display text-3xl font-light text-primary-black">
              Professional Principles I Stand By
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {brandValues.map((value, i) => (
              <div
                key={i}
                className="border border-border-grey bg-white p-8 hover:border-primary-black transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  {value.icon}
                  <h4 className="font-display text-lg font-normal text-primary-black">
                    {value.title}
                  </h4>
                </div>
                <p className="text-xs text-dark-grey leading-relaxed font-light">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Stats Summary Panel */}
        <div className="bg-[#151515] text-[#D1D1D1] px-8 py-12 md:py-16 md:px-16 border border-border-grey/10 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <span className="font-display text-4xl md:text-5xl font-light text-white block">
              {metrics.projectsDelivered}
            </span>
            <span className="text-[9px] tracking-widest uppercase text-muted-grey mt-2 block">
              Projects Managed
            </span>
          </div>
          <div className="text-center">
            <span className="font-display text-4xl md:text-5xl font-light text-white block">
              {metrics.toolsHandled}
            </span>
            <span className="text-[9px] tracking-widest uppercase text-muted-grey mt-2 block">
              Tools Handled
            </span>
          </div>
          <div className="text-center">
            <span className="font-display text-4xl md:text-5xl font-light text-white block">
              {metrics.industryDomains}
            </span>
            <span className="text-[9px] tracking-widest uppercase text-muted-grey mt-2 block">
              Industry Domains
            </span>
          </div>
          <div className="text-center">
            <span className="font-display text-4xl md:text-5xl font-light text-white block">
              {metrics.automationsBuilt}
            </span>
            <span className="text-[9px] tracking-widest uppercase text-muted-grey mt-2 block">
              Automations Designed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
