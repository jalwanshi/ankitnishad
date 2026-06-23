"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { getMetrics } from "@/services/profileService";
import { getSkills } from "@/services/skillsService";
import { Skill } from "@/types/portfolio";

export default function Expertise() {
  const [metrics, setMetrics] = useState<any>({ 
    projectsDelivered: "", 
    businessConsultations: "", 
    toolsHandled: "", 
    industryDomains: "", 
    happyClients: "", 
    automationsBuilt: "" 
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExpertiseData() {
      try {
        setLoading(true);
        const [m, s] = await Promise.all([getMetrics(), getSkills()]);
        
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
        
        if (s) {
          setSkills(s);
        }
      } catch (err) {
        console.error("Failed to load metrics or skills on expertise page:", err);
      } finally {
        setLoading(false);
      }
    }
    loadExpertiseData();
  }, []);

  const toolsList = [
    { name: "Make.com", type: "Automation Hub" },
    { name: "Zapier", type: "Automation Hub" },
    { name: "Odoo ERP", type: "Enterprise System" },
    { name: "HubSpot", type: "CRM" },
    { name: "Salesforce", type: "CRM" },
    { name: "UiPath", type: "RPA Tool" },
    { name: "Jira / Trello", type: "Management" },
    { name: "Figma", type: "Design & Mapping" },
    { name: "Google AppScript", type: "Custom Scripting" },
    { name: "MS Excel / Sheets", type: "Data Systems" }
  ];

  // Dynamic Group Descriptions map
  const groupDescriptions: Record<string, string> = {
    "Business Development": "Driving client relationships,solutioning proposals,and mapping operational objectives to system architectures.",
    "Process Automation": "Mapping current states,identifying operational bottlenecks,and designing automated database and workflow systems.",
    "Technical Development": "Designing customized database schemas,building APIs,and deploying secure scripts to run workflow systems."
  };

  // Group skills dynamically in-memory
  const groupedSkills = skills.reduce((acc, skill) => {
    const groupName = skill.group || "Other Capabilities";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getFormatPercentageLabel = (percentage: number) => {
    if (percentage >= 90) return "Expert";
    if (percentage >= 75) return "Advanced";
    return "Proficient";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-main-bg py-32 relative overflow-hidden flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-black border-t-transparent"></div>
          <span className="text-[10px] uppercase tracking-widest text-muted-grey font-medium">Loading Capabilities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-main-bg py-20">
      {/* BACKGROUND WATERMARK */}
      <div className="absolute right-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] md:text-[50rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Header */}
        <div className="border-b border-border-grey pb-12 mb-16">
          <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3 animate-fade-up">
            Capabilities
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-extralight text-primary-black tracking-tight animate-fade-up delay-100 uppercase">
            Skills & Expertise.
          </h1>
        </div>

        {/* Introduction */}
        <div className="max-w-[800px] mb-20">
          <p className="text-base md:text-lg font-light text-dark-grey leading-relaxed">
            I position my expertise at the intersection of business strategy and technical systems execution. I specialize in mapping manual operations and drafting precise product requirement specifications that ensure successful software deliveries.
          </p>
        </div>

        {/* Skill Groups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {Object.keys(groupedSkills).length === 0 ? (
            <div className="lg:col-span-2 text-center py-10 text-xs text-muted-grey uppercase tracking-widest border border-dashed border-border-grey bg-white rounded-xl">
              No capability indicators added in database.
            </div>
          ) : (
            Object.entries(groupedSkills).map(([groupTitle, groupSkills], idx) => (
              <div key={groupTitle} className="flex flex-col justify-start">
                <h3 className="font-display text-2xl font-light text-primary-black mb-2 border-b border-border-grey pb-4 uppercase tracking-wide flex items-center gap-2">
                  {groupTitle} <Sparkles className="w-4 h-4 text-accent-gold" />
                </h3>
                <p className="text-xs font-light text-muted-grey mb-8">
                  {groupDescriptions[groupTitle] || "Demonstrated professional competency and technical project execution."}
                </p>

                {/* Progress bars list */}
                <div className="space-y-6">
                  {groupSkills.map((skill, skillIdx) => (
                    <div key={skill.id} className="flex flex-col">
                      <div className="flex items-center justify-between text-xs mb-2 uppercase tracking-wider">
                        <span className="font-medium text-primary-black">{skill.name}</span>
                        <span className="text-muted-grey font-light">
                          {skill.percentage}% ({getFormatPercentageLabel(skill.percentage)})
                        </span>
                      </div>
                      {/* Animated bar background */}
                      <div className="w-full h-[3px] bg-border-grey overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: skillIdx * 0.08 }}
                          className="h-full bg-primary-black"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tools and Technologies Table */}
        <div className="border-t border-border-grey pt-20 mb-20">
          <div className="max-w-[800px] mb-12">
            <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3">
              Tools
            </span>
            <h3 className="font-display text-3xl font-light text-primary-black uppercase tracking-wide">
              Platforms & Software Ecosystem
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {toolsList.map((tool, i) => (
              <div
                key={i}
                className="border border-border-grey bg-white p-6 hover:border-primary-black hover:shadow-sm transition-all duration-300 rounded-xl"
              >
                <span className="font-display text-base font-normal text-primary-black block mb-1">
                  {tool.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-grey">
                  {tool.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Verify Statistics Counters */}
        <div className="border-t border-border-grey pt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <span className="font-display text-xs uppercase tracking-[0.2em] text-muted-grey block mb-2">
              B2B Outbound Leads
            </span>
            <span className="font-display text-4xl md:text-5xl font-light text-primary-black">
              10k+
            </span>
          </div>
          <div>
            <span className="font-display text-xs uppercase tracking-[0.2em] text-muted-grey block mb-2">
              Requirement Specs Drafted
            </span>
            <span className="font-display text-4xl md:text-5xl font-light text-primary-black">
              50+
            </span>
          </div>
          <div>
            <span className="font-display text-xs uppercase tracking-[0.2em] text-muted-grey block mb-2">
              Happy Clients
            </span>
            <span className="font-display text-4xl md:text-5xl font-light text-primary-black">
              {metrics.happyClients || "20+"}
            </span>
          </div>
          <div>
            <span className="font-display text-xs uppercase tracking-[0.2em] text-muted-grey block mb-2">
              Automations Built
            </span>
            <span className="font-display text-4xl md:text-5xl font-light text-primary-black">
              {metrics.automationsBuilt || "200+"}
            </span>
          </div>
        </div>

        {/* Final CTA */}
        <div className="border-t border-border-grey pt-16 text-center max-w-[700px] mx-auto mt-24">
          <p className="text-xs text-muted-grey font-light mb-6 uppercase tracking-widest">
            Want to audit your company's processes?
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-1.5 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-3.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold"
          >
            Get a Process Audit
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
