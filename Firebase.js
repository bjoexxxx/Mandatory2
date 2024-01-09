// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPOAGffwavYj4-j-vSqwMfO-DrYpFovsM",
  authDomain: "mandatory2-3ce32.firebaseapp.com",
  projectId: "mandatory2-3ce32",
  storageBucket: "mandatory2-3ce32.appspot.com",
  messagingSenderId: "921995654812",
  appId: "1:921995654812:web:fcf324e30a928a765bdf59",
  measurementId: "G-WCWCLYKQ23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export {app}