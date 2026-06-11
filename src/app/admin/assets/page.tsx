"use client";

import { useEffect, useState } from "react";
import { getProfile, saveProfile } from "@/services/profileService";
import { validateFile, uploadAsset } from "@/services/assetService";
import { Profile } from "@/types/portfolio";
import { Image as ImageIcon, FileText, Upload, RefreshCw, Eye, AlertCircle, Check } from "lucide-react";

export default function AdminAssets() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "success" });

  // Upload states
  const [heroProgress, setHeroProgress] = useState(-1);
  const [aboutProgress, setAboutProgress] = useState(-1);
  const [resumeProgress, setResumeProgress] = useState(-1);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Error loading profile info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "hero" | "about" | "resume") => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setMessage({ text: "", type: "success" });

    // Validate
    const validation = validateFile(file, type === "resume" ? "pdf" : "image");
    if (!validation.valid) {
      setMessage({ text: validation.error || "Invalid file.", type: "error" });
      return;
    }

    // Set progress state
    const setProgress = type === "hero" ? setHeroProgress : type === "about" ? setAboutProgress : setResumeProgress;
    setProgress(0);

    try {
      const folder = type === "hero" ? "hero" : type === "about" ? "about" : "resume";
      const downloadUrl = await uploadAsset(file, folder, (progress) => {
        setProgress(progress);
      });

      // Save to Firestore
      const field = type === "hero" ? "heroImageUrl" : type === "about" ? "aboutImageUrl" : "resumeUrl";
      await saveProfile({ [field]: downloadUrl });
      
      // Update local state
      setProfile({
        ...profile,
        [field]: downloadUrl
      });

      setMessage({ text: `${type === "resume" ? "Resume PDF" : "Portrait image"} uploaded successfully!`, type: "success" });
    } catch (err: any) {
      console.error(err);
      setMessage({ text: `Upload failed: ${err.message}`, type: "error" });
    } finally {
      // Clear progress
      setTimeout(() => setProgress(-1), 1000);
      setTimeout(() => setMessage({ text: "", type: "success" }), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="w-6 h-6 border-2 border-primary-black border-t-transparent animate-spin rounded-full" />
        <span className="text-xs uppercase tracking-widest text-muted-grey">Loading assets manager...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="border border-border-grey bg-white p-8 text-center text-xs text-muted-grey uppercase tracking-widest">
        Asset data could not be loaded. Please seed the database first.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="border-b border-border-grey pb-6">
        <h1 className="font-display text-3xl font-light text-primary-black uppercase tracking-wider">
          Visual Assets
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-muted-grey mt-1">
          Upload and manage your Hero Portrait, About Portrait, and Resume PDF document
        </p>
      </div>

      {message.text && (
        <div className={`text-xs py-3 px-4 text-center border font-light ${
          message.type === "error" 
            ? "bg-red-50 border-red-200 text-red-600" 
            : "bg-green-50 border-green-200 text-green-700"
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hero Portrait */}
        <div className="border border-border-grey bg-white p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-primary-black" />
              <h3 className="font-display text-base uppercase tracking-wider text-primary-black">
                Hero Portrait
              </h3>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-muted-grey mb-4 leading-relaxed">
              Recommended dimensions: **800 x 1000 px** (4:5 Aspect Ratio). Must be B&W portrait with transparent background. Max size 10MB.
            </p>
            {profile.heroImageUrl ? (
              <div className="relative aspect-[4/5] max-w-[200px] border border-border-grey bg-soft-bg mb-4 mx-auto select-none overflow-hidden">
                <img
                  src={profile.heroImageUrl}
                  alt="Hero Portrait Preview"
                  className="object-contain w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-[4/5] max-w-[200px] border border-dashed border-border-grey bg-soft-bg mb-4 mx-auto flex items-center justify-center text-[10px] text-muted-grey uppercase tracking-widest">
                No Portrait Uploaded
              </div>
            )}
          </div>

          <div className="space-y-3">
            {heroProgress >= 0 && (
              <div className="w-full bg-border-grey h-[3px] overflow-hidden">
                <div className="bg-black h-full transition-all duration-300" style={{ width: `${heroProgress}%` }} />
              </div>
            )}
            <label className="w-full flex justify-center items-center gap-2 border border-primary-black hover:bg-primary-black hover:text-white text-primary-black py-3 text-[10px] uppercase tracking-widest font-semibold transition-colors cursor-pointer text-center">
              <Upload className="w-3.5 h-3.5" />
              {heroProgress >= 0 ? `Uploading (${heroProgress}%)` : "Upload Hero Image"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "hero")} disabled={heroProgress >= 0} />
            </label>
          </div>
        </div>

        {/* About Portrait */}
        <div className="border border-border-grey bg-white p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-primary-black" />
              <h3 className="font-display text-base uppercase tracking-wider text-primary-black">
                About Portrait
              </h3>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-muted-grey mb-4 leading-relaxed">
              Recommended dimensions: **800 x 1000 px** (4:5 Aspect Ratio). B&W action photo representing software consultation. Max size 10MB.
            </p>
            {profile.aboutImageUrl ? (
              <div className="relative aspect-[4/5] max-w-[200px] border border-border-grey bg-soft-bg mb-4 mx-auto select-none overflow-hidden">
                <img
                  src={profile.aboutImageUrl}
                  alt="About Portrait Preview"
                  className="object-contain w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-[4/5] max-w-[200px] border border-dashed border-border-grey bg-soft-bg mb-4 mx-auto flex items-center justify-center text-[10px] text-muted-grey uppercase tracking-widest">
                No Portrait Uploaded
              </div>
            )}
          </div>

          <div className="space-y-3">
            {aboutProgress >= 0 && (
              <div className="w-full bg-border-grey h-[3px] overflow-hidden">
                <div className="bg-black h-full transition-all duration-300" style={{ width: `${aboutProgress}%` }} />
              </div>
            )}
            <label className="w-full flex justify-center items-center gap-2 border border-primary-black hover:bg-primary-black hover:text-white text-primary-black py-3 text-[10px] uppercase tracking-widest font-semibold transition-colors cursor-pointer text-center">
              <Upload className="w-3.5 h-3.5" />
              {aboutProgress >= 0 ? `Uploading (${aboutProgress}%)` : "Upload About Image"}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "about")} disabled={aboutProgress >= 0} />
            </label>
          </div>
        </div>
      </div>

      {/* Resume PDF */}
      <div className="border border-border-grey bg-white p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border-grey pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-black" />
            <h3 className="font-display text-base uppercase tracking-wider text-primary-black">
              Resume Document
            </h3>
          </div>
          {profile.resumeUrl ? (
            <span className="text-[8px] uppercase tracking-widest font-semibold bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check className="w-2.5 h-2.5" /> Available
            </span>
          ) : (
            <span className="text-[8px] uppercase tracking-widest font-semibold bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 rounded-full">
              Unavailable
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex-grow space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-grey font-semibold">
              Supported format: PDF only. Maximum size: 20MB.
            </p>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest text-primary-black hover:underline font-bold"
              >
                <Eye className="w-3 h-3" /> View Uploaded PDF
              </a>
            )}
          </div>

          <div className="min-w-[200px] w-full sm:w-auto space-y-3">
            {resumeProgress >= 0 && (
              <div className="w-full bg-border-grey h-[3px] overflow-hidden">
                <div className="bg-black h-full transition-all duration-300" style={{ width: `${resumeProgress}%` }} />
              </div>
            )}
            <label className="w-full flex justify-center items-center gap-2 border border-primary-black hover:bg-primary-black hover:text-white text-primary-black px-6 py-3 text-[10px] uppercase tracking-widest font-semibold transition-colors cursor-pointer text-center">
              <Upload className="w-3.5 h-3.5" />
              {resumeProgress >= 0 ? `Uploading (${resumeProgress}%)` : "Upload Resume PDF"}
              <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => handleUpload(e, "resume")} disabled={resumeProgress >= 0} />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
