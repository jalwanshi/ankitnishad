"use client";

import { useEffect, useState } from "react";
import { 
  FolderClosed, 
  Briefcase, 
  MailOpen, 
  CalendarCheck, 
  ShieldCheck, 
  Database, 
  Plus, 
  Sliders, 
  Search, 
  X, 
  Sparkles, 
  TrendingUp, 
  Eye, 
  Mail, 
  Phone, 
  ArrowUpRight, 
  Trash2, 
  CheckCircle,
  FileSpreadsheet
} from "lucide-react";
import Link from "next/link";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { getAllCaseStudies } from "@/services/caseStudyService";
import { getAllCareerTimeline } from "@/services/careerService";
import { 
  getAllEnquiries, 
  updateEnquiryStatus, 
  updateEnquiryNotes, 
  deleteEnquiry 
} from "@/services/enquiryService";
import { CaseStudy, CareerMilestone, ContactEnquiry } from "@/types/portfolio";
import { careerData, projectsData } from "@/constants/portfolioData";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [careerEntries, setCareerEntries] = useState<CareerMilestone[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");

  // CRM Search, filter, and detail modal states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<ContactEnquiry | null>(null);
  const [noteText, setNoteText] = useState("");
  const [message, setMessage] = useState({ text: "", type: "success" });

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

  const handleStatusChange = async (id: string, newStatus: ContactEnquiry["status"]) => {
    try {
      await updateEnquiryStatus(id, newStatus);
      setMessage({ text: "Status updated successfully!", type: "success" });
      
      // Update local state dynamically
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
      setSelectedEnquiry(prev => prev && prev.id === id ? { ...prev, status: newStatus } : prev);
      
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      setMessage({ text: `Failed to update status: ${err.message}`, type: "error" });
    }
  };

  const handleUpdateNotes = async (id: string) => {
    if (!noteText.trim()) return;
    try {
      await updateEnquiryNotes(id, noteText.trim());
      setMessage({ text: "Notes updated successfully!", type: "success" });
      
      // Update local state dynamically
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, notes: noteText.trim() } : e));
      setSelectedEnquiry(prev => prev && prev.id === id ? { ...prev, notes: noteText.trim() } : prev);
      setNoteText("");
      
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      setMessage({ text: `Failed to save notes: ${err.message}`, type: "error" });
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await deleteEnquiry(id);
      setMessage({ text: "Enquiry deleted successfully!", type: "success" });
      setSelectedEnquiry(null);
      
      // Remove from local state
      setEnquiries(prev => prev.filter(e => e.id !== id));
      
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    } catch (err: any) {
      setMessage({ text: `Deletion failed: ${err.message}`, type: "error" });
    }
  };

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
        shortBio: "I am a Business Development Manager and Business Automation Consultant who helps growing businesses identify operational gaps and replace manual, disconnected processes with practical software, automation, and digital systems.",
        detailedBio: "I help growing businesses replace scattered, manual operations with clear digital systems.\n\nMy work starts by understanding how teams manage sales, operations, follow-ups, inventory, reporting, documents, communication, and customer data today.\n\nI identify where spreadsheets, WhatsApp threads, emails, registers, and disconnected tools create delays or errors. From there, I turn real workflows into practical requirements for CRM, ERP, DMS, client portals, sales automation, inventory systems, and workflow automation.\n\nThe goal is simple: recommend the right system for the real problem, not generic software for every business.",
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
        seoDescription: "I help businesses replace manual workflows with custom software, CRM, ERP, business automation and integrated digital systems.",
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

  const getFormatDate = (timestamp: any) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate ? timestamp.toDate() : (timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp));
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // KPIs calculations
  const totalStudies = caseStudies.length;
  const publishedStudies = caseStudies.filter((p) => p.published).length;
  const draftStudies = totalStudies - publishedStudies;
  const totalCareer = careerEntries.length;
  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter((e) => e.status === "new").length;

  const qualifiedOrClosed = enquiries.filter(
    (e) => e.status === "qualified" || e.status === "closed"
  ).length;
  const conversionRate = totalEnquiries > 0 
    ? Math.round((qualifiedOrClosed / totalEnquiries) * 100) 
    : 0;

  // Filter logic
  const filteredEnquiries = enquiries.filter((e) => {
    const statusMatch = filterStatus === "all" || e.status === filterStatus;
    const serviceMatch = filterService === "all" || 
      (e.serviceRequired || "").toLowerCase().includes(filterService.toLowerCase());
      
    const searchLower = searchQuery.toLowerCase();
    const searchMatch = !searchQuery || 
      (e.fullName || "").toLowerCase().includes(searchLower) ||
      (e.companyName || "").toLowerCase().includes(searchLower) ||
      (e.serviceRequired || "").toLowerCase().includes(searchLower) ||
      (e.challenge || "").toLowerCase().includes(searchLower);
      
    return statusMatch && serviceMatch && searchMatch;
  });

  const handleExportCSV = () => {
    if (filteredEnquiries.length === 0) return;
    
    const headers = [
      "Name",
      "Company",
      "Designation",
      "Email",
      "Phone",
      "Service Requested",
      "Challenge Description",
      "Status",
      "Source",
      "Submitted At"
    ];

    const rows = filteredEnquiries.map((e) => {
      const escape = (val: any) => `"${(val || "").toString().replace(/"/g, '""')}"`;
      
      let dateStr = "";
      if (e.createdAt) {
        if (e.createdAt.toDate) {
          dateStr = e.createdAt.toDate().toLocaleString();
        } else if (e.createdAt.seconds) {
          dateStr = new Date(e.createdAt.seconds * 1000).toLocaleString();
        } else {
          dateStr = new Date(e.createdAt).toLocaleString();
        }
      }

      return [
        escape(e.fullName),
        escape(e.companyName),
        escape(e.designation),
        escape(e.email),
        escape(e.phone),
        escape(e.serviceRequired),
        escape(e.challenge),
        escape(e.status),
        escape(e.source),
        escape(dateStr)
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ankit_nishad_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Service Breakdown calculations
  const serviceCounts: Record<string, number> = {
    "Business Automation": 0,
    "Custom Software": 0,
    "UiPath / RPA": 0,
    "E-commerce": 0,
    "Process Mapping": 0,
  };
  enquiries.forEach((e) => {
    const s = (e.serviceRequired || "").toLowerCase();
    if (s.includes("automation") || s.includes("make") || s.includes("zapier")) {
      serviceCounts["Business Automation"]++;
    } else if (s.includes("custom") || s.includes("software") || s.includes("web")) {
      serviceCounts["Custom Software"]++;
    } else if (s.includes("uipath") || s.includes("rpa") || s.includes("robotic")) {
      serviceCounts["UiPath / RPA"]++;
    } else if (s.includes("e-commerce") || s.includes("store") || s.includes("shopify") || s.includes("retail")) {
      serviceCounts["E-commerce"]++;
    } else {
      serviceCounts["Process Mapping"]++;
    }
  });

  const displayCounts = serviceCounts;
  const maxServiceCount = Math.max(...Object.values(displayCounts), 1);
  const totalChartEnq = Object.values(displayCounts).reduce((a, b) => a + b, 0);

  // Monthly Trend Calculations (Last 6 Months)
  const monthsList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthlyCounts: Record<string, number> = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0 };
  enquiries.forEach((e) => {
    if (!e.createdAt) return;
    const date = e.createdAt.toDate ? e.createdAt.toDate() : (e.createdAt.seconds ? new Date(e.createdAt.seconds * 1000) : new Date(e.createdAt));
    const mName = date.toLocaleString("en-US", { month: "short" });
    if (mName in monthlyCounts) {
      monthlyCounts[mName]++;
    }
  });

  const trendPoints = monthsList.map(m => monthlyCounts[m]);
  const maxTrendVal = Math.max(...trendPoints, 1);

  // SVG Line coordinates helper
  const chartWidth = 500;
  const chartHeight = 160;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const usableWidth = chartWidth - paddingLeft - paddingRight;
  const usableHeight = chartHeight - paddingTop - paddingBottom;

  const pointsCoords = trendPoints.map((val, idx) => {
    const x = paddingLeft + (idx / (trendPoints.length - 1)) * usableWidth;
    const y = chartHeight - paddingBottom - (val / maxTrendVal) * usableHeight;
    return { x, y };
  });

  const dLine = pointsCoords.length > 0 
    ? `M ${pointsCoords[0].x},${pointsCoords[0].y} ` + pointsCoords.slice(1).map(p => `L ${p.x},${p.y}`).join(" ")
    : "";
   
  const dArea = pointsCoords.length > 0
    ? `${dLine} L ${pointsCoords[pointsCoords.length - 1].x},${chartHeight - paddingBottom} L ${pointsCoords[0].x},${chartHeight - paddingBottom} Z`
    : "";

  const stats = [
    { name: "Total Case Studies", value: totalStudies.toString(), desc: `${publishedStudies} Published • ${draftStudies} Drafts`, icon: <FolderClosed className="w-4 h-4 text-primary-black" /> },
    { name: "Career Milestones", value: totalCareer.toString(), desc: "Timeline positions", icon: <Briefcase className="w-4 h-4 text-primary-black" /> },
    { name: "Conversion Rate", value: `${conversionRate}%`, desc: `${qualifiedOrClosed} Qualified Leads`, icon: <Sliders className="w-4 h-4 text-primary-black" /> },
    { name: "Contact Enquiries", value: totalEnquiries.toString(), desc: `${newEnquiries} Awaiting Review`, icon: <MailOpen className="w-4 h-4 text-primary-black" /> }
  ];

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
    <div className="space-y-10">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-border-grey pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider flex items-center gap-2">
            Dashboard Overview <Sparkles className="w-5 h-5 text-accent-gold" />
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
            Real-time analytics, CRM leads pipelines, and system configuration
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#F2F2F2] px-3.5 py-1.5 border border-border-grey text-[10px] uppercase tracking-wider text-dark-grey rounded-lg shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-primary-black" />
          <span>Firestore Status: Connected</span>
        </div>
      </motion.div>

      {message.text && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xs py-3 px-4 text-center border font-light rounded-lg ${
            message.type === "error" 
              ? "bg-red-50 border-red-200 text-red-600" 
              : "bg-green-50 border-green-200 text-green-700"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {seedMessage && (
        <div className="text-xs py-3 px-4 text-center border border-dashed border-border-grey bg-white text-primary-black font-light rounded-lg">
          {seedMessage}
        </div>
      )}

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            key={i}
            className="bg-white border border-border-grey p-6 flex items-start justify-between hover:border-primary-black transition-all duration-300 rounded-xl hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)]"
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
            <div className="p-2.5 border border-border-grey bg-soft-bg rounded-lg">
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Charts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Line Chart: Monthly Enquiry Volume */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-border-grey p-6 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-border-grey/50 pb-4 mb-4">
            <div>
              <h3 className="font-display text-sm font-normal text-primary-black uppercase tracking-wider flex items-center gap-1.5">
                Monthly Enquiry Volume <TrendingUp className="w-4 h-4 text-accent-gold" />
              </h3>
              <p className="text-[8px] uppercase tracking-widest text-muted-grey mt-0.5">
                Live database stats · Last 6 Months
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#c89f7c] border border-[#c89f7c]/20 px-2 py-0.5 bg-[#c89f7c]/5 rounded">
              Trend Analysis
            </span>
          </div>

          <div className="relative w-full h-[180px] flex items-center justify-center">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c89f7c" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#c89f7c" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = paddingTop + ratio * usableHeight;
                return (
                  <line 
                    key={idx} 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={chartWidth - paddingRight} 
                    y2={y} 
                    stroke="#E6E6E6" 
                    strokeWidth={0.5} 
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Area path */}
              {dArea && (
                <motion.path 
                  d={dArea} 
                  fill="url(#chartGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                />
              )}

              {/* Line path */}
              {dLine && (
                <motion.path 
                  d={dLine} 
                  fill="none" 
                  stroke="#c89f7c" 
                  strokeWidth={2}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              )}

              {/* Dots and Tooltips */}
              {pointsCoords.map((pt, idx) => (
                <g key={idx} className="group/dot cursor-pointer">
                  <motion.circle 
                    cx={pt.x} 
                    cy={pt.y} 
                    r={4} 
                    fill="#white" 
                    stroke="#c89f7c" 
                    strokeWidth={2}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    whileHover={{ scale: 1.5, fill: "#c89f7c" }}
                  />
                  {/* Tooltip Overlay */}
                  <text 
                    x={pt.x} 
                    y={pt.y - 10} 
                    textAnchor="middle" 
                    className="opacity-0 group-hover/dot:opacity-100 transition-opacity fill-primary-black text-[9px] font-bold"
                  >
                    {trendPoints[idx]}
                  </text>
                </g>
              ))}

              {/* X Axis Labels */}
              {monthsList.map((m, idx) => {
                const x = paddingLeft + (idx / (monthsList.length - 1)) * usableWidth;
                return (
                  <text 
                    key={idx} 
                    x={x} 
                    y={chartHeight - 6} 
                    textAnchor="middle" 
                    className="fill-muted-grey text-[9px] font-medium"
                  >
                    {m}
                  </text>
                );
              })}

              {/* Y Axis Labels */}
              {[0, 0.5, 1].map((ratio, idx) => {
                const y = chartHeight - paddingBottom - ratio * usableHeight;
                const labelVal = Math.round(ratio * maxTrendVal);
                return (
                  <text 
                    key={idx} 
                    x={paddingLeft - 8} 
                    y={y + 3} 
                    textAnchor="end" 
                    className="fill-muted-grey text-[8px] font-bold"
                  >
                    {labelVal}
                  </text>
                );
              })}
            </svg>
          </div>
        </motion.div>

        {/* Bar Chart: Service Distribution */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white border border-border-grey p-6 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-border-grey/50 pb-4 mb-4">
            <div>
              <h3 className="font-display text-sm font-normal text-primary-black uppercase tracking-wider flex items-center gap-1.5">
                Service Request Breakdown <Sliders className="w-4 h-4 text-accent-gold" />
              </h3>
              <p className="text-[8px] uppercase tracking-widest text-muted-grey mt-0.5">
                Leads distribution by requested service domain
              </p>
            </div>
            <span className="text-[10px] uppercase font-bold text-primary-black border border-border-grey px-2 py-0.5 bg-soft-bg rounded">
              Total: {totalChartEnq} Leads
            </span>
          </div>

          <div className="space-y-4 py-2">
            {Object.entries(displayCounts).map(([service, count], idx) => {
              const pct = totalChartEnq > 0 ? Math.round((count / totalChartEnq) * 100) : 0;
              const barWidthPct = (count / maxServiceCount) * 100;
              
              return (
                <div key={service} className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-medium text-primary-black">{service}</span>
                    <span className="text-muted-grey font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-soft-bg border border-[#E6E6E6] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidthPct}%` }}
                      transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                      className="h-full bg-primary-black rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>

      {/* CRM Enquiries Section with Live Filters & Search */}
      <div className="border border-border-grey bg-white rounded-2xl p-6 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border-grey pb-5 gap-4">
          <div>
            <h3 className="font-display text-base font-normal text-primary-black uppercase tracking-wider flex items-center gap-2">
              Leads Pipeline CRM
            </h3>
            <p className="text-[9px] uppercase tracking-widest text-muted-grey mt-0.5">
              Filter, search, review client challenges and coordinate notes
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={filteredEnquiries.length === 0}
              className="flex items-center gap-1.5 bg-primary-black text-white hover:bg-white hover:text-primary-black border border-primary-black px-3.5 py-2 text-[9px] uppercase tracking-widest font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export
            </button>
            <Link
              href="/admin/enquiries"
              className="text-[10px] uppercase tracking-widest text-[#c89f7c] hover:underline font-semibold flex items-center gap-1.5"
            >
              Open Full Lead Manager <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* CRM Search & Filters toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search bar */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search leads name or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-soft-bg border border-border-grey text-[10px] uppercase tracking-widest py-3 pl-10 pr-4 text-primary-black focus:outline-none focus:border-primary-black transition-colors rounded-lg font-medium"
            />
            <Search className="w-4 h-4 text-muted-grey absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-grey hover:text-primary-black">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status select filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-soft-bg border border-border-grey text-[10px] uppercase tracking-widest px-4 py-3 text-primary-black focus:outline-none cursor-pointer rounded-lg font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Service select filter */}
          <div>
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="w-full bg-soft-bg border border-border-grey text-[10px] uppercase tracking-widest px-4 py-3 text-primary-black focus:outline-none cursor-pointer rounded-lg font-medium"
            >
              <option value="all">All Services</option>
              <option value="automation">Automation</option>
              <option value="software">Custom Software</option>
              <option value="uipath">UiPath / RPA</option>
              <option value="e-commerce">E-commerce</option>
              <option value="process">Process Mapping</option>
            </select>
          </div>
        </div>

        {/* Table/Listing */}
        <div className="overflow-x-auto">
          {filteredEnquiries.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border-grey text-[10px] uppercase tracking-widest text-muted-grey">
                  <th className="pb-3 font-semibold">Client Name</th>
                  <th className="pb-3 font-semibold">Company</th>
                  <th className="pb-3 font-semibold">Service</th>
                  <th className="pb-3 font-semibold">Submitted Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-grey/50">
                <AnimatePresence mode="popLayout">
                  {filteredEnquiries.map((enquiry) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={enquiry.id} 
                      className="hover:bg-soft-bg/30 group/row"
                    >
                      <td className="py-4 font-medium text-primary-black">{enquiry.fullName}</td>
                      <td className="py-4 text-dark-grey">{enquiry.companyName}</td>
                      <td className="py-4 text-dark-grey">{enquiry.serviceRequired}</td>
                      <td className="py-4 text-muted-grey">{getFormatDate(enquiry.createdAt)}</td>
                      <td className="py-4">
                        <span className={`inline-block text-[8px] uppercase tracking-wider px-2 py-0.5 border font-semibold rounded ${
                          enquiry.status === "new"
                            ? "bg-black text-white border-black"
                            : enquiry.status === "contacted"
                            ? "bg-white text-dark-grey border-border-grey"
                            : enquiry.status === "qualified"
                            ? "bg-[#c89f7c]/10 text-[#c89f7c] border-[#c89f7c]/20"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}>
                          {enquiry.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="p-1.5 border border-border-grey text-muted-grey hover:text-primary-black hover:border-primary-black transition-colors rounded cursor-pointer"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEnquiry(enquiry.id)}
                            className="p-1.5 border border-red-50 text-red-600 hover:bg-red-50 hover:border-red-600 transition-colors rounded cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          ) : (
            <div className="py-14 text-center text-xs text-muted-grey uppercase tracking-widest border border-dashed border-border-grey bg-soft-bg/30 rounded-xl">
              No leads match your filter criteria.
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Column */}
      <div className="border border-border-grey bg-white rounded-2xl p-6 md:p-8 space-y-6">
        <div className="border-b border-border-grey pb-4">
          <h3 className="font-display text-base font-normal text-primary-black uppercase tracking-wider">
            Quick System Configurations
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Link
            href="/admin/career"
            className="flex flex-col gap-2 border border-border-grey hover:border-primary-black p-5 text-left text-xs font-semibold uppercase tracking-widest text-primary-black transition-all bg-soft-bg/40 hover:bg-transparent rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4 text-accent-gold" />
            <span>Add Career Entry</span>
          </Link>

          <Link
            href="/admin/projects"
            className="flex flex-col gap-2 border border-border-grey hover:border-primary-black p-5 text-left text-xs font-semibold uppercase tracking-widest text-primary-black transition-all bg-soft-bg/40 hover:bg-transparent rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4 text-accent-gold" />
            <span>Add Case Study</span>
          </Link>

          <Link
            href="/admin/statistics"
            className="flex flex-col gap-2 border border-border-grey hover:border-primary-black p-5 text-left text-xs font-semibold uppercase tracking-widest text-primary-black transition-all bg-soft-bg/40 hover:bg-transparent rounded-xl cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-accent-gold" />
            <span>Update Statistics</span>
          </Link>

          <Link
            href="/admin/assets"
            className="flex flex-col gap-2 border border-border-grey hover:border-primary-black p-5 text-left text-xs font-semibold uppercase tracking-widest text-primary-black transition-all bg-soft-bg/40 hover:bg-transparent rounded-xl cursor-pointer"
          >
            <Database className="w-4 h-4 text-accent-gold" />
            <span>Upload Resume & Images</span>
          </Link>

          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="flex flex-col gap-2 border border-dashed border-border-grey hover:border-primary-black p-5 text-left text-xs font-semibold uppercase tracking-widest text-primary-black transition-all bg-white hover:bg-soft-bg/20 rounded-xl cursor-pointer disabled:opacity-50"
          >
            <Database className="w-4 h-4 text-muted-grey" />
            <span>{seeding ? "Seeding..." : "Seed Initial Data"}</span>
          </button>
        </div>
      </div>

      {/* CRM Detailed Lead Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-primary-black/35 backdrop-blur-xs flex items-center justify-center z-50 p-6">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-border-grey p-8 max-w-2xl w-full relative rounded-2xl shadow-xl max-h-[85vh] overflow-y-auto"
          >
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setSelectedEnquiry(null)} 
                className="text-muted-grey hover:text-primary-black cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-b border-border-grey pb-5 mb-6">
              <span className="text-[9px] uppercase tracking-widest text-muted-grey font-bold block mb-1">
                {selectedEnquiry.designation || "Lead Prospect"} @ {selectedEnquiry.companyName}
              </span>
              <h2 className="font-display text-2xl font-light text-primary-black">
                {selectedEnquiry.fullName}
              </h2>
              <span className="text-[10px] text-muted-grey block mt-0.5">Submitted on {getFormatDate(selectedEnquiry.createdAt)}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2 border-b border-border-grey pb-6">
              <div className="flex items-center gap-2 text-xs">
                <Mail className="w-4 h-4 text-muted-grey" />
                <a href={`mailto:${selectedEnquiry.email}`} className="text-primary-black hover:underline font-semibold">
                  {selectedEnquiry.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Phone className="w-4 h-4 text-muted-grey" />
                <a href={`tel:${selectedEnquiry.phone}`} className="text-primary-black hover:underline font-semibold">
                  {selectedEnquiry.phone}
                </a>
              </div>
              {selectedEnquiry.linkedinUrl && (
                <div className="flex items-center gap-2 text-xs">
                  <ArrowUpRight className="w-4 h-4 text-muted-grey" />
                  <a href={selectedEnquiry.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary-black hover:underline font-semibold">
                    LinkedIn URL
                  </a>
                </div>
              )}
              {selectedEnquiry.website && (
                <div className="flex items-center gap-2 text-xs">
                  <ArrowUpRight className="w-4 h-4 text-muted-grey" />
                  <a href={selectedEnquiry.website} target="_blank" rel="noopener noreferrer" className="text-primary-black hover:underline font-semibold font-mono">
                    {selectedEnquiry.website}
                  </a>
                </div>
              )}
            </div>

            {/* Service & Process Challenge */}
            <div className="space-y-4 py-4">
              <span className="text-[10px] uppercase tracking-widest text-[#c89f7c] font-bold block">
                Requested Service: {selectedEnquiry.serviceRequired}
              </span>
              <div className="bg-soft-bg p-5 border border-border-grey rounded-xl">
                <h4 className="text-[9px] uppercase tracking-widest text-muted-grey font-bold mb-2">
                  Challenge Details
                </h4>
                <p className="text-xs text-dark-grey leading-relaxed font-light whitespace-pre-wrap">
                  {selectedEnquiry.challenge}
                </p>
              </div>
            </div>

            {/* Notes & Status Action Controls */}
            <div className="border-t border-border-grey pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="flex flex-col">
                  <label className="text-[9px] uppercase tracking-widest text-muted-grey font-semibold mb-2">Qualify Lead Status</label>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleStatusChange(selectedEnquiry.id, e.target.value as ContactEnquiry["status"])}
                    className="border border-border-grey bg-soft-bg py-2.5 px-4 text-xs font-semibold focus:outline-none cursor-pointer rounded-lg"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <button
                  onClick={() => handleDeleteEnquiry(selectedEnquiry.id)}
                  className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 py-2.5 px-4 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer rounded-lg flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> Delete enquiry
                </button>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-widest text-muted-grey font-bold block">Follow-Up Note Logs</label>
                {selectedEnquiry.notes ? (
                  <p className="text-xs text-dark-grey leading-relaxed font-light italic border-l-2 border-primary-black pl-4 bg-soft-bg py-3 pr-3 rounded-r-lg">
                    {selectedEnquiry.notes}
                  </p>
                ) : (
                  <p className="text-[10px] text-muted-grey italic">No internal follow-up notes written yet.</p>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter follow-up action notes..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="flex-grow border border-border-grey bg-soft-bg py-2.5 px-4 text-xs font-light focus:outline-none focus:border-primary-black transition-colors rounded-lg"
                  />
                  <button
                    onClick={() => handleUpdateNotes(selectedEnquiry.id)}
                    className="bg-primary-black text-white hover:bg-[#333] px-5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-colors cursor-pointer rounded-lg shrink-0"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-border-grey pt-5 mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="bg-soft-bg border border-border-grey text-primary-black hover:bg-[#eaeaea] py-2 px-5 text-xs uppercase tracking-widest font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Close details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
