import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase/config";

// Storage folders:
// - portfolio/hero/
// - portfolio/about/
// - portfolio/resume/
// - portfolio/case-studies/

export interface UploadProgressCallback {
  (progress: number): void;
}

export function validateFile(file: File, type: "image" | "pdf"): { valid: boolean; error?: string } {
  // Since we are saving as Base64 in Firestore, we MUST keep sizes small to avoid exceeding 1MB document limit.
  const maxImageSize = 700 * 1024; // 700KB limit
  const maxPdfSize = 700 * 1024; // 700KB limit

  if (type === "image") {
    if (!file.type.startsWith("image/")) {
      return { valid: false, error: "Only image files are allowed." };
    }
    if (file.size > maxImageSize) {
      return { valid: false, error: "Image size must be less than 700KB (Base64 limits)." };
    }
  } else if (type === "pdf") {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      return { valid: false, error: "Only PDF files are allowed." };
    }
    if (file.size > maxPdfSize) {
      return { valid: false, error: "PDF size must be less than 700KB (Base64 limits)." };
    }
  }

  return { valid: true };
}

export async function uploadAsset(
  file: File,
  folder: "hero" | "about" | "resume" | "case-studies",
  onProgress?: UploadProgressCallback
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (onProgress) onProgress(30);

    const reader = new FileReader();
    
    reader.onload = () => {
      if (onProgress) onProgress(100);
      resolve(reader.result as string); // Returns a base64 Data URL
    };
    
    reader.onerror = (error) => {
      console.error("Base64 conversion failed:", error);
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

export async function deleteAsset(storagePathOrUrl: string): Promise<void> {
  // Since assets are Base64 strings embedded in Firestore documents,
  // deleting the Firestore document automatically deletes the asset data.
  // We do not need to do anything here.
  return Promise.resolve();
}
