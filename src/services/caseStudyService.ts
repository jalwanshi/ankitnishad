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
  limit,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { CaseStudy } from "@/types/portfolio";

const COLLECTION_NAME = "projects";

export async function getPublishedCaseStudies(): Promise<CaseStudy[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where("published", "==", true));
    const querySnapshot = await getDocs(q);
    const projects: CaseStudy[] = [];
    querySnapshot.forEach((docSnap) => {
      projects.push({ id: docSnap.id, ...docSnap.data() } as CaseStudy);
    });
    return projects.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  } catch (error) {
    console.error("Error fetching published case studies:", error);
    return [];
  }
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy("displayOrder", "asc"));
    const querySnapshot = await getDocs(q);
    const projects: CaseStudy[] = [];
    querySnapshot.forEach((docSnap) => {
      projects.push({ id: docSnap.id, ...docSnap.data() } as CaseStudy);
    });
    return projects;
  } catch (error) {
    console.error("Error fetching all case studies:", error);
    return [];
  }
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where("slug", "==", slug), where("published", "==", true), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return { id: docSnap.id, ...docSnap.data() } as CaseStudy;
    }
    return null;
  } catch (error) {
    console.error("Error fetching case study by slug:", error);
    return null;
  }
}

export async function getCaseStudy(id: string): Promise<CaseStudy | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as CaseStudy;
  }
  return null;
}

export async function createCaseStudy(project: Omit<CaseStudy, "id">): Promise<string> {
  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, {
    ...project,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateCaseStudy(id: string, project: Partial<CaseStudy>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await setDoc(docRef, {
    ...project,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function deleteCaseStudy(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
