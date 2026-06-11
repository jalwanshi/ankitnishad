import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Profile, ProfileMetrics, SocialLink } from "@/types/portfolio";

// Collection 'profile' documents:
// - main: general profile info and SEO settings
// - metrics: statistics counters
// - socials: social media links array

const DEFAULT_PROFILE: Profile = {
  fullName: "Ankit Nishad",
  roleTitle: "Business Development Manager",
  professionalTagline: "Helping Businesses Replace Manual Operations with Custom Software, Automation and Smarter Digital Systems.",
  shortBio: "Ankit Nishad is a Business Development Manager and Business Automation Consultant who helps companies identify operational gaps and convert manual, disconnected processes into structured digital systems. He works closely with business owners and decision-makers to understand their workflows, recommend custom software solutions and coordinate the complete journey from discovery and requirement analysis to proposal and implementation planning.",
  detailedBio: "Ankit Nishad is a Business Development Manager and Business Automation Consultant focused on helping businesses modernise their operations through custom software, process automation and integrated digital systems.\n\nHis work begins with understanding how a company currently manages its sales, operations, follow-ups, inventory, reporting, documents, communication and customer data. He identifies inefficiencies caused by disconnected tools such as spreadsheets, WhatsApp, emails, manual registers and multiple independent software platforms.\n\nBased on the organisation’s actual workflow, Ankit helps define practical software requirements and proposes tailored CRM, ERP, DMS, client portal, sales automation, inventory management, manufacturing management, healthcare management and workflow automation solutions.\n\nHe actively works across client discovery, process consultation, requirement gathering, workflow mapping, software demonstrations, proposal coordination and long-term follow-ups. His approach is focused on solving real operational problems instead of recommending generic, ready-made software.\n\nAnkit’s professional goal is to help growing businesses move from fragmented manual systems to organised, scalable and data-driven digital operations.",
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
  resumeUrl: "/assets/resume.pdf",
  heroImageUrl: "/assets/hero-portrait.png",
  aboutImageUrl: "/assets/about-portrait.png"
};

const DEFAULT_METRICS: ProfileMetrics = {
  projectsDelivered: { value: "+200", enabled: true, label: "Projects Delivered" },
  businessConsultations: { value: "+50", enabled: true, label: "Business Consultations" },
  toolsHandled: { value: "50+", enabled: true, label: "Tools/Software Handled" },
  industryDomains: { value: "18+", enabled: true, label: "Industry Domains" },
  happyClients: { value: "20+", enabled: true, label: "Happy Clients" },
  automationsBuilt: { value: "200+", enabled: true, label: "Automations Built" }
};

const DEFAULT_SOCIALS: SocialLink[] = [
  { id: "linkedin", platform: "LinkedIn", url: "https://www.linkedin.com/in/theankitnishad/", isEnabled: true, displayOrder: 1 },
  { id: "email", platform: "Email", url: "mailto:ankitnishad703@gmail.com", isEnabled: true, displayOrder: 2 },
  { id: "phone", platform: "Phone", url: "tel:+916388353247", isEnabled: true, displayOrder: 3 }
];

export async function getProfile(): Promise<Profile> {
  try {
    const docRef = doc(db, "profile", "main");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...DEFAULT_PROFILE, ...docSnap.data() } as Profile;
    }
    return DEFAULT_PROFILE;
  } catch (error) {
    console.error("Error fetching profile from Firestore:", error);
    return DEFAULT_PROFILE;
  }
}

export async function saveProfile(profile: Partial<Profile>): Promise<void> {
  const docRef = doc(db, "profile", "main");
  await setDoc(docRef, {
    ...profile,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function getMetrics(): Promise<ProfileMetrics> {
  try {
    const docRef = doc(db, "profile", "metrics");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...DEFAULT_METRICS, ...docSnap.data() } as ProfileMetrics;
    }
    return DEFAULT_METRICS;
  } catch (error) {
    console.error("Error fetching metrics from Firestore:", error);
    return DEFAULT_METRICS;
  }
}

export async function saveMetrics(metrics: ProfileMetrics): Promise<void> {
  const docRef = doc(db, "profile", "metrics");
  await setDoc(docRef, {
    ...metrics,
    updatedAt: serverTimestamp()
  });
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const docRef = doc(db, "profile", "socials");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.links)) {
        return data.links.sort((a: SocialLink, b: SocialLink) => a.displayOrder - b.displayOrder);
      }
    }
    return DEFAULT_SOCIALS;
  } catch (error) {
    console.error("Error fetching social links from Firestore:", error);
    return DEFAULT_SOCIALS;
  }
}

export async function saveSocialLinks(links: SocialLink[]): Promise<void> {
  const docRef = doc(db, "profile", "socials");
  await setDoc(docRef, {
    links,
    updatedAt: serverTimestamp()
  });
}
