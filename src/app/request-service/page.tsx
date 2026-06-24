"use client";

import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { 
  Building2, 
  Briefcase, 
  Settings, 
  AlertCircle, 
  Check, 
  Copy, 
  ArrowRight, 
  MessageSquare, 
  FileText,
  User,
  Mail,
  Phone,
  Link as LinkIcon
} from "lucide-react";
import Link from "next/link";
import { getProfile } from "@/services/profileService";
import { createEnquiry } from "@/services/enquiryService";
import { useSearchParams } from "next/navigation";

// Form validation schema using Zod
const requestFormSchema = zod.object({
  fullName: zod.string().min(2, "Name must be at least 2 characters"),
  companyName: zod.string().min(2, "Company name must be at least 2 characters"),
  designation: zod.string().optional(),
  email: zod.string().email("Invalid email address"),
  phone: zod.string().min(10, "Phone number must be at least 10 digits"),
  linkedinUrl: zod.string().optional(),
  website: zod.string().optional(),
  industry: zod.string().min(2, "Please specify your industry"),
  companySize: zod.string().optional(),
  currentTools: zod.string().optional(),
  currentProcess: zod.string().optional(),
  challenge: zod.string().min(10, "Please describe your workflow challenge (min 10 characters)"),
  serviceRequired: zod.string().min(1, "Please select a service"),
  budget: zod.string().optional(),
  timeline: zod.string().optional(),
  agreeTerms: zod.boolean().refine((val) => val === true, {
    message: "You must accept the data transfer & privacy terms."
  })
});

type RequestFormData = zod.infer<typeof requestFormSchema>;

function RequestFormInner() {
  const [profile, setProfile] = useState<any>({ fullName: "Ankit Nishad", email: "", phone: "", linkedinUrl: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<RequestFormData | null>(null);
  const [copied, setCopied] = useState(false);
  
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      agreeTerms: false
    }
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const p = await getProfile();
        if (p) setProfile(p);
      } catch (err) {
        console.error("Failed to load profile details:", err);
      }
    }
    loadProfile();
  }, []);

  // Parse search params to pre-fill service or challenge
  useEffect(() => {
    const serviceParam = searchParams.get("service");
    const challengeParam = searchParams.get("challenge");

    if (serviceParam) {
      setValue("serviceRequired", serviceParam);
    }
    if (challengeParam) {
      setValue("challenge", challengeParam);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: RequestFormData) => {
    setIsSubmitting(true);
    try {
      const { agreeTerms, ...enquiryData } = data;
      await createEnquiry(enquiryData);
      setSubmittedData(data);
      setIsSuccess(true);
      reset();
    } catch (e) {
      console.error("Failed to submit request:", e);
      alert("There was an issue submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLinkedInDirect = async () => {
    if (!submittedData) return;

    const formattedBrief = 
      `🚀 *NEW SERVICE REQUEST BRIEF*\n\n` +
      `👤 *Sender:* ${submittedData.fullName}${submittedData.designation ? ` (${submittedData.designation})` : ""}\n` +
      `🏢 *Company:* ${submittedData.companyName}${submittedData.website ? ` (${submittedData.website})` : ""}\n` +
      `🏭 *Industry:* ${submittedData.industry || "N/A"}\n` +
      `✉️ *Email:* ${submittedData.email} | 📞 *Phone:* ${submittedData.phone}\n\n` +
      `🛠️ *Service Requested:* ${submittedData.serviceRequired}\n` +
      `📅 *Timeline:* ${submittedData.timeline || "N/A"} | 💰 *Budget:* ${submittedData.budget || "N/A"}\n\n` +
      `💻 *Current Stack/Tools:* ${submittedData.currentTools || "N/A"}\n` +
      `🔄 *Current Process:* ${submittedData.currentProcess || "N/A"}\n` +
      `⚠️ *Workflow Bottleneck:* \n"${submittedData.challenge}"`;

    try {
      await navigator.clipboard.writeText(formattedBrief);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy project brief to clipboard:", err);
    }

    // Open LinkedIn Profile in new tab
    window.open(profile.linkedinUrl || "https://www.linkedin.com/in/theankitnishad/", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      {/* Left Column: Info & Process Checklist */}
      <div className="lg:col-span-4 space-y-8">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] font-semibold text-muted-grey block mb-2">
            Structured Engagement
          </span>
          <h3 className="font-display text-2xl font-light text-primary-black uppercase tracking-wide">
            Project Briefing
          </h3>
          <p className="text-xs text-dark-grey leading-relaxed font-light mt-3">
            To build custom automation pipelines, RPA scripts, or custom dashboards, I need to audit your manual touchpoints and legacy systems. Please fill out this detailed questionnaire.
          </p>
        </div>

        {/* What happens next checklist */}
        <div className="border border-border-grey bg-white p-6 rounded-xl space-y-6">
          <h4 className="text-xs font-sans uppercase tracking-widest text-primary-black font-semibold">
            Next steps
          </h4>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="w-5 h-5 border border-primary-black rounded-full flex items-center justify-center text-[10px] font-bold text-primary-black shrink-0">
                1
              </div>
              <div>
                <h5 className="text-xs font-semibold text-primary-black">System Audit</h5>
                <p className="text-[10px] text-dark-grey font-light leading-relaxed mt-0.5">
                  I will review your current toolstack, processes, and manually check for bottleneck solutions.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="w-5 h-5 border border-primary-black rounded-full flex items-center justify-center text-[10px] font-bold text-primary-black shrink-0">
                2
              </div>
              <div>
                <h5 className="text-xs font-semibold text-primary-black">Telegram Notification</h5>
                <p className="text-[10px] text-dark-grey font-light leading-relaxed mt-0.5">
                  Your project brief is transmitted immediately to Ankit's private Telegram notification bot.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="w-5 h-5 border border-primary-black rounded-full flex items-center justify-center text-[10px] font-bold text-primary-black shrink-0">
                3
              </div>
              <div>
                <h5 className="text-xs font-semibold text-primary-black">Proposal & Demo</h5>
                <p className="text-[10px] text-dark-grey font-light leading-relaxed mt-0.5">
                  Within 48 hours, I will formulate a customized automation draft blueprint and cost estimates.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Back to Contact alternative link */}
        <div className="text-xs text-dark-grey font-light">
          Prefer a simpler question? {" "}
          <Link href="/contact" className="text-primary-black font-semibold hover:underline underline-offset-4">
            Go to standard Contact Page
          </Link>
        </div>
      </div>

      {/* Right Column: Detailed Form Panel */}
      <div className="lg:col-span-8 border border-border-grey bg-white p-8 md:p-12 rounded-2xl shadow-sm">
        {isSuccess ? (
          <div className="text-center py-16 space-y-6 animate-fadeIn">
            <div className="inline-flex p-4 bg-[#F2F2F2] border border-primary-black rounded-full mb-4">
              <Check className="w-8 h-8 text-primary-black" />
            </div>
            <h3 className="font-display text-2xl font-light text-primary-black uppercase tracking-wide">
              Brief Sent to Telegram!
            </h3>
            <p className="text-xs text-dark-grey font-light max-w-md mx-auto leading-relaxed">
              Thank you! Your detailed project briefing has been successfully sent. Ankit has been notified instantly via Telegram and will review your operational requirements shortly.
            </p>

            <div className="max-w-md mx-auto bg-[#F7F7F7] border border-border-grey p-4 rounded-lg text-left text-[11px] text-dark-grey font-mono overflow-auto max-h-[180px] whitespace-pre-wrap">
              {submittedData && (
                `👤 Name: ${submittedData.fullName}\n` +
                `🏢 Company: ${submittedData.companyName}\n` +
                `🛠️ Service: ${submittedData.serviceRequired}\n` +
                `📅 Timeline: ${submittedData.timeline || "N/A"}\n` +
                `⚠️ Bottleneck: ${submittedData.challenge}`
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto pt-4">
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-6 py-3.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-bold rounded-lg cursor-pointer"
              >
                Return to Home
              </Link>
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="flex-1 inline-flex items-center justify-center border border-border-grey hover:border-primary-black px-6 py-3.5 text-xs font-sans uppercase tracking-widest text-muted-grey hover:text-primary-black transition-colors rounded-lg cursor-pointer"
              >
                Submit Another Brief
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Step 1: Contact & Company Profile */}
            <div className="space-y-4">
              <h4 className="text-xs font-sans uppercase tracking-widest text-primary-black font-bold flex items-center gap-2 pb-2 border-b border-border-grey">
                <User className="w-4 h-4" />
                1. Contact & Company Profile
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register("fullName")}
                    placeholder="Enter your name"
                    className={`border bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors rounded-lg ${
                      errors.fullName ? "border-red-500" : "border-border-grey"
                    }`}
                  />
                  {errors.fullName && (
                    <span className="text-[9px] text-red-500 mt-1">{errors.fullName.message}</span>
                  )}
                </div>

                {/* Designation */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                    Your Role / Designation
                  </label>
                  <input
                    type="text"
                    {...register("designation")}
                    placeholder="e.g. Operations Director, Founder"
                    className="border border-border-grey bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Work Email */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    placeholder="john@company.com"
                    className={`border bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors rounded-lg ${
                      errors.email ? "border-red-500" : "border-border-grey"
                    }`}
                  />
                  {errors.email && (
                    <span className="text-[9px] text-red-500 mt-1">{errors.email.message}</span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    {...register("phone")}
                    placeholder="e.g. +1 555 123 4567"
                    className={`border bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors rounded-lg ${
                      errors.phone ? "border-red-500" : "border-border-grey"
                    }`}
                  />
                  {errors.phone && (
                    <span className="text-[9px] text-red-500 mt-1">{errors.phone.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    {...register("companyName")}
                    placeholder="Acme Corp"
                    className={`border bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors rounded-lg ${
                      errors.companyName ? "border-red-500" : "border-border-grey"
                    }`}
                  />
                  {errors.companyName && (
                    <span className="text-[9px] text-red-500 mt-1">{errors.companyName.message}</span>
                  )}
                </div>

                {/* Company Website */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                    Company Website
                  </label>
                  <input
                    type="text"
                    {...register("website")}
                    placeholder="www.company.com"
                    className="border border-border-grey bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Industry */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                    Industry *
                  </label>
                  <input
                    type="text"
                    {...register("industry")}
                    placeholder="e.g. Logistics, E-commerce, Finance"
                    className={`border bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors rounded-lg ${
                      errors.industry ? "border-red-500" : "border-border-grey"
                    }`}
                  />
                  {errors.industry && (
                    <span className="text-[9px] text-red-500 mt-1">{errors.industry.message}</span>
                  )}
                </div>

                {/* LinkedIn Profile */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                    Your LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    {...register("linkedinUrl")}
                    placeholder="linkedin.com/in/username"
                    className="border border-border-grey bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Automation Audit */}
            <div className="space-y-4">
              <h4 className="text-xs font-sans uppercase tracking-widest text-primary-black font-bold flex items-center gap-2 pb-2 border-b border-border-grey">
                <Settings className="w-4 h-4" />
                2. Process & Automation Audit
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Stack */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                    Current Tools / Software Used
                  </label>
                  <input
                    type="text"
                    {...register("currentTools")}
                    placeholder="e.g. Salesforce, Excel, SAP, GSheets"
                    className="border border-border-grey bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors rounded-lg"
                  />
                </div>

                {/* Company Size */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                    Company Size
                  </label>
                  <select
                    {...register("companySize")}
                    className="border border-border-grey bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors rounded-lg cursor-pointer"
                  >
                    <option value="">Select size...</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
              </div>

              {/* Current Process Description */}
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                  Describe the Current Manual Process
                </label>
                <textarea
                  rows={3}
                  {...register("currentProcess")}
                  placeholder="Outline step-by-step how tasks are done manually today, what triggers them, and how much time they consume..."
                  className="border border-border-grey bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors resize-none rounded-lg"
                />
              </div>

              {/* Main Bottleneck */}
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                  Main Workflow Challenge / Process Bottleneck *
                </label>
                <textarea
                  rows={4}
                  {...register("challenge")}
                  placeholder="What is the single biggest operational headache? Where does data get stuck or delayed? Describe the error rates or delays..."
                  className={`border bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors resize-none rounded-lg ${
                    errors.challenge ? "border-red-500" : "border-border-grey"
                  }`}
                />
                {errors.challenge && (
                  <span className="text-[9px] text-red-500 mt-1">{errors.challenge.message}</span>
                )}
              </div>
            </div>

            {/* Step 3: Project Scope & Budget */}
            <div className="space-y-4">
              <h4 className="text-xs font-sans uppercase tracking-widest text-primary-black font-bold flex items-center gap-2 pb-2 border-b border-border-grey">
                <Briefcase className="w-4 h-4" />
                3. Project Scope & Expectations
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Service Required */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                    Service Needed *
                  </label>
                  <select
                    {...register("serviceRequired")}
                    className={`border bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors rounded-lg cursor-pointer ${
                      errors.serviceRequired ? "border-red-500" : "border-border-grey"
                    }`}
                  >
                    <option value="">Select Service...</option>
                    <option value="Business Automation">Business Automation</option>
                    <option value="Custom Software Consultation">Custom Software Consultation</option>
                    <option value="UiPath Automation (RPA)">UiPath Automation (RPA)</option>
                    <option value="E-commerce Solutions">E-commerce Solutions</option>
                    <option value="Business Process Mapping">Business Process Mapping</option>
                  </select>
                  {errors.serviceRequired && (
                    <span className="text-[9px] text-red-500 mt-1">{errors.serviceRequired.message}</span>
                  )}
                </div>

                {/* Timeline */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                    Required Timeline
                  </label>
                  <select
                    {...register("timeline")}
                    className="border border-border-grey bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors rounded-lg cursor-pointer"
                  >
                    <option value="">Select timeline...</option>
                    <option value="Immediate">Immediate / ASAP</option>
                    <option value="1-3 Months">1-3 Months</option>
                    <option value="3-6 Months">3-6 Months</option>
                    <option value="Not urgent">Not urgent / Exploring</option>
                  </select>
                </div>

                {/* Budget */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-1.5">
                    Estimated Budget Range
                  </label>
                  <select
                    {...register("budget")}
                    className="border border-border-grey bg-[#FDFDFD] py-2.5 px-3 text-xs font-light focus:outline-none focus:border-primary-black transition-colors rounded-lg cursor-pointer"
                  >
                    <option value="">Select budget range...</option>
                    <option value="< $2,000">Under $2,000</option>
                    <option value="$2,000 - $5,000">$2,000 - $5,000</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                    <option value="$10,000+">$10,000+</option>
                    <option value="Undecided">Undecided / TBD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Legal Terms Checkbox */}
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  {...register("agreeTerms")}
                  className={`w-4 h-4 accent-primary-black mt-0.5 cursor-pointer shrink-0 ${
                    errors.agreeTerms ? "outline outline-2 outline-red-500" : ""
                  }`}
                />
                <label htmlFor="agreeTerms" className="text-[10px] text-dark-grey leading-relaxed font-light select-none cursor-pointer">
                  I agree to the <Link href="/privacy-policy" target="_blank" className="underline hover:text-primary-black font-semibold">Privacy Policy</Link>. I understand that submitting this form saves my details in this website's local database and immediately notifies Ankit on Telegram.
                </label>
              </div>
              {errors.agreeTerms && (
                <span className="text-[9px] text-red-500 block mt-1">{errors.agreeTerms.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black py-3.5 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Submitting Project Brief..." : "Submit Project Brief"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function RequestServicePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] py-20 relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute right-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] md:text-[50rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Header */}
        <div className="border-b border-border-grey pb-12 mb-16">
          <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3">
            Service Request
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-extralight text-primary-black tracking-tight uppercase">
            Let's Build Together.
          </h1>
        </div>

        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
            <span className="text-xs uppercase tracking-widest text-muted-grey font-medium">Loading Questionnaire...</span>
          </div>
        }>
          <RequestFormInner />
        </Suspense>
      </div>
    </div>
  );
}
