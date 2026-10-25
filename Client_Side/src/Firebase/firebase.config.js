// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUymTtDYh4dUV4Cm-EgN0Ej4PEE2iNn6o",
  authDomain: "shopery-web.firebaseapp.com",
  projectId: "shopery-web",
  storageBucket: "shopery-web.firebasestorage.app",
  messagingSenderId: "1074893655397",
  appId: "1:1074893655397:web:2c09a9f5ee7cad2558258c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
