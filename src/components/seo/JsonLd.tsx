"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/services/profileService";

export default function JsonLd() {
  const [profile, setProfile] = useState<any>({ fullName: "Ankit Nishad", email: "", phone: "", linkedinUrl: "", shortBio: "" });

  useEffect(() => {
    async function loadJsonLd() {
      try {
        const p = await getProfile();
        if (p) {
          setProfile(p);
        }
      } catch (err) {
        console.error("Failed to load JSON-LD schema profile data:", err);
      }
    }
    loadJsonLd();
  }, []);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": profile.fullName || "Ankit Nishad",
    "jobTitle": profile.roleTitle || profile.professionalHeadline || "Business Automation Consultant",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": profile.location || "Noida",
      "addressCountry": "India"
    },
    "email": profile.email,
    "telephone": profile.phone,
    "url": "https://ankitnishad.com",
    "sameAs": [
      profile.linkedinUrl
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": `${profile.fullName || "Ankit Nishad"} | IT Sales & Automation`,
    "image": "https://ankitnishad.com/assets/hero-portrait.png",
    "telePhone": profile.phone,
    "email": profile.email,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": profile.location || "Noida",
      "addressCountry": "India"
    },
    "priceRange": "$$",
    "url": "https://ankitnishad.com"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
