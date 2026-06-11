"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Filter } from "lucide-react";
import { getPublishedCaseStudies } from "@/services/caseStudyService";
import { CaseStudy } from "@/types/portfolio";

export default function Work() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [projects, setProjects] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await getPublishedCaseStudies();
        if (data && data.length > 0) {
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to load projects from Firestore:", err);
      }
    }
    loadProjects();
  }, []);

  const filters = [
    "All",
    "Automation",
    "CRM/ERP",
    "Document Automation",
    "E-commerce",
    "Consulting"
  ];

  // Map active filter to projects list
  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter((project) => {
        const typeStr = ((project as any).projectType || project.industry || "").toLowerCase();
        const titleStr = (project.title || "").toLowerCase();
        
        if (activeFilter === "Automation") {
          return typeStr.includes("automation") || titleStr.includes("automation");
        }
        if (activeFilter === "CRM/ERP") {
          return typeStr.includes("erp") || typeStr.includes("crm") || titleStr.includes("erp") || titleStr.includes("crm");
        }
        if (activeFilter === "Document Automation") {
          return typeStr.includes("document") || titleStr.includes("document");
        }
        if (activeFilter === "E-commerce") {
          return typeStr.includes("e-commerce") || titleStr.includes("e-commerce");
        }
        if (activeFilter === "Consulting") {
          return typeStr.includes("consulting") || titleStr.includes("consulting");
        }
        return true;
      });

  return (
    <div className="min-h-screen relative overflow-hidden bg-main-bg py-20">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute right-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] md:text-[50rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Header */}
        <div className="border-b border-border-grey pb-12 mb-16">
          <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3">
            Portfolio
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-extralight text-primary-black tracking-tight">
            Selected Work.
          </h1>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-border-grey pb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-grey">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-xs uppercase tracking-widest transition-all duration-300 border ${
                  activeFilter === filter
                    ? "bg-primary-black text-white border-primary-black"
                    : "bg-white text-muted-grey border-border-grey hover:border-primary-black hover:text-primary-black"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric Editorial Grid */}
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              const timeSavedVal = project.timeSaved || project.actualResults?.timeSaved;
              const workReducedVal = project.manualWorkReduction || project.actualResults?.workReduced;
              const yearVal = (project as any).year || (project as any).timeline || "2024";

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  key={project.id}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    className="group flex flex-col border border-border-grey bg-white hover:border-primary-black transition-all duration-300 h-full"
                  >
                    {/* Image wrapper */}
                    <div className="relative aspect-[16/10] bg-soft-bg overflow-hidden border-b border-border-grey">
                      <Image
                        src={project.coverImageUrl || "/assets/hospital-automation-cover.png"}
                        alt={project.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
                        sizes="(max-w-768px) 100vw, 600px"
                      />
                      <div className="absolute inset-0 bg-primary-black/0 group-hover:bg-primary-black/10 transition-colors duration-300" />
                      {/* View project cursor overlay (desktop only) */}
                      <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-primary-black text-white text-[10px] uppercase tracking-widest px-4 py-2 border border-primary-black">
                          View Project
                        </span>
                      </div>
                    </div>

                    {/* Context wrapper */}
                    <div className="p-8 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <span className="text-[10px] tracking-widest uppercase text-muted-grey">
                            {project.industry} • {yearVal}
                          </span>
                          <span className="text-[9px] px-2 py-0.5 border border-border-grey text-muted-grey uppercase tracking-widest rounded-full font-medium">
                            {project.published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <h3 className="font-display text-2xl font-light text-primary-black mb-3 flex items-center justify-between">
                          {project.title}
                          <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300" />
                        </h3>
                        <p className="text-xs text-dark-grey leading-relaxed font-light mb-6">
                          {project.businessChallenge}
                        </p>
                      </div>

                      {/* Results / Impact list */}
                      <div className="border-t border-border-grey pt-6 mt-4 grid grid-cols-2 gap-4">
                        {timeSavedVal && (
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-muted-grey block mb-1">
                              Time Saved
                            </span>
                            <span className="text-xs font-semibold text-primary-black">
                              {timeSavedVal}
                            </span>
                          </div>
                        )}
                        {workReducedVal && (
                          <div>
                            <span className="text-[9px] uppercase tracking-widest text-muted-grey block mb-1">
                              Manual Work Reduced
                            </span>
                            <span className="text-xs font-semibold text-primary-black">
                              {workReducedVal}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border-grey">
            <p className="text-xs text-muted-grey uppercase tracking-widest">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
