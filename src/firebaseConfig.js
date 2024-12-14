// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// httpsz://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQQV9bVPKlx1tUlXNdJdp0Wc-Wrtm_kGs",
    authDomain: "rps-ai-7848f.firebaseapp.com",
    databaseURL: "https://rps-ai-7848f-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "rps-ai-7848f",
    storageBucket: "rps-ai-7848f.firebasestorage.app",
    messagingSenderId: "764483660405",
    appId: "1:764483660405:web:eacaa17986eb9e1e1c663c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };