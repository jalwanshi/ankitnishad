import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Skill } from "@/types/portfolio";

const COLLECTION_NAME = "skills";

const DEFAULT_SKILLS: Omit<Skill, "id">[] = [
  { name: "Business Process Understanding", percentage: 90, group: "Business Development" },
  { name: "Sales & Solution Strategy", percentage: 85, group: "Business Development" },
  { name: "Process Mapping", percentage: 90, group: "Process Automation" },
  { name: "Automation Strategy", percentage: 90, group: "Process Automation" },
  { name: "CRM / ERP / Odoo / Reporting", percentage: 85, group: "Process Automation" }
];

export async function getSkills(): Promise<Skill[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(colRef);
    const skillsList: Skill[] = [];
    
    querySnapshot.forEach((docSnap) => {
      skillsList.push({ id: docSnap.id, ...docSnap.data() } as Skill);
    });

    // If Firestore is empty, auto-seed defaults so the user has real actual data in Firestore immediately
    if (skillsList.length === 0) {
      console.log("No skills found in Firestore. Seeding defaults...");
      const seededSkills: Skill[] = [];
      for (const skill of DEFAULT_SKILLS) {
        const docRef = await addDoc(colRef, {
          ...skill,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        seededSkills.push({ id: docRef.id, ...skill } as Skill);
      }
      return seededSkills;
    }

    return skillsList;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return [];
  }
}

export async function addSkill(skill: Omit<Skill, "id">): Promise<string> {
  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, {
    ...skill,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateSkill(id: string, skill: Partial<Skill>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...skill,
    updatedAt: serverTimestamp()
  });
}

export async function deleteSkill(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
