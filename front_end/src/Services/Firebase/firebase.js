// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGL8DZRDwFfNTww4nfKQgmlnxoViOlA1c",
  authDomain: "tokoijo--auth.firebaseapp.com",
  projectId: "tokoijo--auth",
  storageBucket: "tokoijo--auth.firebasestorage.app",
  messagingSenderId: "330483441156",
  appId: "1:330483441156:web:a26fd8980ccbbe6c0e1f51",
  measurementId: "G-ZC33K3CCMP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);