export interface Profile {
  fullName: string;
  professionalHeadline: string;
  shortTagline: string;
  shortBio: string;
  fullBio: string;
  currentRole: string;
  currentCompany: string;
  location: string;
  availability: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  bookingUrl: string;
  resumeUrl: string;
  heroImageUrl: string;
  aboutImageUrl: string;
  signatureImageUrl: string;
  metrics: {
    projectsDelivered: string;
    businessConsultations: string;
    toolsHandled: string;
    industryDomains: string;
    happyClients: string;
    automationsBuilt: string;
  };
}

export interface CareerMilestone {
  id: string;
  designation: string;
  company: string;
  employmentType: string;
  workMode: string;
  location: string;
  duration: string;
  roleSummary: string;
  responsibilities: string[];
  achievements: string[];
  skills: string[];
  tools: string[];
  isCurrent?: boolean;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  idealClient: string;
  problemsSolved: string[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  industry: string;
  projectType: string;
  status: string;
  year: string;
  timeline: string;
  platform: string;
  clientContext: string;
  businessChallenge: string;
  operationalGaps: string[];
  proposedSolution: string;
  ankitRole: string;
  actualResults: {
    timeSaved?: string;
    workReduced?: string;
    dataAccuracy?: string;
    reporting?: string;
    other?: string[];
  };
  featured: boolean;
}

export const profileData: Profile = {
  fullName: "Ankit Nishad",
  professionalHeadline: "Business Development Manager - IT Sales & Business Automation",
  shortTagline: "Bridging the gap between business processes and technical solutions through automation, custom software, and digital growth.",
  shortBio: "I help growing businesses identify operational gaps and replace manual, disconnected processes with practical software, automation, and digital systems.",
  fullBio: "I help growing businesses replace scattered, manual operations with clear digital systems.\n\nMy work starts by understanding how teams manage sales, operations, follow-ups, inventory, reporting, documents, communication, and customer data today.\n\nI identify where spreadsheets, WhatsApp threads, emails, registers, and disconnected tools create delays or errors. From there, I turn real workflows into practical requirements for CRM, ERP, DMS, client portals, sales automation, inventory systems, and workflow automation.\n\nThe goal is simple: recommend the right system for the real problem, not generic software for every business.",
  currentRole: "Business Automation Consultant",
  currentCompany: "Independent Practice",
  location: "Noida, India",
  availability: "Open to new opportunities",
  email: "hello@ankitnishad.com",
  phone: "+91 12345 67890",
  linkedinUrl: "https://linkedin.com/in/ankitnishad",
  bookingUrl: "https://cal.com/ankitnishad",
  resumeUrl: "/assets/resume.pdf",
  heroImageUrl: "/assets/hero-portrait.png",
  aboutImageUrl: "/assets/about-portrait.png",
  signatureImageUrl: "/assets/image.png",
  metrics: {
    projectsDelivered: "+200",
    businessConsultations: "+50",
    toolsHandled: "50+",
    industryDomains: "18+",
    happyClients: "20+",
    automationsBuilt: "200+",
  }
};

export const careerData: CareerMilestone[] = [
  {
    id: "role1",
    designation: "Business Automation Consultant (Independent)",
    company: "Independent Practice",
    employmentType: "Self-employed",
    workMode: "Remote / Hybrid",
    location: "Noida, India",
    duration: "2023 - Present",
    roleSummary: "Helping businesses automate workflows, improve efficiency, and scale with custom solutions.",
    responsibilities: [
      "Conduct in-depth business process audits and workflow analysis",
      "Design cloud-based automation systems using tools like Make.com, Zapier, and custom APIs",
      "Coordinate requirement specifications with developers and clients to ensure aligned delivery",
      "Consult on CRM, ERP, and Database systems selections tailored to specific company sizes"
    ],
    achievements: [
      "Automated complete patient billing workflows for a healthcare client, reducing manual processing time by 40%",
      "Helped over 20+ businesses successfully transition away from manual Google Sheet bottlenecks into consolidated database systems"
    ],
    skills: ["Workflow Automation", "Process Mapping", "Requirements Discovery", "Solution Consulting"],
    tools: ["Make.com", "Zapier", "Odoo", "HubSpot", "Google AppScript"],
    isCurrent: true
  },
  {
    id: "role2",
    designation: "Business Development Manager",
    company: "XYZ Tech Solutions",
    employmentType: "Full-time",
    workMode: "Hybrid",
    location: "Noida, India",
    duration: "2021 - 2023",
    roleSummary: "Led business development, software solution consulting, and strategic client partnerships.",
    responsibilities: [
      "Identified and acquired B2B clients across healthcare, retail, and manufacturing sectors",
      "Conducted initial discovery calls to outline client challenges and draft technical proposals",
      "Bridged communication between clients and the in-house software development team"
    ],
    achievements: [
      "Successfully coordinated proposals for 50+ custom software and web application projects",
      "Increased the client conversion rate by 25% through refined requirement discovery workshops"
    ],
    skills: ["B2B Sales", "Client Acquisition", "Proposal Management", "Software Solutioning"],
    tools: ["Salesforce", "LinkedIn Sales Navigator", "Slack", "Jira"],
    isCurrent: false
  },
  {
    id: "role3",
    designation: "Solutions Consultant",
    company: "ABC Global",
    employmentType: "Full-time",
    workMode: "On-site",
    location: "Noida, India",
    duration: "2019 - 2021",
    roleSummary: "Worked with clients to architect and implement tailored technology solutions.",
    responsibilities: [
      "Analyzed client business requirements and mapped out detailed standard operating procedures (SOPs)",
      "Created wireframes and functional flowcharts for database and document management architectures",
      "Ensured software solutions delivered met client business goals during the final handover phase"
    ],
    achievements: [
      "Co-designed a Document Management System (DMS) used by over 100+ internal business agents",
      "Reduced implementation timelines by 15% through clearer client-side requirement documentation"
    ],
    skills: ["Business Analysis", "Wireframing", "SOP Mapping", "Project Management"],
    tools: ["Figma", "Miro", "Trello", "Microsoft Visio"],
    isCurrent: false
  },
  {
    id: "role4",
    designation: "Business Development Executive",
    company: "Innovate Systems",
    employmentType: "Full-time",
    workMode: "On-site",
    location: "Noida, India",
    duration: "2017 - 2019",
    roleSummary: "Focused on B2B sales, client communication, and building long-term business relationships.",
    responsibilities: [
      "Conducted outbound lead generation through LinkedIn and email marketing campaigns",
      "Qualified incoming leads and coordinated initial consultation meetings",
      "Managed client relationship accounts and handled follow-up communications"
    ],
    achievements: [
      "Consistently achieved quarterly lead qualification targets, bringing in 30+ enterprise opportunities",
      "Maintained a client satisfaction score of 95% across account management portfolios"
    ],
    skills: ["Cold Outreach", "Lead Qualification", "Account Management", "B2B Communication"],
    tools: ["HubSpot CRM", "Mailchimp", "LinkedIn", "MS Excel"],
    isCurrent: false
  }
];

export const servicesData: Service[] = [
  {
    id: "service1",
    number: "01",
    title: "Business Automation",
    shortDescription: "Automate workflows, reduce manual effort, and improve operational efficiency.",
    idealClient: "Businesses relying heavily on manual entry, Excel sheets, and disconnected tools.",
    problemsSolved: [
      "Time-consuming copy-paste tasks between applications",
      "Human data entry errors and delays in processing",
      "Lack of real-time notifications for critical business updates"
    ]
  },
  {
    id: "service2",
    number: "02",
    title: "Custom Software Consultation",
    shortDescription: "Tailored web applications designed to solve specific, unique business problems.",
    idealClient: "Companies whose processes do not fit into standard off-the-shelf software.",
    problemsSolved: [
      "Inefficiencies caused by rigid software platforms",
      "Lack of custom features needed for unique internal processes",
      "Difficulty in scaling legacy systems as the business grows"
    ]
  },
  {
    id: "service3",
    number: "03",
    title: "UiPath Automation (RPA)",
    shortDescription: "Robotic Process Automation (RPA) to automate repetitive, high-volume computer tasks.",
    idealClient: "Enterprise clients with legacy systems that lack API connections.",
    problemsSolved: [
      "High operational costs for manual back-office tasks",
      "Slow processing speeds for high-volume invoice and order reconciliations",
      "Compliance risks due to human validation oversights"
    ]
  },
  {
    id: "service4",
    number: "04",
    title: "E-commerce Solutions",
    shortDescription: "Scalable online stores integrated with inventory, shipping, and payment systems.",
    idealClient: "Retail, FMCG, and e-commerce startups looking for streamlined operational backends.",
    problemsSolved: [
      "Inventory sync errors across different marketplaces",
      "Manual order processing causing shipping delays",
      "Fragmented payment gateway settlement tracking"
    ]
  },
  {
    id: "service5",
    number: "05",
    title: "Business Process Mapping",
    shortDescription: "In-depth analysis of existing workflows to identify gaps and design optimized systems.",
    idealClient: "Growth-stage companies experiencing scaling bottlenecks.",
    problemsSolved: [
      "Lack of transparency in operational responsibilities",
      "Redundant communication loops and lost action items",
      "Unstructured standard operating procedures (SOPs)"
    ]
  }
];

export const projectsData: Project[] = [
  {
    id: "proj1",
    slug: "hospital-automation",
    title: "Hospital Management & Financial Automation",
    industry: "Healthcare",
    projectType: "Automation & Custom ERP",
    status: "Completed",
    year: "2024",
    timeline: "4 Months",
    platform: "Odoo, Python",
    clientContext: "A multi-specialty hospital group struggling with fragmented patient administrative workflows.",
    businessChallenge: "Manual patient billing and check-in workflows caused major wait times and billing mismatch errors across departments.",
    operationalGaps: [
      "Delayed patient check-in times (average 25 minutes)",
      "Billing discrepancies between departments causing manual reconciliation overhead",
      "Lack of real-time financial tracking for hospital stakeholders"
    ],
    proposedSolution: "Architected a centralized hospital operations dashboard integrating patient registration with Odoo financial accounting modules, automating patient data flow across billing and clinics.",
    ankitRole: "I led requirement discovery, system architecture consulting, and project delivery coordination between clinical heads and the developer team.",
    actualResults: {
      timeSaved: "40% patient check-in time saved",
      workReduced: "60% manual billing work reduced",
      dataAccuracy: "98% data accuracy achieved across patient records",
      reporting: "Real-time stakeholder financial dashboard enabled"
    },
    featured: true
  },
  {
    id: "proj2",
    slug: "engineering-dms",
    title: "Engineering Document Management System",
    industry: "Manufacturing",
    projectType: "Document Automation",
    status: "Completed",
    year: "2024",
    timeline: "3 Months",
    platform: "React, Node.js, AWS S3",
    clientContext: "A heavy machinery manufacturer needing a secure platform to manage version-controlled blueprints.",
    businessChallenge: "Engineers used outdated drawing blueprints, leading to assembly line production defects and manual verification delays.",
    operationalGaps: [
      "Production delays due to blueprints version mismatch",
      "Lack of secure user-access control levels for proprietary IP designs",
      "Unorganized storage structure with no search functionality"
    ],
    proposedSolution: "Designed an AWS S3-powered secure document manager with strict folder version control, metadata tagging, instant search, and automated email approvals.",
    ankitRole: "I conducted design discovery sessions, mapped out permission controls, and wrote detailed SRS documentation.",
    actualResults: {
      timeSaved: "30% blueprint retrieval speed improvement",
      workReduced: "50% review loop speedup",
      dataAccuracy: "Zero blueprint mismatch incidents reported in 6 months",
      reporting: "Real-time document change log dashboard implemented"
    },
    featured: true
  },
  {
    id: "proj3",
    slug: "b2b-lead-tracker",
    title: "Sales CRM & Lead Tracker",
    industry: "B2B Services",
    projectType: "CRM Consulting",
    status: "Completed",
    year: "2024",
    timeline: "2 Months",
    platform: "HubSpot CRM, Zapier",
    clientContext: "A sales outsourcing consultancy using disjointed spreadsheets to track B2B client acquisition pipelines.",
    businessChallenge: "Leads fell through the cracks due to zero follow-up tracking, causing lost pipeline revenue and high agent frustration.",
    operationalGaps: [
      "High lead response time (average 24-48 hours)",
      "No centralized pipeline tracking for regional sales heads",
      "Manual entry of lead source data causing inaccurate attribution reports"
    ],
    proposedSolution: "Set up and optimized HubSpot CRM integrated with Zapier lead capture modules, custom pipelines, automated notifications, and B2B email triggers.",
    ankitRole: "I configured pipeline stages, mapped data fields, set up Zapier automation paths, and conducted training for 15+ sales agents.",
    actualResults: {
      timeSaved: "Response time reduced to less than 1 hour",
      workReduced: "80% manual pipeline data entry eliminated",
      dataAccuracy: "100% lead attribution tracking enabled",
      reporting: "Real-time executive revenue pipeline dashboard implemented"
    },
    featured: true
  }
];
