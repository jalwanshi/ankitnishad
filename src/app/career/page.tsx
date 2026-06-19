"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Calendar, ChevronDown, MapPin } from "lucide-react";
import { getPublishedCareerTimeline } from "@/services/careerService";
import { CareerMilestone } from "@/types/portfolio";

function getDuration(job: CareerMilestone) {
  const start = job.startDate || "Start";
  const end = job.isCurrentRole ? "Present" : job.endDate || "Present";
  return `${start} — ${end}`;
}

function getStartDateValue(value?: string) {
  if (!value) return Number.MAX_SAFE_INTEGER;

  const months: Record<string, number> = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11
  };
  const normalized = value.trim().toLowerCase();
  const year = Number(normalized.match(/\d{4}/)?.[0]);
  const month = Object.entries(months).find(([name]) => normalized.includes(name))?.[1] ?? 0;

  return year ? new Date(year, month, 1).getTime() : Number.MAX_SAFE_INTEGER;
}

export default function Career() {
  const [career, setCareer] = useState<CareerMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    async function loadTimeline() {
      try {
        const data = await getPublishedCareerTimeline();
        setCareer(data || []);
      } catch (err) {
        console.error("Failed to load timeline from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
  }, []);

  const toggleJob = (jobId: string) => {
    setExpandedJobs((current) => {
      const next = new Set(current);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  const chronologicalCareer = useMemo(
    () =>
      [...career].sort((a, b) => {
        const dateDifference = getStartDateValue(a.startDate) - getStartDateValue(b.startDate);
        if (dateDifference !== 0) return dateDifference;
        return (b.displayOrder || 0) - (a.displayOrder || 0);
      }),
    [career]
  );

  const latestFirstCareer = useMemo(
    () => [...chronologicalCareer].reverse(),
    [chronologicalCareer]
  );

  const careerNumberById = useMemo(
    () =>
      new Map(
        chronologicalCareer.map((job, index) => [
          job.id,
          String(index + 1).padStart(2, "0")
        ])
      ),
    [chronologicalCareer]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-main-bg">
      <div className="pointer-events-none absolute left-[-100px] top-10 z-0 select-none font-display text-[30rem] font-black leading-none text-primary-black/[0.01] md:text-[50rem]">
        AN
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 pb-20 pt-4 md:px-12 md:pt-8 lg:px-24">
        {/* Original header structure, with a compact supporting line */}
        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 grid grid-cols-1 gap-7 border-b border-border-grey pb-10 md:mb-12 md:pb-12 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-8">
            <span className="mb-3 block font-display text-xs font-semibold uppercase tracking-[0.25em] text-muted-grey">
              Journey
            </span>
            <h1 className="font-display text-5xl font-extralight tracking-tight text-primary-black md:text-7xl">
              Career Timeline.
            </h1>
          </div>
          <p className="max-w-[420px] text-sm font-light leading-relaxed text-dark-grey lg:col-span-4 lg:justify-self-end">
            A timeline of client-facing roles, business growth, and practical software solutioning.
          </p>
        </motion.header>

        {/* Original alternating timeline structure */}
        <section className="relative mx-auto max-w-[1120px]">
          <div className="mb-7 flex items-center justify-between border-b border-border-grey pb-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-black">
              Experience / Latest First
            </span>
            <span className="hidden text-[9px] uppercase tracking-[0.18em] text-muted-grey sm:block">
              Growth · Learning · Impact
            </span>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[0, 1].map((item) => (
                <div key={item} className="grid animate-pulse grid-cols-1 md:grid-cols-2">
                  <div className="h-44 bg-soft-bg" />
                  <div className="h-96 border border-border-grey bg-white" />
                </div>
              ))}
            </div>
          ) : career.length > 0 ? (
            <div className="relative">
              <motion.div
                initial={reduceMotion ? false : { scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-4 left-4 top-4 z-0 w-px origin-top bg-border-grey md:left-1/2 md:-translate-x-1/2"
              />

              <div className="space-y-6 md:space-y-8">
                {latestFirstCareer.map((job, index) => {
                  const isEven = index % 2 === 0;
                  const isCurrent = job.isCurrentRole;
                  const careerNumber = careerNumberById.get(job.id) || "01";
                  const isExpanded = expandedJobs.has(job.id);
                  const visibleResponsibilities = isExpanded
                    ? job.responsibilities
                    : job.responsibilities?.slice(0, 3);
                  const visibleAchievements = isExpanded
                    ? job.achievements
                    : job.achievements?.slice(0, 2);
                  const hiddenDetailCount =
                    Math.max((job.responsibilities?.length || 0) - 3, 0) +
                    Math.max((job.achievements?.length || 0) - 2, 0);

                  return (
                    <motion.article
                      layout={!reduceMotion}
                      key={job.id}
                      className={`relative flex flex-col items-stretch md:flex-row ${
                        isEven ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      {/* Animated center marker */}
                      <motion.div
                        initial={reduceMotion ? false : { opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.25 }}
                        transition={{ duration: 0.45, delay: 0.12 }}
                        className="absolute left-4 top-7 z-20 -translate-x-[6px] md:left-1/2 md:-translate-x-1/2"
                      >
                        {isCurrent && !reduceMotion && (
                          <span className="absolute inset-0 animate-ping rounded-full bg-primary-black/20" />
                        )}
                        <span className={`relative block h-3.5 w-3.5 rounded-full border-2 border-main-bg shadow-[0_0_0_1px_rgba(20,20,20,0.22)] ${
                          isCurrent ? "bg-primary-black" : "bg-white"
                        }`} />
                      </motion.div>

                      {/* Original date/company side, visually filled to remove dead whitespace */}
                      <motion.div
                        initial={reduceMotion ? false : { opacity: 0, x: isEven ? 28 : -28 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.12 }}
                        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        className={`w-full pl-12 md:w-1/2 md:px-8 ${
                          isEven ? "md:text-left" : "md:text-right"
                        }`}
                      >
                        <div className={`relative flex min-h-[220px] flex-col justify-between overflow-hidden border-y border-border-grey bg-soft-bg/45 px-6 py-6 transition-colors duration-500 hover:bg-soft-bg/80 ${
                          isEven ? "md:items-start" : "md:items-end"
                        }`}>
                          <motion.div
                            initial={reduceMotion ? false : { scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.15 }}
                            className={`absolute top-0 h-px w-24 origin-left bg-primary-black ${
                              isEven ? "left-0" : "right-0"
                            }`}
                          />
                          <div className={`flex w-full flex-col items-start ${
                            isEven ? "md:items-start" : "md:items-end"
                          }`}>
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-muted-grey">
                              {!isEven && <Calendar className="hidden h-3.5 w-3.5 shrink-0 md:block" />}
                              <Calendar className={`h-3.5 w-3.5 shrink-0 ${!isEven ? "md:hidden" : ""}`} />
                              <span>{getDuration(job)}</span>
                            </div>

                            {job.companyLogoUrl && (
                              <div className="mt-5 flex h-12 items-center">
                                <img
                                  src={job.companyLogoUrl}
                                  alt={`${job.company} logo`}
                                  className="max-h-12 max-w-[150px] object-contain grayscale transition-all duration-500 hover:grayscale-0"
                                />
                              </div>
                            )}

                            <h3 className="mt-5 font-display text-2xl font-normal text-primary-black">
                              {job.company}
                            </h3>

                            <div className="mt-2 flex items-start gap-2 text-xs font-light text-muted-grey">
                              {!isEven && <MapPin className="hidden h-3.5 w-3.5 shrink-0 md:block" />}
                              <MapPin className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${!isEven ? "md:hidden" : ""}`} />
                              <span>
                                {job.location || "India"}
                                {job.workMode ? ` · ${job.workMode}` : ""}
                              </span>
                            </div>

                            {isCurrent && (
                              <span className="mt-5 inline-flex items-center gap-2 bg-primary-black px-3 py-1.5 text-[9px] font-semibold uppercase tracking-widest text-white">
                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                Current Role
                              </span>
                            )}

                            <div className="mt-7 grid w-full grid-cols-1 gap-5 border-t border-border-grey pt-5">
                              {job.skills?.length > 0 && (
                                <div>
                                  <span className="mb-2 block text-[8px] uppercase tracking-[0.18em] text-muted-grey">
                                    Core Skills
                                  </span>
                                  <div className={`flex flex-wrap gap-1.5 ${isEven ? "" : "md:justify-end"}`}>
                                    {job.skills.slice(0, 4).map((skill) => (
                                      <span
                                        key={skill}
                                        className="border border-border-grey bg-white/80 px-2 py-1 text-[8px] uppercase tracking-wider text-dark-grey"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                    {job.skills.length > 4 && (
                                      <span className="border border-primary-black/15 px-2 py-1 text-[8px] uppercase tracking-wider text-muted-grey">
                                        +{job.skills.length - 4}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {job.tools?.length > 0 && (
                                <div>
                                  <span className="mb-2 block text-[8px] uppercase tracking-[0.18em] text-muted-grey">
                                    Tools
                                  </span>
                                  <div className={`flex flex-wrap gap-1.5 ${isEven ? "" : "md:justify-end"}`}>
                                    {job.tools.slice(0, 4).map((tool) => (
                                      <span
                                        key={tool}
                                        className="border border-border-grey bg-white/80 px-2 py-1 text-[8px] uppercase tracking-wider text-dark-grey"
                                      >
                                        {tool}
                                      </span>
                                    ))}
                                    {job.tools.length > 4 && (
                                      <span className="border border-primary-black/15 px-2 py-1 text-[8px] uppercase tracking-wider text-muted-grey">
                                        +{job.tools.length - 4}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <motion.span
                            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.25 }}
                            className="mt-8 font-display text-6xl font-extralight leading-none text-primary-black/[0.08] md:text-7xl"
                          >
                            {careerNumber}
                          </motion.span>
                        </div>
                      </motion.div>

                      {/* Original detailed card side */}
                      <div className="mt-4 w-full pl-12 md:mt-0 md:w-1/2 md:px-8">
                        <motion.div
                          initial={reduceMotion ? false : { opacity: 0, x: isEven ? -30 : 30, y: 16 }}
                          whileInView={{ opacity: 1, x: 0, y: 0 }}
                          viewport={{ once: true, amount: 0.08 }}
                          transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
                          whileHover={reduceMotion ? undefined : { y: -4 }}
                          className={`relative border bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-colors duration-300 hover:border-primary-black md:p-7 ${
                            isCurrent ? "border-primary-black" : "border-border-grey"
                          }`}
                        >
                          <div className="mb-5 flex items-start justify-between gap-5 border-b border-border-grey pb-5">
                            <div>
                              <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-grey">
                                Designation
                              </span>
                              <h3 className="font-display text-2xl font-light leading-tight text-primary-black">
                                {job.designation}
                              </h3>
                            </div>
                            <span className="font-display text-xs tracking-[0.2em] text-muted-grey">
                              {careerNumber}
                            </span>
                          </div>

                          <p className="text-xs font-light leading-relaxed text-dark-grey">
                            {job.roleSummary}
                          </p>

                          {visibleResponsibilities && visibleResponsibilities.length > 0 && (
                            <motion.div layout={!reduceMotion} className="mt-6">
                              <span className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-muted-grey">
                                Responsibilities
                              </span>
                              <ul className="divide-y divide-border-grey border-y border-border-grey">
                                {visibleResponsibilities.map((responsibility, responsibilityIndex) => (
                                  <motion.li
                                    layout={!reduceMotion}
                                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={responsibilityIndex}
                                    className="grid grid-cols-[24px_1fr] gap-2 py-2.5 text-xs font-light leading-relaxed text-dark-grey"
                                  >
                                    <span className="font-display text-[8px] tracking-widest text-muted-grey">
                                      {String(responsibilityIndex + 1).padStart(2, "0")}
                                    </span>
                                    <span>{responsibility}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                          )}

                          {visibleAchievements && visibleAchievements.length > 0 && (
                            <motion.div layout={!reduceMotion} className="mt-6">
                              <span className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-muted-grey">
                                Key Achievements
                              </span>
                              <ul className="space-y-2">
                                {visibleAchievements.map((achievement, achievementIndex) => (
                                  <motion.li
                                    layout={!reduceMotion}
                                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={achievementIndex}
                                    className="flex items-start gap-2 text-xs font-normal leading-relaxed text-primary-black"
                                  >
                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-primary-black" />
                                    <span>{achievement}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </motion.div>
                          )}

                          {hiddenDetailCount > 0 && (
                            <button
                              type="button"
                              onClick={() => toggleJob(job.id)}
                              className="mt-6 flex w-full items-center justify-between border-y border-border-grey py-3 text-left text-[9px] font-semibold uppercase tracking-[0.16em] text-primary-black transition-colors hover:bg-soft-bg"
                            >
                              <span>
                                {isExpanded ? "Show less" : `View all details (+${hiddenDetailCount})`}
                              </span>
                              <ChevronDown
                                className={`h-3.5 w-3.5 transition-transform duration-300 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                          )}

                        </motion.div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-border-grey p-10 text-center">
              <p className="text-sm font-light text-dark-grey">
                Career milestones will appear here once they are published.
              </p>
            </div>
          )}
        </section>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-16 max-w-[700px] border-t border-border-grey pt-12 text-center md:mt-20"
        >
          <p className="mb-6 text-xs font-light uppercase tracking-widest text-muted-grey">
            Ready to streamline your operational processes?
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-1.5 border border-primary-black bg-primary-black px-6 py-3.5 text-xs font-semibold uppercase tracking-widest text-white transition-all duration-300 hover:bg-transparent hover:text-primary-black"
          >
            Let&apos;s Collaborate
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
