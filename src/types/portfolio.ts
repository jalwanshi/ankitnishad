export interface Profile {
  fullName: string;
  roleTitle: string;
  professionalTagline: string;
  shortBio: string;
  detailedBio: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  location: string;
  heroEyebrow: string;
  heroHeading: string;
  heroSupportingText: string;
  heroPrimaryCtaText: string;
  heroSecondaryCtaText: string;
  seoTitle: string;
  seoDescription: string;
  resumeUrl?: string;
  heroImageUrl?: string;
  aboutImageUrl?: string;
  signatureImageUrl?: string;
  linkedinEmbedCodes?: string[];
}

export interface Metric {
  value: string;
  enabled: boolean;
  label: string;
}

export interface ProfileMetrics {
  projectsDelivered: Metric;
  businessConsultations: Metric;
  toolsHandled: Metric;
  industryDomains: Metric;
  happyClients: Metric;
  automationsBuilt: Metric;
}

export interface CareerMilestone {
  id: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrentRole: boolean;
  designation: string;
  roleSummary: string;
  responsibilities: string[];
  achievements: string[];
  skills: string[];
  tools: string[];
  location?: string;
  workMode?: string;
  companyLogoUrl?: string;
  displayOrder: number;
  published: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  industry: string;
  clientName?: string;
  clientContext: string;
  businessChallenge: string;
  operationalGaps: string[];
  proposedSolution: string;
  solutionModules: string[];
  ankitRole: string;
  timeSaved?: string;
  manualWorkReduction?: string;
  dataAccuracyImprovement?: string;
  finalResult: string;
  technologies: string[];
  coverImageUrl?: string;
  galleryImages?: string[];
  projectType?: string;
  year?: string;
  status?: string;
  actualResults?: {
    timeSaved?: string;
    workReduced?: string;
    accuracyImprovement?: string;
  };
  featured: boolean;
  published: boolean;
  displayOrder: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface ContactEnquiry {
  id: string;
  fullName: string;
  companyName: string;
  designation?: string;
  email: string;
  phone: string;
  linkedinUrl?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  currentTools?: string;
  currentProcess?: string;
  challenge: string;
  serviceRequired: string;
  budget?: string;
  timeline?: string;
  preferredDate?: string;
  preferredTime?: string;
  status: "new" | "contacted" | "qualified" | "closed";
  source: "portfolio";
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isEnabled: boolean;
  displayOrder: number;
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  group: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readingTime: string;
  category: string;
  published: boolean;
  createdAt?: any;
  updatedAt?: any;
}
