   import { initializeApp } from "firebase/app";
   import { getFirestore } from "firebase/firestore";

   const firebaseConfig = {
    apiKey: "AIzaSyCXN-TTgZYBrBR_7sU4lP7qMB6cPlF8V0U",
    authDomain: "ssbooking-77251.firebaseapp.com",
    databaseURL: "https://ssbooking-77251-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ssbooking-77251",
    storageBucket: "ssbooking-77251.appspot.com",
    messagingSenderId: "127352779362",
    appId: "1:127352779362:web:e68aca75040fb53c49973b",
    measurementId: "G-E9ENSMKVSN"
  };

   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const db = getFirestore(app);

   export { db };