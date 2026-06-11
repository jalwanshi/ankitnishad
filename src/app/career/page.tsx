"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { getPublishedCareerTimeline } from "@/services/careerService";
import { CareerMilestone } from "@/types/portfolio";

export default function Career() {
  const [career, setCareer] = useState<CareerMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      try {
        const data = await getPublishedCareerTimeline();
        if (data && data.length > 0) {
          setCareer(data);
        }
      } catch (err) {
        console.error("Failed to load timeline from Firestore:", err);
      }
    }
    loadTimeline();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-main-bg py-20">
      {/* BACKGROUND WATERMARK */}
      <div className="absolute left-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] md:text-[50rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Header Section */}
        <div className="border-b border-border-grey pb-12 mb-20">
          <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3">
            Journey
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-extralight text-primary-black tracking-tight">
            Career Timeline.
          </h1>
        </div>

        {/* Vertical Timeline Container */}
        <div className="relative max-w-[1000px] mx-auto my-12">
          {/* Vertical central timeline line */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-[1px] bg-border-grey transform md:-translate-x-1/2 z-0" />

          {/* Timeline Milestones */}
          <div className="space-y-16 md:space-y-24">
            {career.map((job, index) => {
              const isEven = index % 2 === 0;
              const durationStr = job.startDate && job.endDate ? `${job.startDate} - ${job.endDate}` : (job as any).duration;
              const isCurrent = job.isCurrentRole || (job as any).isCurrent;

              return (
                <div
                  key={job.id}
                  className={`relative flex flex-col md:flex-row items-stretch ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* central circle bullet */}
                  <div className="absolute left-4 md:left-1/2 w-3.5 h-3.5 bg-primary-black rounded-full border-2 border-main-bg transform -translate-x-[5px] md:-translate-x-[7px] top-8 z-10" />

                  {/* Left Column: Dates & Company (Only on desktop, shifts side depending on index) */}
                  <div
                    className={`w-full md:w-1/2 pl-12 md:px-12 flex flex-col justify-start ${
                      isEven ? "md:text-left md:items-start" : "md:text-right md:items-end"
                    }`}
                  >
                    <div className={`sticky top-28 pt-6 flex flex-col items-start ${isEven ? "md:items-start" : "md:items-end"}`}>
                      
                      <div className={`flex items-center gap-2 text-xs uppercase tracking-wider text-muted-grey mb-2`}>
                        <Calendar className={`w-3.5 h-3.5 shrink-0 ${!isEven ? "md:hidden" : ""}`} />
                        <span>{durationStr}</span>
                        {!isEven && <Calendar className="w-3.5 h-3.5 shrink-0 hidden md:block" />}
                      </div>
                      
                      {job.companyLogoUrl && (
                        <div className={`mt-3 mb-4 flex pl-[22px] ${isEven ? "md:pl-[22px] md:pr-0" : "md:pl-0 md:pr-[22px]"}`}>
                          <img
                            src={job.companyLogoUrl}
                            alt={`${job.company} logo`}
                            className="h-10 md:h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500"
                          />
                        </div>
                      )}
                      
                      <h3 className={`font-display text-xl font-normal text-primary-black mt-1 pl-[22px] ${isEven ? "md:pl-[22px] md:pr-0" : "md:pl-0 md:pr-[22px]"}`}>
                        {job.company}
                      </h3>
                      
                      <div className={`flex items-center gap-2 text-xs text-muted-grey mt-2`}>
                        <MapPin className={`w-3.5 h-3.5 shrink-0 ${!isEven ? "md:hidden" : ""}`} />
                        <span>{job.location} • {job.workMode || "On-site"}</span>
                        {!isEven && <MapPin className="w-3.5 h-3.5 shrink-0 hidden md:block" />}
                      </div>
                      
                      {isCurrent && (
                        <div className={`pl-[22px] ${isEven ? "md:pl-[22px] md:pr-0" : "md:pl-0 md:pr-[22px]"}`}>
                          <span className="inline-block mt-4 text-[9px] font-sans font-semibold uppercase tracking-widest bg-primary-black text-white px-2 py-0.5 border border-primary-black">
                            Current Role
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Detailed Card */}
                  <div className="w-full md:w-1/2 pl-12 md:px-12 mt-4 md:mt-0">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className={`border p-8 bg-white hover:border-primary-black transition-colors duration-300 relative ${
                        isCurrent ? "border-primary-black shadow-sm" : "border-border-grey"
                      }`}
                    >
                      <h3 className="font-display text-2xl font-light text-primary-black mb-4">
                        {job.designation}
                      </h3>

                      <p className="text-xs text-dark-grey leading-relaxed font-light mb-6 border-b border-border-grey pb-4">
                        {job.roleSummary}
                      </p>

                      {/* Responsibilities list */}
                      {job.responsibilities && job.responsibilities.length > 0 && (
                        <div className="mb-6">
                          <span className="text-[10px] uppercase tracking-widest text-muted-grey font-semibold block mb-3">
                            Responsibilities
                          </span>
                          <ul className="space-y-2">
                            {job.responsibilities.map((resp, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-dark-grey font-light">
                                <span className="w-1.5 h-1.5 bg-primary-black mt-1.5 shrink-0" />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Achievements list */}
                      {job.achievements && job.achievements.length > 0 && (
                        <div className="mb-6">
                          <span className="text-[10px] uppercase tracking-widest text-muted-grey font-semibold block mb-3">
                            Key Achievements
                          </span>
                          <ul className="space-y-2">
                            {job.achievements.map((ach, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-primary-black font-normal">
                                <span className="w-1.5 h-1.5 bg-primary-black mt-1.5 shrink-0" />
                                <span>{ach}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Skills and tools tag grids */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-border-grey pt-6 mt-6">
                        {job.skills && job.skills.length > 0 && (
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-muted-grey block mb-2">
                              Skills
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {job.skills.map((skill, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] uppercase tracking-wider text-dark-grey bg-soft-bg border border-border-grey px-2 py-0.5"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {job.tools && job.tools.length > 0 && (
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-muted-grey block mb-2">
                              Tools Handled
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {job.tools.map((tool, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] uppercase tracking-wider text-dark-grey bg-soft-bg border border-border-grey px-2 py-0.5"
                                >
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA section */}
        <div className="border-t border-border-grey pt-16 text-center max-w-[700px] mx-auto mt-24">
          <p className="text-xs text-muted-grey font-light mb-6 uppercase tracking-widest">
            Ready to streamline your operational processes?
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-1.5 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-3.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold"
          >
            Let's Collaborate
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
