"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/services/profileService";

export default function DynamicSEO() {
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");

  useEffect(() => {
    const loadSEO = async () => {
      try {
        const profile = await getProfile();
        if (profile.seoTitle) setSeoTitle(profile.seoTitle);
        if (profile.seoDescription) setSeoDesc(profile.seoDescription);
      } catch (error) {
        console.error("Failed to load dynamic SEO metadata:", error);
      }
    };

    loadSEO();
  }, []);

  return (
    <>
      {seoTitle && <title>{seoTitle}</title>}
      {seoTitle && <meta property="og:title" content={seoTitle} />}
      {seoDesc && <meta name="description" content={seoDesc} />}
      {seoDesc && <meta property="og:description" content={seoDesc} />}
    </>
  );
}
