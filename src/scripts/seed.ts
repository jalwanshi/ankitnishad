import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env.local (without dotenv dependency)
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const profileData = {
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
  resumeUrl: "", // Start empty or default to /assets/resume.pdf
  heroImageUrl: "/assets/hero-portrait.png",
  aboutImageUrl: "/assets/about-portrait.png"
};

const metricsData = {
  projectsDelivered: { value: "+200", enabled: true, label: "Projects Delivered" },
  businessConsultations: { value: "+50", enabled: true, label: "Business Consultations" },
  toolsHandled: { value: "50+", enabled: true, label: "Tools/Software Handled" },
  industryDomains: { value: "18+", enabled: true, label: "Industry Domains" },
  happyClients: { value: "20+", enabled: true, label: "Happy Clients" },
  automationsBuilt: { value: "200+", enabled: true, label: "Automations Built" }
};

const socialsData = {
  links: [
    { id: "linkedin", platform: "LinkedIn", url: "https://www.linkedin.com/in/theankitnishad/", isEnabled: true, displayOrder: 1 },
    { id: "email", platform: "Email", url: "mailto:ankitnishad703@gmail.com", isEnabled: true, displayOrder: 2 },
    { id: "phone", platform: "Phone", url: "tel:+916388353247", isEnabled: true, displayOrder: 3 }
  ]
};

async function seed() {
  console.log("Starting database seed script...");

  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("your-")) {
    console.error("Error: Firebase configurations are not set in .env.local");
    process.exit(1);
  }

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  try {
    if (email && password) {
      console.log(`Authenticating as ${email}...`);
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Authentication successful.");
    } else {
      console.log("No SEED_ADMIN_EMAIL provided. Attempting to seed without authentication (will only work if Firestore rules are open/test mode)...");
    }

    console.log("Writing Profile Data...");

    // 1. Seed Profile Main
    console.log("Seeding profile/main...");
    await setDoc(doc(db, "profile", "main"), {
      ...profileData,
      updatedAt: serverTimestamp()
    });

    // 2. Seed Profile Metrics
    console.log("Seeding profile/metrics...");
    await setDoc(doc(db, "profile", "metrics"), {
      ...metricsData,
      updatedAt: serverTimestamp()
    });

    // 3. Seed Profile Socials
    console.log("Seeding profile/socials...");
    await setDoc(doc(db, "profile", "socials"), {
      ...socialsData,
      updatedAt: serverTimestamp()
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Seeding failed with error:", error);
    process.exit(1);
  }
}

seed();
