// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0TeVRIoLRXgSDTk-EtxL1Q4MBq86HgRU",
  authDomain: "inventory-management-4a509.firebaseapp.com",
  projectId: "inventory-management-4a509",
  storageBucket: "inventory-management-4a509.appspot.com",
  messagingSenderId: "598467716851",
  appId: "1:598467716851:web:bf04014f3b780e5b2d7986",
  measurementId: "G-KB0VK8BBYC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {firestore}