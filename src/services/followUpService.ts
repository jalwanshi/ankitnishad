import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export interface FollowUp {
  id: string;
  clientName: string;
  companyName: string;
  type: "Call" | "Email" | "LinkedIn" | "WhatsApp" | "Meeting" | "Proposal Reminder" | "General Follow-up";
  dueDate: string;
  status: "Overdue" | "Today" | "Upcoming" | "Completed";
  notes: string;
  createdAt?: any;
  updatedAt?: any;
}

const COLLECTION_NAME = "followUps";

const DEFAULT_FOLLOWUPS: Omit<FollowUp, "id">[] = [
  {
    clientName: "Rajesh Kumar",
    companyName: "Metro Care Hospital",
    type: "Call",
    dueDate: "2026-06-25",
    status: "Today",
    notes: "Call to discuss integration endpoints for billing modules."
  },
  {
    clientName: "Amit Sharma",
    companyName: "Apex Manufacturing",
    type: "Proposal Reminder",
    dueDate: "2026-06-23",
    status: "Overdue",
    notes: "Follow up on proposal document. Client wanted to check budget with co-founder."
  },
  {
    clientName: "Vikram Malhotra",
    companyName: "Malhotra Logistics",
    type: "Meeting",
    dueDate: "2026-06-28",
    status: "Upcoming",
    notes: "Zoom demonstration of HubSpot CRM pipelines configurations."
  }
];

export async function getFollowUps(): Promise<FollowUp[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(colRef);
    const list: FollowUp[] = [];

    querySnapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as FollowUp);
    });

    // If Firestore is empty, auto-seed defaults so the user has real actual data in Firestore immediately
    if (list.length === 0) {
      console.log("No follow-ups found in Firestore. Seeding defaults...");
      const seeded: FollowUp[] = [];
      for (const item of DEFAULT_FOLLOWUPS) {
        const docRef = await addDoc(colRef, {
          ...item,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        seeded.push({ id: docRef.id, ...item } as FollowUp);
      }
      return seeded;
    }

    return list;
  } catch (error) {
    console.error("Error fetching followups:", error);
    return [];
  }
}

export async function addFollowUp(item: Omit<FollowUp, "id">): Promise<string> {
  const colRef = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(colRef, {
    ...item,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return docRef.id;
}

export async function updateFollowUp(id: string, item: Partial<FollowUp>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...item,
    updatedAt: serverTimestamp()
  });
}

export async function deleteFollowUp(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
