import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCySNzY3JXAvFTtnDtt71CQRdW6xXIXBk8",
  authDomain: "denogames-7c4dc.firebaseapp.com",
  projectId: "denogames-7c4dc",
  storageBucket: "denogames-7c4dc.appspot.com",
  messagingSenderId: "968989996413",
  appId: "1:968989996413:web:e80c47743563405fecc814",
  measurementId: "G-BVT9G2JVYJ",
};

// const analytics = getAnalytics(app);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, app, db };
