"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import ProcessSimulator from "@/components/widgets/ProcessSimulator";

export default function Process() {
  const steps = [
    {
      num: "01",
      title: "Research",
      desc: "Investigate target business domain, industry dynamics, and key operational hurdles common to competitors."
    },
    {
      num: "02",
      title: "Connect",
      desc: "Reach out via B2B campaigns or LinkedIn to initiate conversations with founders and decision makers."
    },
    {
      num: "03",
      title: "Discover",
      desc: "Deep-dive discovery call to audit their current process, mapping out exact workflow bottlenecks."
    },
    {
      num: "04",
      title: "Qualify",
      desc: "Qualify the opportunity, identifying if custom software, ERP, or API automation is the correct approach."
    },
    {
      num: "05",
      title: "Structure",
      desc: "Draft the Standard Operating Procedures (SOPs) and Software Requirement Specifications (SRS) documents."
    },
    {
      num: "06",
      title: "Present",
      desc: "Pitch the solution mockups, proposed architecture, and expected impact metrics to client stakeholders."
    },
    {
      num: "07",
      title: "Follow Up",
      desc: "Address client queries, coordinate feedback revisions with developer teams, and finalize agreements."
    },
    {
      num: "08",
      title: "Handover",
      desc: "Complete final compliance mapping, train staff on new workflows, and hand over documentation."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-main-bg py-20">
      {/* BACKGROUND WATERMARK */}
      <div className="absolute right-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] md:text-[50rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Header */}
        <div className="border-b border-border-grey pb-12 mb-16">
          <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3">
            Strategy
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-extralight text-primary-black tracking-tight">
            My Process.
          </h1>
        </div>

        {/* Introduction */}
        <div className="max-w-[800px] mb-20">
          <p className="text-base md:text-lg font-light text-dark-grey leading-relaxed">
            I follow a strict, eight-stage consultative pipeline to ensure that every client's challenge is matched with a verified, scalable, and technically sound solution.
          </p>
        </div>

        {/* Process Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.num}
              className="relative border border-border-grey bg-white p-8 hover:border-primary-black hover:shadow-sm transition-all duration-300 flex flex-col justify-between min-h-[260px]"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display text-lg font-light text-muted-grey">
                    {step.num}
                  </span>
                  {/* Process arrows connecting steps */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute right-[-16px] top-1/2 -translate-y-1/2 z-20 bg-white border border-border-grey rounded-full p-1">
                      <ArrowRight className="w-3.5 h-3.5 text-muted-grey" />
                    </div>
                  )}
                </div>
                <h3 className="font-display text-xl font-normal text-primary-black mb-3">
                  {step.title}
                </h3>
                <p className="text-xs text-dark-grey font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Indicator connecting to next step on mobile */}
              <div className="lg:hidden flex justify-center mt-6 text-muted-grey">
                {index < steps.length - 1 && <ArrowDown className="w-4 h-4" />}
              </div>
            </div>
          ))}
        </div>

        {/* Process Discovery Simulator Section */}
        <div className="mt-28">
          <ProcessSimulator />
        </div>

        {/* Bottom CTA Block */}
        <div className="border-t border-border-grey pt-16 text-center max-w-[700px] mx-auto mt-24">
          <p className="text-xs text-muted-grey font-light mb-6 uppercase tracking-widest">
            Want to see how this process applies to your business?
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-1.5 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-3.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold"
          >
            Get Started
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
