// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut
} from "firebase/auth";
import { firebaseConfig } from "../env";
import { getStorage, getDownloadURL, ref} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

let app = null;
let auth = null;
let storage = null;

// Initialize Firebase services, should be called as soon as possible
export const initializeFirebase = () => {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app, 'gs://bablo-project.appspot.com');
  // Do NOT sign out user in current browser
  setPersistence(auth, browserLocalPersistence)
};

// export services for future usage
export {
  app,
  auth,
  storage,
  ref,
  getDownloadURL,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
};
