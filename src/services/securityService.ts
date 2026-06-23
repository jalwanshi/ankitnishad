import { doc, getDoc, collection, getDocs, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const COLLECTION_NAME = "adminSecurity";

export async function verifyAdminPin(pin: string): Promise<boolean> {
  if (!pin || pin.length !== 6) return false;
  try {
    const docRef = doc(db, COLLECTION_NAME, `PIN_${pin}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error("Error verifying PIN:", error);
    return false;
  }
}

export async function changeAdminPin(newPin: string): Promise<boolean> {
  if (!newPin || newPin.length !== 6) throw new Error("PIN must be exactly 6 digits.");
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(colRef);
    
    // Delete all existing PIN documents
    const deletePromises = querySnapshot.docs.map(docSnap => deleteDoc(doc(db, COLLECTION_NAME, docSnap.id)));
    await Promise.all(deletePromises);

    // Create the new PIN document
    const newDocRef = doc(db, COLLECTION_NAME, `PIN_${newPin}`);
    await setDoc(newDocRef, { createdAt: new Date().toISOString() });
    
    return true;
  } catch (error) {
    console.error("Error changing PIN:", error);
    throw error;
  }
}
