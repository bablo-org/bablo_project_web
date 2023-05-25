/* eslint-disable import/no-mutable-exports */
// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut,
  Auth,
} from 'firebase/auth';
import {
  getStorage,
  getDownloadURL,
  ref,
  FirebaseStorage,
} from 'firebase/storage';
import { firebaseConfig } from '../env';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

// Initialize Firebase services, should be called as soon as possible
export const initializeFirebase = () => {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app, 'gs://bablo-project.appspot.com');
  // Do NOT sign out user in current browser
  setPersistence(auth, browserLocalPersistence);
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
  signOut,
};
