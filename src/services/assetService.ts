// Storage folders:
// - portfolio/hero/
// - portfolio/about/
// - portfolio/signature/
// - portfolio/resume/
// - portfolio/case-studies/

export interface UploadProgressCallback {
  (progress: number): void;
}

const MAX_SOURCE_IMAGE_SIZE = 15 * 1024 * 1024;
const MAX_SOURCE_PDF_SIZE = 500 * 1024;
const MAX_FIRESTORE_IMAGE_BYTES = 500 * 1024;
const MAX_IMAGE_DIMENSION = 1600;

function getStringSize(value: string): number {
  return new Blob([value]).size;
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not convert the file to Base64."));
    reader.readAsDataURL(blob);
  });
}

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(blob);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("The selected image could not be read."));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Image compression failed."));
        }
      },
      type,
      quality
    );
  });
}

async function compressImageBlob(blob: Blob): Promise<string> {
  const image = await loadImage(blob);
  const originalLongestSide = Math.max(image.naturalWidth, image.naturalHeight);
  const initialScale = Math.min(1, MAX_IMAGE_DIMENSION / originalLongestSide);
  let width = Math.max(1, Math.round(image.naturalWidth * initialScale));
  let height = Math.max(1, Math.round(image.naturalHeight * initialScale));
  let quality = 0.84;

  for (let attempt = 0; attempt < 14; attempt += 1) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Your browser does not support image compression.");
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, width, height);

    const compressedBlob = await canvasToBlob(canvas, "image/webp", quality);
    const dataUrl = await readBlobAsDataUrl(compressedBlob);

    if (getStringSize(dataUrl) <= MAX_FIRESTORE_IMAGE_BYTES) {
      return dataUrl;
    }

    if (quality > 0.5) {
      quality -= 0.1;
    } else {
      width = Math.max(1, Math.round(width * 0.82));
      height = Math.max(1, Math.round(height * 0.82));
      quality = 0.74;
    }
  }

  throw new Error(
    "Image is still too large after compression. Please use a smaller image."
  );
}

export async function ensureFirestoreSafeImage(value: string): Promise<string> {
  const trimmedValue = value.trim();
  if (!trimmedValue.startsWith("data:image/")) return trimmedValue;
  if (getStringSize(trimmedValue) <= MAX_FIRESTORE_IMAGE_BYTES) return trimmedValue;

  const response = await fetch(trimmedValue);
  const blob = await response.blob();
  return compressImageBlob(blob);
}

export function validateFile(file: File, type: "image" | "pdf"): { valid: boolean; error?: string } {
  if (type === "image") {
    if (!file.type.startsWith("image/")) {
      return { valid: false, error: "Only image files are allowed." };
    }
    if (file.size > MAX_SOURCE_IMAGE_SIZE) {
      return { valid: false, error: "Image size must be less than 15MB." };
    }
  } else if (type === "pdf") {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      return { valid: false, error: "Only PDF files are allowed." };
    }
    if (file.size > MAX_SOURCE_PDF_SIZE) {
      return { valid: false, error: "PDF size must be less than 500KB for Base64 storage." };
    }
  }

  return { valid: true };
}

export async function uploadAsset(
  file: File,
  folder: "hero" | "about" | "signature" | "resume" | "case-studies",
  onProgress?: UploadProgressCallback
): Promise<string> {
  void folder;
  const type = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    ? "pdf"
    : "image";
  const validation = validateFile(file, type);

  if (!validation.valid) {
    throw new Error(validation.error || "Invalid file.");
  }

  onProgress?.(20);

  if (type === "pdf") {
    const dataUrl = await readBlobAsDataUrl(file);
    onProgress?.(100);
    return dataUrl;
  }

  onProgress?.(45);
  const dataUrl = await compressImageBlob(file);
  onProgress?.(100);
  return dataUrl;
}

export async function deleteAsset(storagePathOrUrl: string): Promise<void> {
  // Since assets are Base64 strings embedded in Firestore documents,
  // deleting the Firestore document automatically deletes the asset data.
  // We do not need to do anything here.
  void storagePathOrUrl;
  return Promise.resolve();
}
