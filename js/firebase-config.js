// Firebase configuration
// Replace XXXXX with your actual values from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyBoTNNKUnlzBX0De4TOejV7nHMRq5p19z4",
    authDomain: "events-95194.firebaseapp.com",
    projectId: "events-95194",
    storageBucket: "events-95194.firebasestorage.app",
    messagingSenderId: "360786954703",
    appId: "1:360786954703:web:0322fe9bb10138618a6aba",
    measurementId: "G-N68YRLHRTK"
};

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage }; 