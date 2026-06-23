import { 
  collection, 
  deleteDoc, 
  doc, 
  setDoc,
  getDocs,
  serverTimestamp, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const COLLECTION_NAME = "subscribers";

export async function addSubscriber(email: string): Promise<string> {
  const emailId = email.trim().toLowerCase();
  const docRef = doc(db, COLLECTION_NAME, emailId);

  // Directly set document with emailId as key. Since public users do not have read permission,
  // setDoc writes/updates without requiring a read checks.
  await setDoc(docRef, {
    email: emailId,
    subscribedAt: serverTimestamp()
  });
  
  return emailId;
}

export async function getAllSubscribers(): Promise<any[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy("subscribedAt", "desc"));
    const querySnapshot = await getDocs(q);
    const list: any[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    return list;
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return [];
  }
}

export async function deleteSubscriber(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    throw error;
  }
}
