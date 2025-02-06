import { initializeApp } from "firebase/app";
import {
  getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  GoogleAuthProvider, signInWithPopup
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpmYVO9MklOBJi5xjMpmsb-yOfgNK4gUw",
  authDomain: "bullbear-b549e.firebaseapp.com",
  projectId: "bullbear-b549e",
  storageBucket: "bullbear-b549e.firebasestorage.app",
  messagingSenderId: "428066052619",
  appId: "1:428066052619:web:dc93b76cbbcb954727c50e",
  measurementId: "G-71FJTB2G4R"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signupWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken(); // Retrieve ID token
    return { user: result.user, idToken };
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
}

export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signupWithGoogle };