"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react";
import { getPublishedCaseStudies } from "@/services/caseStudyService";
import { CaseStudy } from "@/types/portfolio";
import CaseStudyCard from "@/components/work/CaseStudyCard";

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
      } finally {
        setLoading(false);
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
        const typeStr = (project.projectType || project.industry || "").toLowerCase();
        const titleStr = (project.title || "").toLowerCase();
        const technologyStr = (project.technologies || []).join(" ").toLowerCase();
        
        if (activeFilter === "Automation") {
          return typeStr.includes("automation") || titleStr.includes("automation") || technologyStr.includes("automation");
        }
        if (activeFilter === "CRM/ERP") {
          return typeStr.includes("erp") || typeStr.includes("crm") || titleStr.includes("erp") || titleStr.includes("crm") || technologyStr.includes("erp") || technologyStr.includes("crm");
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

        {/* Compact case study cards */}
        <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                key={project.id}
              >
                <CaseStudyCard
                  project={project}
                  imageSizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border-grey">
            <p className="text-xs text-muted-grey uppercase tracking-widest">
              No projects found in this category.
            </p>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-[360px] animate-pulse rounded-2xl border border-border-grey bg-white"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
