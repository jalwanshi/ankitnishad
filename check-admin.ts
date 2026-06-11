import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import * as fs from "fs";
import * as path from "path";

// Load env
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.substring(0, eqIndex).trim();
    const value = trimmed.substring(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function check() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  try {
    console.log("Logging in as ankitnishad703@gmail.com...");
    const userCred = await signInWithEmailAndPassword(auth, "ankitnishad703@gmail.com", "Ankit@123");
    
    console.log("\n========================================================");
    console.log("✅ LOGIN SUCCESSFUL!");
    console.log("Your Exact User UID is:");
    console.log(userCred.user.uid);
    console.log("========================================================\n");
    
    console.log("If you are getting a PERMISSION_DENIED error, it means the document in the 'adminUsers' collection does not match this UID exactly.");
    console.log("Please double check your Firebase Console:");
    console.log(`1. Collection must be exactly: adminUsers`);
    console.log(`2. Document ID must be exactly: ${userCred.user.uid}`);
    console.log(`3. It must have a field 'role' set to 'admin'`);
    
    process.exit(0);
  } catch (err) {
    console.error("Failed to login:", err);
    process.exit(1);
  }
}

check();
