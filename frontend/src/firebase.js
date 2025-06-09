// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1oMQ54pcDuO2yBFweKSoVAj3eZKoJKeI",
  authDomain: "summary-bullets.firebaseapp.com",
  projectId: "summary-bullets",
  storageBucket: "summary-bullets.appspot.com",
  messagingSenderId: "912156207243",
  appId: "1:912156207243:web:35434c71b7e2ab44b34c8e",
  measurementId: "G-38BKR03L9S",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
