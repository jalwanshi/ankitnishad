import { db } from "@/lib/firebase/config";
import { BlogPost } from "@/types/portfolio";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  serverTimestamp
} from "firebase/firestore";

const COLLECTION_NAME = "blogs";

export const getAllBlogs = async (): Promise<BlogPost[]> => {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const querySnapshot = await getDocs(colRef);
    const posts: BlogPost[] = [];
    querySnapshot.forEach((docSnap) => {
      posts.push({ id: docSnap.id, ...docSnap.data() } as BlogPost);
    });
    // Sort in-memory by date (descending, assuming dates are formatted parsably or just string sorted. We'll rely on creation time for reliable sorting)
    return posts.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching all blogs:", error);
    throw error;
  }
};

export const getPublishedBlogs = async (): Promise<BlogPost[]> => {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where("published", "==", true));
    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];
    querySnapshot.forEach((docSnap) => {
      posts.push({ id: docSnap.id, ...docSnap.data() } as BlogPost);
    });
    // Sort in-memory by date (descending)
    return posts.sort((a, b) => {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching published blogs:", error);
    throw error;
  }
};

export const getBlogBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as BlogPost;
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    throw error;
  }
};

export const addBlog = async (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...post,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding blog:", error);
    throw error;
  }
};

export const updateBlog = async (id: string, post: Partial<BlogPost>): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...post,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

export const deleteBlog = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};
