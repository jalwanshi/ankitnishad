"use client";

import { useEffect, useState } from "react";
import { FolderClosed, Briefcase, MailOpen, CalendarCheck, ShieldCheck, Database, Plus, Sliders } from "lucide-react";
import Link from "next/link";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getAllCaseStudies } from "@/services/caseStudyService";
import { getAllCareerTimeline } from "@/services/careerService";
import { getAllEnquiries } from "@/services/enquiryService";
import { CaseStudy, CareerMilestone, ContactEnquiry } from "@/types/portfolio";
import { careerData, projectsData } from "@/constants/portfolioData";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [careerEntries, setCareerEntries] = useState<CareerMilestone[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [studiesData, careerData, enquiriesData] = await Promise.all([
        getAllCaseStudies(),
        getAllCareerTimeline(),
        getAllEnquiries()
      ]);
      setCaseStudies(studiesData);
      setCareerEntries(careerData);
      setEnquiries(enquiriesData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSeedDatabase = async () => {
    if (!confirm("Are you sure you want to seed the database? This will overwrite your current profile details, metrics and social links with verified default values.")) {
      return;
    }
    
    setSeeding(true);
    setSeedMessage("Initializing write transactions...");
    
    try {
      // 1. Seed Profile
      await setDoc(doc(db, "profile", "main"), {
        fullName: "Ankit Nishad",
        roleTitle: "Business Development Manager",
        professionalTagline: "Helping Businesses Replace Manual Operations with Custom Software, Automation and Smarter Digital Systems.",
        shortBio: "Ankit Nishad is a Business Development Manager and Business Automation Consultant who helps growing businesses identify operational gaps and replace manual, disconnected processes with practical software, automation, and digital systems.",
        detailedBio: "Ankit Nishad helps growing businesses replace scattered, manual operations with clear digital systems.\n\nHis work starts by understanding how teams manage sales, operations, follow-ups, inventory, reporting, documents, communication, and customer data today.\n\nHe identifies where spreadsheets, WhatsApp threads, emails, registers, and disconnected tools create delays or errors. From there, he turns real workflows into practical requirements for CRM, ERP, DMS, client portals, sales automation, inventory systems, and workflow automation.\n\nThe goal is simple: recommend the right system for the real problem, not generic software for every business.",
        email: "ankitnishad703@gmail.com",
        phone: "+91 6388353247",
        linkedinUrl: "https://www.linkedin.com/in/theankitnishad/",
        location: "India",
        heroEyebrow: "Business Automation & Custom Software Solutions",
        heroHeading: "I Help Businesses Turn Manual Workflows into Smart Digital Systems.",
        heroSupportingText: "I work with business owners and teams to understand operational gaps, define software requirements and build a clear roadmap for custom automation, CRM, ERP and business-management solutions.",
        heroPrimaryCtaText: "Discuss Your Business",
        heroSecondaryCtaText: "View Case Studies",
        seoTitle: "Ankit Nishad | Business Automation & Custom Software Consultant",
        seoDescription: "Ankit Nishad helps businesses replace manual workflows with custom software, CRM, ERP, business automation and integrated digital systems.",
        resumeUrl: "",
        heroImageUrl: "/assets/hero-portrait.png",
        aboutImageUrl: "/assets/about-portrait.png",
        updatedAt: serverTimestamp()
      });

      // 2. Seed Metrics
      await setDoc(doc(db, "profile", "metrics"), {
        projectsDelivered: { value: "+200", enabled: true, label: "Projects Delivered" },
        businessConsultations: { value: "+50", enabled: true, label: "Business Consultations" },
        toolsHandled: { value: "50+", enabled: true, label: "Tools/Software Handled" },
        industryDomains: { value: "18+", enabled: true, label: "Industry Domains" },
        happyClients: { value: "20+", enabled: true, label: "Happy Clients" },
        automationsBuilt: { value: "200+", enabled: true, label: "Automations Built" },
        updatedAt: serverTimestamp()
      });

      // 3. Seed Socials
      await setDoc(doc(db, "profile", "socials"), {
        links: [
          { id: "linkedin", platform: "LinkedIn", url: "https://www.linkedin.com/in/theankitnishad/", isEnabled: true, displayOrder: 1 },
          { id: "email", platform: "Email", url: "mailto:ankitnishad703@gmail.com", isEnabled: true, displayOrder: 2 },
          { id: "phone", platform: "Phone", url: "tel:+916388353247", isEnabled: true, displayOrder: 3 }
        ],
        updatedAt: serverTimestamp()
      });

      // 4. Seed Career Milestones
      setSeedMessage("Seeding career milestones...");
      for (const entry of careerData) {
        await setDoc(doc(db, "career", entry.id), {
          ...entry,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      // 5. Seed Case Studies
      setSeedMessage("Seeding case studies...");
      for (const project of projectsData) {
        await setDoc(doc(db, "projects", project.id), {
          ...project,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }

      setSeedMessage("Seeding completed successfully!");
      setTimeout(() => setSeedMessage(""), 3000);
      await loadDashboardData();
    } catch (err: any) {
      console.error("Database seeding failed:", err);
      setSeedMessage(`Seeding failed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const totalStudies = caseStudies.length;
  const publishedStudies = caseStudies.filter((p) => p.published).length;
  const draftStudies = totalStudies - publishedStudies;
  const totalCareer = careerEntries.length;
  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter((e) => e.status === "new").length;

  const stats = [
    { name: "Total Case Studies", value: totalStudies.toString(), desc: `${publishedStudies} Published • ${draftStudies} Drafts`, icon: <FolderClosed className="w-5 h-5 text-primary-black" /> },
    { name: "Career Milestones", value: totalCareer.toString(), desc: "Timeline positions", icon: <Briefcase className="w-5 h-5 text-primary-black" /> },
    { name: "Contact Enquiries", value: totalEnquiries.toString(), desc: `${newEnquiries} Awaiting Review`, icon: <MailOpen className="w-5 h-5 text-primary-black" /> },
    { name: "New Submissions", value: newEnquiries.toString(), desc: "Requires callback", icon: <CalendarCheck className="w-5 h-5 text-primary-black" /> }
  ];

  const recentEnquiries = enquiries.slice(0, 5);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-8 h-8 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
        <span className="text-xs uppercase tracking-widest text-muted-grey font-semibold">
          Loading Dashboard Content...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Welcome Header */}
      <div className="border-b border-border-grey pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider">
            Dashboard Overview
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
            System health, metrics, and active CRM funnels
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#F2F2F2] px-3.5 py-1.5 border border-border-grey text-[10px] uppercase tracking-wider text-dark-grey">
          <ShieldCheck className="w-3.5 h-3.5 text-primary-black" />
          <span>Firestore Status: Connected</span>
        </div>
      </div>

      {seedMessage && (
        <div className={`text-xs py-3 px-4 text-center border font-light ${
          seedMessage.includes("failed") 
            ? "bg-red-50 border-red-200 text-red-600" 
            : "bg-green-50 border-green-200 text-green-700"
        }`}>
          {seedMessage}
        </div>
      )}

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-border-grey p-6 flex items-start justify-between hover:border-primary-black transition-colors duration-300"
          >
            <div>
              <span className="text-[10px] uppercase tracking-widest text-muted-grey block mb-1">
                {stat.name}
              </span>
              <span className="font-display text-3xl font-light text-primary-black block mb-2">
                {stat.value}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-muted-grey font-medium">
                {stat.desc}
              </span>
            </div>
            <div className="p-2.5 border border-border-grey bg-soft-bg">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries (CRM) */}
        <div className="lg:col-span-8 border border-border-grey bg-white p-8">
          <div className="flex items-center justify-between border-b border-border-grey pb-4 mb-6">
            <h3 className="font-display text-base font-normal text-primary-black uppercase tracking-wider">
              Recent Enquiries
            </h3>
            <Link
              href="/admin/enquiries"
              className="text-[10px] uppercase tracking-widest text-muted-grey hover:text-primary-black underline"
            >
              Manage CRM
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentEnquiries.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border-grey text-[10px] uppercase tracking-widest text-muted-grey">
                    <th className="pb-3 font-semibold">Client Name</th>
                    <th className="pb-3 font-semibold">Company</th>
                    <th className="pb-3 font-semibold">Service</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-grey/50">
                  {recentEnquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-soft-bg/30">
                      <td className="py-4 font-medium text-primary-black">{enquiry.fullName}</td>
                      <td className="py-4 text-dark-grey">{enquiry.companyName}</td>
                      <td className="py-4 text-dark-grey">{enquiry.serviceRequired}</td>
                      <td className="py-4">
                        <span className={`inline-block text-[8px] uppercase tracking-wider px-2 py-0.5 border font-semibold ${
                          enquiry.status === "new"
                            ? "bg-black text-white border-black"
                            : enquiry.status === "contacted"
                            ? "bg-white text-dark-grey border-border-grey"
                            : "bg-white text-primary-black border-primary-black"
                        }`}>
                          {enquiry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-10 text-center text-xs text-muted-grey uppercase tracking-widest">
                No enquiries received yet.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Column */}
        <div className="lg:col-span-4 border border-border-grey bg-white p-8">
          <div className="border-b border-border-grey pb-4 mb-6">
            <h3 className="font-display text-base font-normal text-primary-black uppercase tracking-wider">
              Quick Actions
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/admin/career"
              className="flex items-center gap-3 border border-border-grey hover:border-primary-black p-4 text-xs font-semibold uppercase tracking-widest text-primary-black transition-all bg-soft-bg/40 hover:bg-transparent"
            >
              <Plus className="w-4 h-4" />
              Add Career Entry
            </Link>

            <Link
              href="/admin/projects"
              className="flex items-center gap-3 border border-border-grey hover:border-primary-black p-4 text-xs font-semibold uppercase tracking-widest text-primary-black transition-all bg-soft-bg/40 hover:bg-transparent"
            >
              <Plus className="w-4 h-4" />
              Add Case Study
            </Link>

            <Link
              href="/admin/statistics"
              className="flex items-center gap-3 border border-border-grey hover:border-primary-black p-4 text-xs font-semibold uppercase tracking-widest text-primary-black transition-all bg-soft-bg/40 hover:bg-transparent"
            >
              <Sliders className="w-4 h-4" />
              Update Statistics
            </Link>

            <Link
              href="/admin/assets"
              className="flex items-center gap-3 border border-border-grey hover:border-primary-black p-4 text-xs font-semibold uppercase tracking-widest text-primary-black transition-all bg-soft-bg/40 hover:bg-transparent"
            >
              <Database className="w-4 h-4" />
              Upload Resume & Images
            </Link>

            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="flex items-center gap-3 border border-dashed border-border-grey hover:border-primary-black p-4 text-xs font-semibold uppercase tracking-widest text-primary-black transition-all bg-white hover:bg-soft-bg/20 cursor-pointer disabled:opacity-50"
            >
              <Database className="w-4 h-4 text-muted-grey" />
              {seeding ? "Seeding Database..." : "Seed Initial Data"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
