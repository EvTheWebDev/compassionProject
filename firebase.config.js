// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCfVHL5q2aWFB6YOtoN5eF3_FGM1U9m_Y",
  authDomain: "compassion-project-inc-stie.firebaseapp.com",
  projectId: "compassion-project-inc-stie",
  storageBucket: "compassion-project-inc-stie.firebasestorage.app",
  messagingSenderId: "603594623806",
  appId: "1:603594623806:web:4b7b24598505303b6afa6f",
  measurementId: "G-RR032P93MY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);