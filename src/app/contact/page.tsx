"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Mail, Phone, MapPin, ArrowRight, Check } from "lucide-react";
import { LinkedinIcon } from "@/components/ui/SocialIcons";
import { getProfile } from "@/services/profileService";
import { createEnquiry } from "@/services/enquiryService";

// Define form validation schema using Zod
const contactFormSchema = zod.object({
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
  preferredDate: zod.string().optional(),
  preferredTime: zod.string().optional(),
  source: zod.string().optional()
});

type ContactFormData = zod.infer<typeof contactFormSchema>;

export default function Contact() {
  const [profile, setProfile] = useState<any>({ fullName: "Ankit Nishad", email: "", phone: "", linkedinUrl: "", location: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function loadContactInfo() {
      try {
        const p = await getProfile();
        if (p) {
          setProfile(p);
        }
      } catch (err) {
        console.error("Failed to load contact profile info:", err);
      }
    }
    loadContactInfo();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await createEnquiry(data);
      setIsSuccess(true);
      reset();
    } catch (e) {
      console.error("Failed to submit contact enquiry to Firestore:", e);
      alert("There was an issue submitting your enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-main-bg py-20 relative overflow-hidden">
      {/* BACKGROUND Watermark */}
      <div className="absolute right-[-100px] top-10 font-display font-black text-primary-black/[0.01] text-[30rem] md:text-[50rem] leading-none select-none pointer-events-none z-0">
        AN
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Header */}
        <div className="border-b border-border-grey pb-12 mb-16">
          <span className="font-display text-xs uppercase tracking-[0.25em] text-muted-grey font-semibold block mb-3">
            Inquiry
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-extralight text-primary-black tracking-tight">
            Let's Connect.
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Info & Links */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h3 className="font-display text-2xl font-light text-primary-black mb-4">
                Consultation details
              </h3>
              <p className="text-xs text-dark-grey leading-relaxed font-light mb-8 max-w-[400px]">
                Have a process bottleneck, CRM mapping issue, or want to audit your team's workflow? Fill in the details to schedule a discovery call.
              </p>
            </div>

            {/* Direct Contact links */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 border border-border-grey bg-white rounded-full">
                  <Mail className="w-4 h-4 text-primary-black" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-grey block">Email</span>
                  <a href={`mailto:${profile.email}`} className="text-sm font-semibold text-primary-black hover:underline">
                    {profile.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 border border-border-grey bg-white rounded-full">
                  <Phone className="w-4 h-4 text-primary-black" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-grey block">Phone</span>
                  <a href={`tel:${profile.phone}`} className="text-sm font-semibold text-primary-black hover:underline">
                    {profile.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 border border-border-grey bg-white rounded-full">
                  <LinkedinIcon className="w-4 h-4 text-primary-black" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-grey block">LinkedIn</span>
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary-black hover:underline">
                    {profile.linkedinUrl?.replace("https://www.", "").replace("https://", "") || "linkedin.com/in/ankitnishad"}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 border border-border-grey bg-white rounded-full">
                  <MapPin className="w-4 h-4 text-primary-black" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-grey block">Location</span>
                  <span className="text-sm font-semibold text-primary-black">{profile.location}</span>
                </div>
              </div>
            </div>

            {/* Quick LinkedIn Connect redirect */}
            <div className="border border-border-grey bg-white p-8 space-y-4 max-w-[400px]">
              <span className="text-[10px] uppercase tracking-widest text-muted-grey font-bold block">
                Professional Network
              </span>
              <p className="text-xs text-dark-grey font-light leading-relaxed">
                Prefer to connect professionally and discuss opportunities on LinkedIn?
              </p>
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black px-4 py-2 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold"
              >
                Connect on LinkedIn
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column: Form Panel */}
          <div className="lg:col-span-7 border border-border-grey bg-white p-8 md:p-12">
            {isSuccess ? (
              <div className="text-center py-20 space-y-6">
                <div className="inline-flex p-4 bg-soft-bg border border-primary-black rounded-full mb-4">
                  <Check className="w-8 h-8 text-primary-black" />
                </div>
                <h3 className="font-display text-2xl font-light text-primary-black">
                  Inquiry Submitted Successfully
                </h3>
                <p className="text-xs text-dark-grey font-light max-w-sm mx-auto leading-relaxed">
                  Thank you for submitting your details. I will review your workflow challenges and follow up via email within 24 hours.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="inline-block border border-border-grey hover:border-primary-black px-5 py-2.5 text-xs font-sans uppercase tracking-widest text-muted-grey hover:text-primary-black transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="border-b border-border-grey pb-4 mb-6">
                  <h3 className="font-display text-xl font-normal text-primary-black">
                    Discovery Questionnaire
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      {...register("fullName")}
                      className={`border bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black transition-colors ${
                        errors.fullName ? "border-red-500" : "border-border-grey"
                      }`}
                    />
                    {errors.fullName && (
                      <span className="text-[10px] text-red-500 mt-1">{errors.fullName.message}</span>
                    )}
                  </div>

                  {/* Company Name */}
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      {...register("companyName")}
                      className={`border bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black transition-colors ${
                        errors.companyName ? "border-red-500" : "border-border-grey"
                      }`}
                    />
                    {errors.companyName && (
                      <span className="text-[10px] text-red-500 mt-1">{errors.companyName.message}</span>
                    )}
                  </div>

                  {/* Work Email */}
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      className={`border bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black transition-colors ${
                        errors.email ? "border-red-500" : "border-border-grey"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[10px] text-red-500 mt-1">{errors.email.message}</span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      {...register("phone")}
                      className={`border bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black transition-colors ${
                        errors.phone ? "border-red-500" : "border-border-grey"
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-[10px] text-red-500 mt-1">{errors.phone.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Industry */}
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                      Industry *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Healthcare, FMCG"
                      {...register("industry")}
                      className={`border bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black transition-colors ${
                        errors.industry ? "border-red-500" : "border-border-grey"
                      }`}
                    />
                    {errors.industry && (
                      <span className="text-[10px] text-red-500 mt-1">{errors.industry.message}</span>
                    )}
                  </div>

                  {/* Service Required */}
                  <div className="flex flex-col">
                    <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                      Service Needed *
                    </label>
                    <select
                      {...register("serviceRequired")}
                      className={`border bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black transition-colors appearance-none ${
                        errors.serviceRequired ? "border-red-500" : "border-border-grey"
                      }`}
                    >
                      <option value="">Select Service...</option>
                      <option value="automation">Business Process Automation</option>
                      <option value="software">Custom Software Solutions</option>
                      <option value="uipath">UiPath Automation (RPA)</option>
                      <option value="ecommerce">E-commerce Stores</option>
                      <option value="consulting">Business Process Consultation</option>
                    </select>
                    {errors.serviceRequired && (
                      <span className="text-[10px] text-red-500 mt-1">{errors.serviceRequired.message}</span>
                    )}
                  </div>
                </div>

                {/* Challenge Textarea */}
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">
                    Describe Your Main Workflow Challenge *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe where the process breaks down or what manual tasks take up the most time..."
                    {...register("challenge")}
                    className={`border bg-main-bg py-3 px-4 text-xs font-light focus:outline-none focus:border-primary-black transition-colors resize-none ${
                      errors.challenge ? "border-red-500" : "border-border-grey"
                    }`}
                  />
                  {errors.challenge && (
                    <span className="text-[10px] text-red-500 mt-1">{errors.challenge.message}</span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-black text-white hover:bg-transparent hover:text-primary-black border border-primary-black py-4 text-xs font-sans uppercase tracking-widest transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting Inquiry..." : "Submit Discovery Questionnaire"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
