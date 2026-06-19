import {
  collection,
  doc,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const FIRESTORE_BATCH_SIZE = 450;

function removeUndefined(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(removeUndefined);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, removeUndefined(entryValue)])
    );
  }

  return value;
}

export async function addDocumentsInBatches<T extends object>(
  collectionName: string,
  records: T[]
): Promise<number> {
  for (let start = 0; start < records.length; start += FIRESTORE_BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = records.slice(start, start + FIRESTORE_BATCH_SIZE);

    chunk.forEach((record) => {
      const documentRef = doc(collection(db, collectionName));
      batch.set(documentRef, {
        ...(removeUndefined(record) as T),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });

    await batch.commit();
  }

  return records.length;
}
