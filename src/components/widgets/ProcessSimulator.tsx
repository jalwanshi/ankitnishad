"use client";

import { useState } from "react";
import { ArrowRight, ChevronRight, RefreshCw, BarChart2, ShieldAlert, Sparkles, CheckCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ProcessSimulator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Form Questions
  const questions = [
    {
      key: "focusArea",
      title: "Select your primary business operational domain:",
      options: [
        { value: "Sales & Leads", label: "Sales Pipeline & Client Onboarding" },
        { value: "Operations & Delivery", label: "Core Operations & Project Delivery" },
        { value: "Documents & Accounting", label: "Document Control & Invoice Matching" },
        { value: "Client Relations", label: "Client Portals & Customer Queries" }
      ]
    },
    {
      key: "bottleneck",
      title: "Where does the workflow break down most frequently?",
      options: [
        { value: "Data Entry", label: "Manually copy-pasting data between files & spreadsheets" },
        { value: "Communication Delay", label: "Delayed follow-ups causing lost leads or complaints" },
        { value: "Inventory Discrepancy", label: "Inventory updates or stock matching delays" },
        { value: "Status Queries", label: "Clients calling or emailing constantly to check status" }
      ]
    },
    {
      key: "currentTools",
      title: "What tool stack is your team currently running?",
      options: [
        { value: "Excel & Sheets", label: "Excel / Google Sheets / Airtable" },
        { value: "WhatsApp & Mail", label: "WhatsApp threads & Personal Gmail" },
        { value: "Paper & Manual", label: "Paper registers & physical folders" },
        { value: "Legacy Software", label: "Legacy tools that do not sync with other apps" }
      ]
    },
    {
      key: "timeline",
      title: "What is your target timeline for solving this operational bottleneck?",
      options: [
        { value: "Immediate", label: "Immediately (Within 3-4 Weeks)" },
        { value: "Medium Term", label: "Short Term (1-2 Months)" },
        { value: "Long Term", label: "Medium Term (3-6 Months)" }
      ]
    }
  ];

  const handleSelectOption = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (step < questions.length - 1) {
      setStep(prev => prev + 1);
    } else {
      setStep(questions.length); // Trigger results screen
    }
  };

  const resetSimulator = () => {
    setAnswers({});
    setStep(0);
  };

  // Diagnostic Results Mapping
  const getDiagnosis = () => {
    const focus = answers.focusArea;
    const bottleneck = answers.bottleneck;
    
    let severity = "HIGH RISK";
    let solution = "Custom software client portal + integrated Firestore database";
    let impact = "+75% response speed";

    if (bottleneck === "Data Entry") {
      severity = "CRITICAL RISK";
      solution = "Make.com / Zapier workflow triggers + custom dashboard validator";
      impact = "Saving 15+ hours/week per person";
    } else if (focus === "Sales & Leads" && bottleneck === "Communication Delay") {
      severity = "HIGH RISK";
      solution = "HubSpot/Salesforce CRM CRM workflow + instant WhatsApp bot notify integrations";
      impact = "+40% conversion rate increase";
    } else if (focus === "Documents & Accounting") {
      severity = "CRITICAL RISK";
      solution = "UiPath Studio document parser RPA + custom Odoo ERP ledger module";
      impact = "99.8% invoice matching accuracy";
    } else if (focus === "Client Relations") {
      severity = "MODERATE RISK";
      solution = "Next.js secure client portal with live database status lookups";
      impact = "-80% status check phone calls";
    }

    return { severity, solution, impact };
  };

  const getPreFilledContactUrl = () => {
    const diagnosis = getDiagnosis();
    const challengeText = encodeURIComponent(
      `Process Audit diagnosis results: Area of focus: ${answers.focusArea}. Bottleneck: ${answers.bottleneck}. Current setup uses: ${answers.currentTools}. Target solution: ${diagnosis.solution} with ${diagnosis.impact}.`
    );
    return `/contact?service=consulting&challenge=${challengeText}`;
  };

  const diagnosis = step === questions.length ? getDiagnosis() : null;

  return (
    <div className="border border-border-grey bg-white rounded-2xl p-6 md:p-12 shadow-xs max-w-4xl mx-auto min-h-[420px] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="border-b border-border-grey pb-5 mb-8 flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-accent-gold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Simulator
            </span>
            <h3 className="font-display text-xl md:text-2xl font-light text-primary-black uppercase mt-1 tracking-wide">
              Operational Bottleneck Auditor
            </h3>
          </div>
          {step > 0 && (
            <button 
              onClick={resetSimulator} 
              className="text-[9px] uppercase tracking-widest font-bold text-muted-grey hover:text-primary-black flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {/* Step Indicator Progress Bar */}
        {step < questions.length && (
          <div className="w-full h-1 bg-soft-bg rounded-full overflow-hidden mb-8">
            <div 
              className="h-full bg-primary-black transition-all duration-300"
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
            />
          </div>
        )}

        {/* Dynamic Wizard Steps */}
        <AnimatePresence mode="wait">
          {step < questions.length ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h4 className="font-display text-lg font-normal text-primary-black">
                {questions[step].title}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {questions[step].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(questions[step].key, opt.value)}
                    className="p-5 border border-border-grey hover:border-primary-black text-left text-xs text-dark-grey hover:text-primary-black hover:bg-soft-bg/35 transition-all duration-300 rounded-xl font-medium cursor-pointer flex justify-between items-center group"
                  >
                    <span>{opt.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-grey group-hover:text-primary-black group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Results Screen */
            diagnosis && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-grey/50 pb-5">
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-muted-grey font-bold block mb-1">
                      Audit Diagnostic Output
                    </span>
                    <h4 className="font-display text-2xl font-light text-primary-black uppercase tracking-wide">
                      Process Audit Completed
                    </h4>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-bold px-3 py-1 border rounded-lg ${
                    diagnosis.severity === "CRITICAL RISK" 
                      ? "bg-red-50 text-red-600 border-red-200" 
                      : "bg-[#c89f7c]/5 text-[#c89f7c] border-[#c89f7c]/20"
                  }`}>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Severity: {diagnosis.severity}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recommended architecture */}
                  <div className="bg-soft-bg p-6 border border-border-grey rounded-xl">
                    <span className="text-[9px] uppercase tracking-widest text-muted-grey font-bold block mb-2">
                      Recommended System Layout
                    </span>
                    <p className="text-xs text-primary-black font-semibold leading-relaxed">
                      {diagnosis.solution}
                    </p>
                    <p className="text-[9px] text-muted-grey font-light mt-3 uppercase tracking-wider">
                      Target architecture to bypass process gap
                    </p>
                  </div>

                  {/* Impact projection */}
                  <div className="bg-white border border-border-grey p-6 rounded-xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-muted-grey font-bold block mb-2">
                        Expected Impact Projection
                      </span>
                      <p className="text-xl font-display font-light text-primary-black">
                        {diagnosis.impact}
                      </p>
                    </div>
                    <span className="text-[8px] uppercase tracking-widest font-semibold text-accent-gold mt-4 block">
                      estimated efficiency offset
                    </span>
                  </div>
                </div>

                {/* Next Steps CTA */}
                <div className="pt-6 border-t border-border-grey flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-xs text-muted-grey font-light text-center sm:text-left">
                    Redirection link pre-fills discovery questionnaire based on audit inputs.
                  </p>
                  <Link
                    href={getPreFilledContactUrl()}
                    className="group inline-flex items-center gap-2 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-3.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-bold rounded-xl shrink-0 cursor-pointer"
                  >
                    Claim Discovery Blueprint Call
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
