"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus, Minus, ArrowRight } from "lucide-react";
import { servicesData } from "@/constants/portfolioData";
import { getProfile } from "@/services/profileService";
import RoiCalculator from "@/components/widgets/RoiCalculator";

export default function Services() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [profile, setProfile] = useState<any>({ fullName: "Ankit Nishad", linkedinUrl: "", bookingUrl: "" });

  useEffect(() => {
    async function loadServicesData() {
      try {
        const p = await getProfile();
        if (p) {
          setProfile(p);
        }
      } catch (err) {
        console.error("Failed to load profile details on services page:", err);
      }
    }
    loadServicesData();
  }, []);

  const toggleExpand = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  const detailedServices = [
    {
      ...servicesData[0],
      idealClient: "Founders and operations heads who feel held back by manual processes and disjointed tools.",
      techStack: "Make.com, Zapier, Google AppScript, APIs",
      industryDomain: "Real Estate, FMCG, Manufacturing, Healthcare",
      problemsSolved: [
        "Hours wasted copy-pasting data between Excel sheets and other apps",
        "Inefficient data validation causing downstream reporting mistakes",
        "No notifications or tracking for critical customer updates"
      ]
    },
    {
      ...servicesData[1],
      idealClient: "Growth-stage businesses whose unique workflows do not fit standard off-the-shelf software packages.",
      techStack: "React / Next.js, Node.js, databases (PostgreSQL/Firestore)",
      industryDomain: "Clinical Care, Operations, Engineering firms",
      problemsSolved: [
        "Inefficiency caused by standard systems with rigid workflows",
        "Inability to run custom reporting specific to internal stakeholders",
        "Slow legacy software with no modern mobile responsiveness"
      ]
    },
    {
      ...servicesData[2],
      idealClient: "Enterprise companies with legacy workflows that lack API support and rely on manual data processing.",
      techStack: "UiPath Studio, RPA Orchestrator, Python scripting",
      industryDomain: "Finance, Banking, Enterprise Back-office Operations",
      problemsSolved: [
        "Extremely high costs of operating high-volume manual reconciliations",
        "Slow response times for data matching across old desktop software",
        "Risk of compliance validation oversights due to manual fatigue"
      ]
    },
    {
      ...servicesData[3],
      idealClient: "Retailers and brands looking to streamline inventory sync and order fulfillment scaling.",
      techStack: "Shopify, Custom E-commerce, Inventory APIs",
      industryDomain: "Retailers, Wholesalers, FMCG, Pharma",
      problemsSolved: [
        "Inaccurate stock levels causing double selling across marketplaces",
        "Manual routing of orders to shipping providers causing delays",
        "Fragmented accounting mapping for e-commerce checkouts"
      ]
    },
    {
      ...servicesData[4],
      idealClient: "Founders evaluating ERP/CRM platforms or facing bottlenecks when scaling company size.",
      techStack: "Odoo ERP, HubSpot CRM, Salesforce, Miro",
      industryDomain: "Pharma, Manufacturing, Healthcare, Custom Services",
      problemsSolved: [
        "Lack of centralized operational visibility for department leads",
        "Redundant email loops and lost customer queries due to unstructured sales desks",
        "No clear Standard Operating Procedures (SOPs) for team members"
      ]
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-main-bg py-20">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute right-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] md:text-[50rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Header */}
        <div className="border-b border-border-grey pb-12 mb-16">
          <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3 animate-fade-up">
            Offerings
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-extralight text-primary-black tracking-tight animate-fade-up delay-100">
            Consulting Services.
          </h1>
        </div>

        {/* Introduction */}
        <div className="max-w-[800px] mb-20">
          <p className="text-base md:text-lg font-light text-dark-grey leading-relaxed">
            I offer end-to-end consulting services, focusing on auditing manual processes, drafting technical requirements specifications, and implementing CRM, ERP, and API automation workflows that remove bottlenecks.
          </p>
        </div>

        {/* Numbered Service Rows */}
        <div className="border-t border-border-grey">
          {detailedServices.map((service, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <div
                key={service.id}
                className="border-b border-border-grey hover:bg-soft-bg/20 transition-colors duration-300"
              >
                {/* Accordion Row Header */}
                <button
                  onClick={() => toggleExpand(index)}
                  className="w-full text-left py-10 flex items-center justify-between gap-6 focus:outline-none"
                >
                  <div className="flex items-center gap-6 md:gap-12">
                    <span className="font-display text-base font-light text-muted-grey tracking-wider">
                      {service.number}
                    </span>
                    <h2 className="font-display text-2xl md:text-3xl font-light text-primary-black hover:translate-x-1 transition-transform">
                      {service.title}
                    </h2>
                  </div>
                  <div className="p-2 border border-border-grey rounded-full bg-white hover:bg-primary-black hover:text-white transition-all duration-300">
                    {isExpanded ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {/* Accordion Content Panel */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isExpanded ? "max-h-[800px] pb-12 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-12 md:pl-20 max-w-[900px] grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
                    {/* Left Column Description */}
                    <div className="md:col-span-7 space-y-6">
                      <p className="text-sm text-dark-grey leading-relaxed font-light">
                        {service.shortDescription}
                      </p>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-muted-grey font-semibold block mb-3">
                          Common Problems Solved
                        </span>
                        <ul className="space-y-2">
                          {service.problemsSolved.map((problem, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-dark-grey font-light">
                              <span className="w-1.5 h-1.5 bg-primary-black mt-1.5 shrink-0" />
                              <span>{problem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Column Specifications */}
                    <div className="md:col-span-5 space-y-6 md:border-l md:border-border-grey md:pl-8">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-muted-grey block mb-1">
                          Ideal Client Profile
                        </span>
                        <p className="text-xs text-primary-black leading-relaxed font-normal">
                          {service.idealClient}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-muted-grey block mb-1">
                          Technologies Involved
                        </span>
                        <span className="text-xs text-dark-grey font-light">
                          {service.techStack}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-muted-grey block mb-1">
                          Target Industries
                        </span>
                        <span className="text-xs text-dark-grey font-light">
                          {service.industryDomain}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions inside accordion */}
                  <div className="pl-12 md:pl-20 mt-8">
                    <Link
                      href="/contact"
                      className="group inline-flex items-center gap-1.5 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black px-5 py-3 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold"
                    >
                      Inquire About This Service
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ROI Calculator Section */}
        <div className="mt-28">
          <RoiCalculator />
        </div>

        {/* Final CTA Contact */}
        <div className="border-t border-border-grey pt-16 text-center max-w-[700px] mx-auto mt-24">
          <p className="text-xs text-muted-grey font-light mb-6 uppercase tracking-widest">
            Don't see your specific software challenge listed?
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-1.5 border border-primary-black bg-transparent text-primary-black hover:bg-primary-black hover:text-white px-6 py-3.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold"
          >
            Request Free Discovery Call
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
