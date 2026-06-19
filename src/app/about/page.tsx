"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Award, Lightbulb, Users2 } from "lucide-react";
import { getProfile, getMetrics } from "@/services/profileService";

type AboutMetrics = {
  projectsDelivered: string;
  businessConsultations: string;
  toolsHandled: string;
  industryDomains: string;
  happyClients: string;
  automationsBuilt: string;
};

type AboutProfile = {
  fullName: string;
  professionalHeadline: string;
  shortTagline: string;
  shortBio: string;
  fullBio: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  bookingUrl: string;
  resumeUrl: string;
  heroImageUrl: string;
  aboutImageUrl: string;
  signatureImageUrl: string;
  location: string;
  linkedinEmbedCodes: string[];
};

const defaultAboutMetrics: AboutMetrics = {
  projectsDelivered: "",
  businessConsultations: "",
  toolsHandled: "",
  industryDomains: "",
  happyClients: "",
  automationsBuilt: ""
};

const defaultAboutProfile: AboutProfile = {
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
  signatureImageUrl: "/assets/image.png",
  location: "India",
  linkedinEmbedCodes: []
};

export default function About() {
  const [profile, setProfile] = useState<AboutProfile>(defaultAboutProfile);
  const [metrics, setMetrics] = useState<AboutMetrics>(defaultAboutMetrics);

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
            signatureImageUrl: p.signatureImageUrl || "/assets/image.png",
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
    <div className="min-h-screen relative overflow-hidden bg-main-bg pt-0">
      {/* BACKGROUND DECORATIONS */}
      {/* Huge subtle watermarked AN in the background */}
      <div className="absolute right-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] md:text-[50rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10 pt-4 md:pt-8">
        {/* 1. Header & Title */}
        <div className="mb-10 grid grid-cols-1 gap-8 border-b border-border-grey pb-10 md:mb-12 md:pb-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3 animate-fade-up">
              Biography
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-extralight text-primary-black tracking-tight animate-fade-up delay-100">
              About Me.
            </h1>
          </div>
          <p className="max-w-[500px] text-sm font-light leading-relaxed text-dark-grey lg:col-span-5 lg:justify-self-end">
            I connect business goals with practical software systems, clear requirements, and execution that teams can actually adopt.
          </p>
        </div>

        {/* 2. Portrait & Biography details */}
        <div className="mb-20 border-y border-border-grey md:mb-24">
          <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-black">
              Profile / 01
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-grey">
              Business Development · Automation · Software Consulting
            </span>
          </div>

          <div className="grid grid-cols-1 border-t border-border-grey lg:grid-cols-12">
            {/* Portrait Image */}
            <div className="flex flex-col p-4 sm:p-6 lg:col-span-5 lg:p-8 lg:pr-10">
              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-white">
                <Image
                  src={profile.aboutImageUrl}
                  alt="Ankit Nishad working"
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />

                <div className="absolute left-4 top-4 z-10 flex items-center gap-2 border border-[#eaeaea]/85 bg-white/90 px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur-md transition-transform duration-300 hover:scale-105">
                  <span className="font-display text-[19px] font-extrabold leading-none text-primary-black">
                    {new Date().getFullYear() - 2021}+
                  </span>
                  <span className="text-[8px] font-bold uppercase leading-tight tracking-wider text-[#555]">
                    Years<br />Experience
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1 border border-[#eaeaea]/85 bg-white/90 px-3.5 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] backdrop-blur-md transition-transform duration-300 hover:scale-105">
                  <span className="font-display text-[17px] font-extrabold leading-none text-primary-black">
                    {metrics.projectsDelivered || "20+"}
                  </span>
                  <span className="text-[8px] font-bold uppercase leading-none tracking-wider text-[#555]">
                    Projects & Clients
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 border-x border-b border-border-grey">
                <div className="border-b border-r border-border-grey p-4">
                  <span className="block text-[9px] uppercase tracking-widest text-muted-grey">Name</span>
                  <span className="mt-1 block text-sm font-medium text-primary-black">{profile.fullName}</span>
                </div>
                <div className="border-b border-border-grey p-4">
                  <span className="block text-[9px] uppercase tracking-widest text-muted-grey">Location</span>
                  <span className="mt-1 block text-sm font-medium text-primary-black">{profile.location}</span>
                </div>
                <div className="border-r border-border-grey p-4">
                  <span className="block text-[9px] uppercase tracking-widest text-muted-grey">Status</span>
                  <span className="mt-1 block text-sm font-medium text-primary-black">Open to opportunities</span>
                </div>
                <div className="p-4">
                  <span className="block text-[9px] uppercase tracking-widest text-muted-grey">Email</span>
                  <a href={`mailto:${profile.email}`} className="mt-1 block break-all text-[10px] font-medium leading-relaxed text-primary-black hover:underline sm:text-xs">
                    {profile.email}
                  </a>
                </div>
              </div>

              <div className="mt-auto border-l border-primary-black pl-4 pt-6">
                <p className="max-w-[390px] text-sm font-light leading-relaxed text-dark-grey">
                  Building practical systems that save time, reduce errors, and give teams clearer control over daily operations.
                </p>
              </div>
            </div>

            {/* Biography Context */}
            <div className="flex flex-col border-t border-border-grey p-6 sm:p-8 lg:col-span-7 lg:border-l lg:border-t-0 lg:p-10 lg:pl-12">
              <span className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-grey">
                The story behind the work
              </span>
              <h2 className="max-w-[760px] font-display text-3xl font-light leading-[1.15] text-primary-black md:text-4xl lg:text-[2.8rem]">
                Bridging business communication and technical execution.
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 text-sm font-light leading-[1.8] text-dark-grey md:grid-cols-2 md:text-[15px]">
                {profile.fullBio ? (
                  profile.fullBio.split("\n\n").map((para: string, idx: number) => (
                    <div key={idx} className="border-t border-border-grey pt-4">
                      <span className="mb-3 block font-display text-[9px] tracking-[0.2em] text-muted-grey">
                        0{idx + 1}
                      </span>
                      <p>{para}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="border-t border-border-grey pt-4">
                      <span className="mb-3 block font-display text-[9px] tracking-[0.2em] text-muted-grey">01</span>
                      <p>
                        My professional journey is centered around understanding how organizations operate, uncovering operational inefficiencies, and architecting practical digital solutions that drive growth.
                      </p>
                    </div>
                    <div className="border-t border-border-grey pt-4">
                      <span className="mb-3 block font-display text-[9px] tracking-[0.2em] text-muted-grey">02</span>
                      <p>
                        I coordinate discovery, requirements, SOPs, and custom ERP/CRM delivery so technology stays aligned with the business objective.
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Personal signature */}
              <div className="mt-auto flex flex-col items-start justify-between gap-5 border-t border-border-grey pt-5 sm:flex-row sm:items-end">
                <div className="h-[90px] w-[230px] overflow-hidden md:w-[270px]">
                  <Image
                    src={profile.signatureImageUrl}
                    alt={`${profile.fullName} signature`}
                    width={360}
                    height={240}
                    unoptimized={profile.signatureImageUrl.startsWith("data:")}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="border-l border-primary-black/20 pl-3 sm:border-l-0 sm:border-r sm:pl-0 sm:pr-3 sm:text-right">
                  <span className="block font-display text-sm text-primary-black">
                    {profile.fullName}
                  </span>
                  {profile.professionalHeadline && (
                    <span className="mt-0.5 block text-[9px] uppercase tracking-[0.18em] text-muted-grey">
                      {profile.professionalHeadline}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Focus and actions */}
          <div className="grid grid-cols-1 border-t border-border-grey lg:grid-cols-12">
            <div className="flex flex-col justify-center p-5 lg:col-span-8">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted-grey">
                Current focus
              </span>
              <p className="mt-1 text-sm font-medium text-primary-black">
                Business automation, custom software requirements, CRM/ERP systems, and workflow improvement.
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-border-grey p-5 sm:flex-row lg:col-span-4 lg:border-l lg:border-t-0">
              <a
                href={profile.resumeUrl}
                download
                className="group inline-flex flex-1 items-center justify-center gap-1.5 border border-primary-black bg-primary-black px-5 py-3.5 text-[10px] font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-transparent hover:text-primary-black"
              >
                Download Resume
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
              <Link
                href="/contact"
                className="group inline-flex flex-1 items-center justify-center gap-1.5 border border-border-grey px-5 py-3.5 text-[10px] uppercase tracking-widest text-dark-grey transition-all duration-300 hover:border-primary-black hover:text-primary-black"
              >
                Let&apos;s Talk
              </Link>
            </div>
          </div>
        </div>

        {/* LinkedIn Featured Posts */}
        {profile.linkedinEmbedCodes && profile.linkedinEmbedCodes.length > 0 && (
          <div className="mb-16 border-t border-border-grey pt-12 md:mb-20 md:pt-14">
            <div className="max-w-[800px] mb-8">
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
        <div className="border-y border-border-grey">
          <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-12 md:items-end">
            <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold md:col-span-4">
              Values
            </span>
            <h3 className="font-display text-3xl font-light text-primary-black md:col-span-8">
              Professional Principles I Stand By
            </h3>
          </div>

          <div className="grid grid-cols-1 border-t border-border-grey md:grid-cols-2 xl:grid-cols-4">
            {brandValues.map((value, i) => (
              <div
                key={i}
                className={`group bg-white p-7 transition-colors duration-300 hover:bg-soft-bg/60 ${
                  i > 0 ? "border-t border-border-grey md:border-l md:border-t-0" : ""
                } ${i === 2 ? "md:border-l-0 md:border-t xl:border-l xl:border-t-0" : ""}`}
              >
                <div className="mb-8 flex items-center justify-between gap-3">
                  <span className="font-display text-xs tracking-[0.2em] text-muted-grey">
                    0{i + 1}
                  </span>
                  <div className="transition-transform duration-300 group-hover:scale-110">
                    {value.icon}
                  </div>
                </div>
                <div>
                  <h4 className="font-display text-lg font-normal text-primary-black">
                    {value.title}
                  </h4>
                  <p className="mt-3 text-xs text-dark-grey leading-relaxed font-light">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Stats Summary Panel */}
        <div className="grid grid-cols-2 border border-border-grey/10 bg-[#151515] text-[#D1D1D1] lg:grid-cols-4">
          <div className="p-7 text-center md:p-10">
            <span className="font-display text-4xl md:text-5xl font-light text-white block">
              {metrics.projectsDelivered}
            </span>
            <span className="text-[9px] tracking-widest uppercase text-muted-grey mt-2 block">
              Projects Managed
            </span>
          </div>
          <div className="border-l border-white/10 p-7 text-center md:p-10">
            <span className="font-display text-4xl md:text-5xl font-light text-white block">
              {metrics.toolsHandled}
            </span>
            <span className="text-[9px] tracking-widest uppercase text-muted-grey mt-2 block">
              Tools Handled
            </span>
          </div>
          <div className="border-t border-white/10 p-7 text-center md:p-10 lg:border-l lg:border-t-0">
            <span className="font-display text-4xl md:text-5xl font-light text-white block">
              {metrics.industryDomains}
            </span>
            <span className="text-[9px] tracking-widest uppercase text-muted-grey mt-2 block">
              Industry Domains
            </span>
          </div>
          <div className="border-l border-t border-white/10 p-7 text-center md:p-10 lg:border-t-0">
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
