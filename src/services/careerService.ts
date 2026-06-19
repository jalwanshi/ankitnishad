import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { CareerMilestone } from "@/types/portfolio";
import { cachedFetch, invalidateCache } from "@/lib/cache";
import { addDocumentsInBatches } from "@/lib/firestoreBulk";

const COLLECTION_NAME = "career";

export async function getPublishedCareerTimeline(): Promise<CareerMilestone[]> {
  return cachedFetch("career:published", async () => {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const q = query(colRef, where("published", "==", true));
      const querySnapshot = await getDocs(q);
      const milestones: CareerMilestone[] = [];
      querySnapshot.forEach((docSnap) => {
        milestones.push({ id: docSnap.id, ...docSnap.data() } as CareerMilestone);
      });
      return milestones.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    } catch (error) {
      console.error("Error fetching published career timeline:", error);
      return [];
    }
  });
}

export async function getAllCareerTimeline(): Promise<CareerMilestone[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy("displayOrder", "asc"));
    const querySnapshot = await getDocs(q);
    const milestones: CareerMilestone[] = [];
    querySnapshot.forEach((docSnap) => {
      milestones.push({ id: docSnap.id, ...docSnap.data() } as CareerMilestone);
    });
    return milestones;
  } catch (error) {
    console.error("Error fetching all career timeline:", error);
    return [];
  }
}

export async function getCareerMilestone(id: string): Promise<CareerMilestone | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as CareerMilestone;
  }
  return null;
}

export async function createCareerMilestone(milestone: Omit<CareerMilestone, "id">): Promise<string> {
  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, {
    ...milestone,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  invalidateCache("career:published");
  return docRef.id;
}

export async function createCareerMilestonesBulk(
  milestones: Omit<CareerMilestone, "id">[]
): Promise<number> {
  const imported = await addDocumentsInBatches(COLLECTION_NAME, milestones);
  invalidateCache("career:published");
  return imported;
}

export async function updateCareerMilestone(id: string, milestone: Partial<CareerMilestone>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await setDoc(docRef, {
    ...milestone,
    updatedAt: serverTimestamp()
  }, { merge: true });
  invalidateCache("career:published");
}

export async function deleteCareerMilestone(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
  invalidateCache("career:published");
}
