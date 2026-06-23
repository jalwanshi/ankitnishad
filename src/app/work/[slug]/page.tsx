"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ArrowRight, CheckCircle2, Clock, Cpu, Award } from "lucide-react";
import { getCaseStudyBySlug, getPublishedCaseStudies } from "@/services/caseStudyService";
import { CaseStudy as DbCaseStudy } from "@/types/portfolio";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CaseStudy({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [project, setProject] = useState<any>(null);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [singleProj, allProjs] = await Promise.all([
          getCaseStudyBySlug(slug),
          getPublishedCaseStudies()
        ]);
        
        if (singleProj) {
          setProject(singleProj);
        } else {
          setProject(null);
        }
        
        if (allProjs && allProjs.length > 0) {
          setProjectsList(allProjs);
        }
      } catch (err) {
        console.error("Failed to load project details:", err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-main-bg gap-4">
        <div className="w-8 h-8 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
        <span className="text-xs uppercase tracking-widest text-muted-grey font-semibold">
          Loading case study...
        </span>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  // Find next project for navigation
  const currentIndex = projectsList.findIndex((p) => p.slug === project.slug);
  const nextProject = projectsList[currentIndex !== -1 && currentIndex + 1 < projectsList.length ? currentIndex + 1 : 0];

  const timeSavedVal = project.timeSaved || project.actualResults?.timeSaved;
  const workReducedVal = project.manualWorkReduction || project.actualResults?.workReduced;
  const dataAccuracyVal = project.dataAccuracyImprovement || project.actualResults?.dataAccuracy;
  const reportingVal = project.actualResults?.reporting;

  return (
    <div className="min-h-screen bg-main-bg py-20 relative overflow-hidden">
      {/* BACKGROUND monogram */}
      <div className="absolute right-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] md:text-[50rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Navigation Breadcrumb */}
        <Link
          href="/work"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-grey hover:text-primary-black mb-12 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>

        {/* Project Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 border-b border-border-grey pb-12 mb-16">
          <div className="lg:col-span-8">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-grey block mb-3">
              {project.projectType || project.industry || "Automation"}
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extralight text-primary-black tracking-tight leading-tight">
              {project.title}
            </h1>
          </div>

          {/* Quick Specifications */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4 border-t lg:border-t-0 lg:border-l border-border-grey pt-8 lg:pt-0 lg:pl-8">
            <div>
              <span className="text-[9px] uppercase tracking-widest text-muted-grey block">Industry</span>
              <span className="text-xs font-medium text-primary-black">{project.industry}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-muted-grey block">Duration</span>
              <span className="text-xs font-medium text-primary-black">{project.timeline || "3 Months"}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-muted-grey block">System / Stack</span>
              <span className="text-xs font-medium text-primary-black">{project.platform || project.technologies?.slice(0, 2).join(", ")}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-widest text-muted-grey block">Project Year</span>
              <span className="text-xs font-medium text-primary-black">{project.year || "2024"}</span>
            </div>
          </div>
        </div>

        {/* Large Cover Image */}
        <div className="relative aspect-[16/8] w-full bg-soft-bg overflow-hidden border border-border-grey mb-20">
          <Image
            src={project.coverImageUrl || "/assets/hospital-automation-cover.png"}
            alt={project.title}
            fill
            priority
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
            sizes="100vw"
          />
        </div>

        {/* Case Study Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
          {/* Main Content Sections */}
          <div className="lg:col-span-8 space-y-12">
            {/* Client Context */}
            <div>
              <h3 className="font-display text-xl uppercase tracking-wider text-primary-black mb-4 pb-2 border-b border-border-grey">
                Client Context
              </h3>
              <p className="text-sm text-dark-grey font-light leading-relaxed whitespace-pre-line">
                {project.clientContext}
              </p>
            </div>

            {/* Business Challenge */}
            <div>
              <h3 className="font-display text-xl uppercase tracking-wider text-primary-black mb-4 pb-2 border-b border-border-grey">
                Business Challenge
              </h3>
              <p className="text-sm text-dark-grey font-light leading-relaxed mb-6 whitespace-pre-line">
                {project.businessChallenge}
              </p>

              {/* Operational Gaps */}
              {project.operationalGaps && project.operationalGaps.length > 0 && (
                <div className="bg-soft-bg p-6 border border-border-grey">
                  <span className="text-[10px] uppercase tracking-widest text-muted-grey font-semibold block mb-4">
                    Identified Operational Gaps
                  </span>
                  <ul className="space-y-3">
                    {project.operationalGaps.map((gap: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-dark-grey font-light">
                        <span className="w-1.5 h-1.5 bg-primary-black mt-1.5 shrink-0" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Proposed Solution */}
            <div>
              <h3 className="font-display text-xl uppercase tracking-wider text-primary-black mb-4 pb-2 border-b border-border-grey">
                Proposed Solution
              </h3>
              <p className="text-sm text-dark-grey font-light leading-relaxed whitespace-pre-line">
                {project.proposedSolution}
              </p>
            </div>

            {/* My specific role in the project */}
            <div className="bg-white border border-primary-black p-8 relative">
              <span className="absolute -top-3 left-6 bg-primary-black text-white text-[9px] uppercase tracking-widest px-3 py-1 font-semibold">
                My Contribution
              </span>
              <h4 className="font-display text-lg font-normal text-primary-black mb-3">
                Discovery & Solution Coordination
              </h4>
              <p className="text-xs text-dark-grey font-light leading-relaxed">
                {project.ankitRole}
              </p>
            </div>
          </div>

          {/* Sidebar Metrics and Results */}
          <div className="lg:col-span-4 sticky top-28 space-y-8">
            {/* Impact Metrics */}
            <div className="border border-border-grey bg-white p-8 space-y-6">
              <div className="border-b border-border-grey pb-4">
                <span className="text-[10px] uppercase tracking-widest text-muted-grey font-semibold">
                  Project Results
                </span>
                <h4 className="font-display text-lg font-normal text-primary-black mt-1">
                  Quantifiable Impact
                </h4>
              </div>

              <div className="space-y-6">
                {timeSavedVal && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 border border-border-grey bg-soft-bg">
                      <Clock className="w-4 h-4 text-primary-black" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-muted-grey block">Time Saved</span>
                      <span className="text-xs font-semibold text-primary-black">{timeSavedVal}</span>
                    </div>
                  </div>
                )}

                {workReducedVal && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 border border-border-grey bg-soft-bg">
                      <Cpu className="w-4 h-4 text-primary-black" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-muted-grey block">Manual Effort</span>
                      <span className="text-xs font-semibold text-primary-black">{workReducedVal}</span>
                    </div>
                  </div>
                )}

                {dataAccuracyVal && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 border border-border-grey bg-soft-bg">
                      <CheckCircle2 className="w-4 h-4 text-primary-black" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-muted-grey block">Data Accuracy</span>
                      <span className="text-xs font-semibold text-primary-black">{dataAccuracyVal}</span>
                    </div>
                  </div>
                )}

                {reportingVal && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 border border-border-grey bg-soft-bg">
                      <Award className="w-4 h-4 text-primary-black" />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-muted-grey block">Reporting</span>
                      <span className="text-xs font-semibold text-primary-black">{reportingVal}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Note on Impact claims */}
            <p className="text-[10px] text-muted-grey italic text-center px-4 leading-relaxed">
              Note: Expected projections are kept completely separate from validated final outcomes to preserve compliance data integrity.
            </p>
          </div>
        </div>

        {/* Next Project Footer Navigation */}
        {nextProject && (
          <div className="border-t border-border-grey pt-16 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-grey block mb-1">
                Next Case Study
              </span>
              <Link
                href={`/work/${nextProject.slug}`}
                className="font-display text-2xl font-light text-primary-black hover:text-muted-grey transition-colors"
              >
                {nextProject.title}
              </Link>
            </div>
            <Link
              href={`/work/${nextProject.slug}`}
              className="group inline-flex items-center gap-1.5 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-5 py-3 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold"
            >
              Read Next Case Study
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
