/* eslint-disable import/no-mutable-exports */
// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  Auth,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  applyActionCode,
} from 'firebase/auth';
import {
  getStorage,
  getDownloadURL,
  ref,
  FirebaseStorage,
} from 'firebase/storage';
import { firebaseConfig } from '../env';
import { queryClient } from '../App';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

enum FirebaseEmailAction {
  RESET_PASSWORD = 'resetPassword',
  VERIFY_EMAIL = 'verifyEmail',
  RECOVER_EMAIL = 'recoverEmail',
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

// Initialize Firebase services, should be called as soon as possible
export const initializeFirebase = () => {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  storage = getStorage(app, 'gs://bablo-project.appspot.com');
};

const signUpWithEmailAndPassword = (email: string, password: string) => {
  if (!auth) {
    throw new Error('Firebase is not initialized');
  }
  return createUserWithEmailAndPassword(auth, email, password);
};

const sendEmailVerificationLink = () => {
  if (!auth || !auth.currentUser) {
    throw new Error('Firebase is not initialized');
  }
  return sendEmailVerification(auth.currentUser);
};

const logout = async () => {
  if (!auth) {
    throw new Error('Firebase is not initialized');
  }
  try {
    await signOut(auth);
    queryClient.clear();
  } catch (error) {
    console.log(error);
  }
};

const verifyEmail = (oobCode: string) => {
  if (!auth) {
    throw new Error('Firebase is not initialized');
  }
  return applyActionCode(auth, oobCode);
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
  logout,
  signUpWithEmailAndPassword,
  sendEmailVerificationLink,
  verifyEmail,
  FirebaseEmailAction,
};
