import {
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Profile, ProfileMetrics, SocialLink } from "@/types/portfolio";
import { cachedFetch, invalidateCache } from "@/lib/cache";

// Collection 'profile' documents:
// - main: general profile info and SEO settings
// - metrics: statistics counters
// - socials: social media links array
// - asset-*: Base64 assets stored separately to stay below Firestore's 1MB document limit

type ProfileAssetField =
  | "resumeUrl"
  | "heroImageUrl"
  | "aboutImageUrl"
  | "signatureImageUrl";

const PROFILE_ASSET_DOCUMENTS: Record<ProfileAssetField, string> = {
  resumeUrl: "asset-resume",
  heroImageUrl: "asset-hero-image",
  aboutImageUrl: "asset-about-image",
  signatureImageUrl: "asset-signature-image"
};

const PROFILE_ASSET_FIELDS = Object.keys(
  PROFILE_ASSET_DOCUMENTS
) as ProfileAssetField[];

const LEGACY_SHORT_BIO =
  "I am a Business Development Manager and Business Automation Consultant who helps companies identify operational gaps and convert manual, disconnected processes into structured digital systems. I work closely with business owners and decision-makers to understand their workflows, recommend custom software solutions and coordinate the complete journey from discovery and requirement analysis to proposal and implementation planning.";

const LEGACY_DETAILED_BIO =
  "I am a Business Development Manager and Business Automation Consultant focused on helping businesses modernise their operations through custom software, process automation and integrated digital systems.\n\nMy work begins with understanding how a company currently manages its sales, operations, follow-ups, inventory, reporting, documents, communication and customer data. I identify inefficiencies caused by disconnected tools such as spreadsheets, WhatsApp, emails, manual registers and multiple independent software platforms.\n\nBased on the organisation’s actual workflow, I help define practical software requirements and propose tailored CRM, ERP, DMS, client portal, sales automation, inventory management, manufacturing management, healthcare management and workflow automation solutions.\n\nI actively work across client discovery, process consultation, requirement gathering, workflow mapping, software demonstrations, proposal coordination and long-term follow-ups. My approach is focused on solving real operational problems instead of recommending generic, ready-made software.\n\nMy professional goal is to help growing businesses move from fragmented manual systems to organised, scalable and data-driven digital operations.";

const DEFAULT_PROFILE: Profile = {
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
  resumeUrl: "/assets/resume.pdf",
  heroImageUrl: "/assets/hero-portrait.png",
  aboutImageUrl: "/assets/about-portrait.png",
  signatureImageUrl: "/assets/image.png"
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

function normalizeProfile(profile: Profile): Profile {
  return {
    ...profile,
    shortBio: profile.shortBio === LEGACY_SHORT_BIO ? DEFAULT_PROFILE.shortBio : profile.shortBio,
    detailedBio: profile.detailedBio === LEGACY_DETAILED_BIO ? DEFAULT_PROFILE.detailedBio : profile.detailedBio
  };
}

export async function getProfile(): Promise<Profile> {
  return cachedFetch("profile:main", async () => {
    try {
      const docRef = doc(db, "profile", "main");
      const [docSnap, ...assetSnapshots] = await Promise.all([
        getDoc(docRef),
        ...PROFILE_ASSET_FIELDS.map((field) =>
          getDoc(doc(db, "profile", PROFILE_ASSET_DOCUMENTS[field]))
        )
      ]);

      const storedProfile = docSnap.exists() ? docSnap.data() : {};
      const separatedAssets = Object.fromEntries(
        PROFILE_ASSET_FIELDS.flatMap((field, index) => {
          const assetSnapshot = assetSnapshots[index];
          const value = assetSnapshot.exists() ? assetSnapshot.data().value : undefined;
          return typeof value === "string" ? [[field, value]] : [];
        })
      );

      return normalizeProfile({
        ...DEFAULT_PROFILE,
        ...storedProfile,
        ...separatedAssets
      } as Profile);
    } catch (error) {
      console.error("Error fetching profile from Firestore:", error);
      return DEFAULT_PROFILE;
    }
  });
}

export async function saveProfile(profile: Partial<Profile>): Promise<void> {
  const docRef = doc(db, "profile", "main");
  const mainProfile = { ...profile };
  const requestedAssetUpdates = PROFILE_ASSET_FIELDS.flatMap((field) => {
    const value = profile[field];
    delete mainProfile[field];
    return typeof value === "string" ? [{ field, value }] : [];
  });

  const existingMainSnapshot =
    requestedAssetUpdates.length > 0 ? await getDoc(docRef) : null;
  const existingMainData = existingMainSnapshot?.exists()
    ? existingMainSnapshot.data()
    : {};
  const assetUpdates =
    requestedAssetUpdates.length > 0
      ? PROFILE_ASSET_FIELDS.flatMap((field) => {
          const requestedValue = profile[field];
          const legacyValue = existingMainData[field];
          const value =
            typeof requestedValue === "string"
              ? requestedValue
              : typeof legacyValue === "string"
                ? legacyValue
                : undefined;
          return value ? [{ field, value }] : [];
        })
      : [];

  const legacyAssetDeletes = Object.fromEntries(
    requestedAssetUpdates.length > 0
      ? PROFILE_ASSET_FIELDS.map((field) => [field, deleteField()])
      : []
  );

  await Promise.all([
    setDoc(
      docRef,
      {
        ...mainProfile,
        ...legacyAssetDeletes,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    ),
    ...assetUpdates.map(({ field, value }) =>
      setDoc(
        doc(db, "profile", PROFILE_ASSET_DOCUMENTS[field]),
        {
          value,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      )
    )
  ]);
  invalidateCache("profile:main");
}

export async function getMetrics(): Promise<ProfileMetrics> {
  return cachedFetch("profile:metrics", async () => {
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
  });
}

export async function saveMetrics(metrics: ProfileMetrics): Promise<void> {
  const docRef = doc(db, "profile", "metrics");
  await setDoc(docRef, {
    ...metrics,
    updatedAt: serverTimestamp()
  });
  invalidateCache("profile:metrics");
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  return cachedFetch("profile:socials", async () => {
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
  });
}

export async function saveSocialLinks(links: SocialLink[]): Promise<void> {
  const docRef = doc(db, "profile", "socials");
  await setDoc(docRef, {
    links,
    updatedAt: serverTimestamp()
  });
  invalidateCache("profile:socials");
}
