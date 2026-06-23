import {
  collection,
  doc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { ContactEnquiry } from "@/types/portfolio";
import { addDocumentsInBatches } from "@/lib/firestoreBulk";

const COLLECTION_NAME = "enquiries";

export async function createEnquiry(enquiry: Omit<ContactEnquiry, "id" | "status" | "source">): Promise<string> {
  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, {
    ...enquiry,
    status: "new",
    source: "portfolio",
    notes: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // Asynchronously trigger Telegram alert notification via secure Route Handler
  try {
    fetch("/api/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(enquiry)
    }).catch((err) => console.error("Telegram notification failed:", err));
  } catch (err) {
    console.error("Async notify fetch error:", err);
  }

  return docRef.id;
}

export async function createEnquiriesBulk(
  enquiries: Omit<ContactEnquiry, "id" | "createdAt" | "updatedAt">[]
): Promise<number> {
  return addDocumentsInBatches(COLLECTION_NAME, enquiries);
}

export async function getAllEnquiries(): Promise<ContactEnquiry[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const enquiries: ContactEnquiry[] = [];
    querySnapshot.forEach((docSnap) => {
      enquiries.push({ id: docSnap.id, ...docSnap.data() } as ContactEnquiry);
    });
    return enquiries;
  } catch (error) {
    console.error("Error fetching all enquiries:", error);
    return [];
  }
}

export async function updateEnquiryStatus(id: string, status: ContactEnquiry["status"]): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await setDoc(docRef, {
    status,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function updateEnquiryNotes(id: string, notes: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await setDoc(docRef, {
    notes,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function deleteEnquiry(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
